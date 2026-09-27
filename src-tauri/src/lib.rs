use std::fs;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};

use percent_encoding::percent_decode_str;
use tauri::ipc::{InvokeBody, Request};
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;

/// Report files the system viewer may open, anything else could run as a program
const VIEWABLE: &[&str] = &[
    "pdf", "png", "jpg", "jpeg", "gif", "webp", "bmp", "tif", "tiff", "heic", "avif",
];

/// Where opened reports are written, cleared on every start
fn scratch() -> PathBuf {
    std::env::temp_dir().join("transkript-sanguis")
}

/// File contents arrive raw, large reports would crawl through JSON
fn body<'a>(request: &'a Request<'_>) -> Result<&'a [u8], String> {
    match request.body() {
        InvokeBody::Raw(bytes) => Ok(bytes),
        _ => Err("expected raw bytes".into()),
    }
}

/// Header values are URL encoded, names can hold any character
fn header(request: &Request<'_>, name: &str) -> String {
    request
        .headers()
        .get(name)
        .and_then(|v| v.to_str().ok())
        .map(|v| percent_decode_str(v).decode_utf8_lossy().into_owned())
        .unwrap_or_default()
}

/// Saves a file through the native dialog, false when cancelled
#[tauri::command]
async fn save_file(app: AppHandle, request: Request<'_>) -> Result<bool, String> {
    let bytes = body(&request)?;
    let chosen = app
        .dialog()
        .file()
        .set_file_name(header(&request, "name"))
        .blocking_save_file();
    let Some(path) = chosen else { return Ok(false) };

    let path = path.into_path().map_err(|e| e.to_string())?;
    fs::write(path, bytes).map_err(|e| e.to_string())?;
    Ok(true)
}

/// Opens an attached report in the system viewer
#[tauri::command]
async fn open_file(app: AppHandle, request: Request<'_>) -> Result<(), String> {
    let bytes = body(&request)?;
    let name = header(&request, "name");
    let kind = header(&request, "type");

    // Extension from the type, else from the name, and only one a viewer opens
    let from_type = match kind.as_str() {
        "application/pdf" => Some("pdf"),
        k => k.strip_prefix("image/"),
    };
    let from_name = Path::new(&name)
        .extension()
        .and_then(|e| e.to_str())
        .map(str::to_lowercase);
    let ext = [from_type, from_name.as_deref()]
        .into_iter()
        .flatten()
        .find(|e| VIEWABLE.contains(e))
        .ok_or("not a viewable file")?;

    // Bare name only, so a crafted backup cannot write outside the folder
    let stem: String = Path::new(&name)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or_default()
        .chars()
        .map(|c| if c.is_alphanumeric() || " ._()".contains(c) { c } else { '_' })
        .take(100)
        .collect();
    let stem = match stem.trim_matches(['.', ' ']) {
        "" => "report",
        s => s,
    };

    // Own folder per file, a viewer may still hold the previous one open
    let stamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or_default();
    let dir = scratch().join(stamp.to_string());
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join(format!("{stem}.{ext}"));
    fs::write(&path, bytes).map_err(|e| e.to_string())?;

    app.opener()
        .open_path(path.to_string_lossy(), None::<&str>)
        .map_err(|e| e.to_string())
}

/// Points the taskbar button at the exe's own icon, Tauri's window icon is a stretched 16 px frame and blurs.
/// Installed copies borrow the sharp shortcut icon, the portable exe has none.
#[cfg(windows)]
mod taskbar_icon {
    use tauri::WebviewWindow;
    use windows_sys::Win32::Foundation::{HWND, LPARAM, WPARAM};
    use windows_sys::Win32::System::LibraryLoader::GetModuleHandleW;
    use windows_sys::Win32::UI::HiDpi::{GetDpiForWindow, GetSystemMetricsForDpi};
    use windows_sys::Win32::UI::WindowsAndMessaging::{
        LoadImageW, SendMessageW, ICON_BIG, ICON_SMALL, IDI_APPLICATION, IMAGE_ICON,
        LR_DEFAULTCOLOR, SM_CXSMICON, WM_SETICON,
    };

    pub fn apply(window: &WebviewWindow) {
        let Ok(handle) = window.hwnd() else { return };
        let hwnd = handle.0 as HWND;

        unsafe {
            // Null means the running exe, where the icon resource lives
            let exe = GetModuleHandleW(std::ptr::null());
            let dpi = match GetDpiForWindow(hwnd) {
                0 => 96,
                d => d,
            };

            // The taskbar draws the big icon at 24 px, taskbar mods up to about 48.
            // Loaded at 48 since scaling down stays sharp and scaling up blurs.
            let big = (48 * dpi / 96) as i32;
            let small = GetSystemMetricsForDpi(SM_CXSMICON, dpi);

            for (slot, size) in [(ICON_BIG, big), (ICON_SMALL, small)] {
                // Tauri's bundler files the app icon under IDI_APPLICATION
                let icon = LoadImageW(
                    exe,
                    IDI_APPLICATION,
                    IMAGE_ICON,
                    size,
                    size,
                    LR_DEFAULTCOLOR,
                );
                // On failure the window keeps Tauri's icon
                if !icon.is_null() {
                    SendMessageW(hwnd, WM_SETICON, slot as WPARAM, icon as LPARAM);
                }
            }
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![save_file, open_file])
        .setup(|_app| {
            // Reports opened in earlier sessions are health data, they should not linger
            let _ = fs::remove_dir_all(scratch());

            #[cfg(windows)]
            {
                use tauri::Manager;
                for window in _app.webview_windows().values() {
                    taskbar_icon::apply(window);
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
