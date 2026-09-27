/**
 * Bridges for the desktop app, whose webview lacks what a browser does on its own:
 * links to other windows, downloads, opening reports and F11.
 * In a browser everything here stays out of the way.
 */
import { SITE_URL } from './app';

/** True inside the Tauri app */
export const desktop = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

/** File contents go to Rust as raw bytes, name and type as headers */
async function send<T>(command: string, name: string, blob: Blob): Promise<T> {
	const { invoke } = await import('@tauri-apps/api/core');
	const bytes = new Uint8Array(await blob.arrayBuffer());
	return invoke<T>(command, bytes, { headers: { name: encodeURIComponent(name), type: blob.type } });
}

/** Saves through the native dialog, false when cancelled */
export const saveFile = (name: string, blob: Blob) => send<boolean>('save_file', name, blob);

/** Opens a report in the system viewer */
export const openInViewer = (name: string, blob: Blob) => send<void>('open_file', name, blob);

/** Where a clicked link should open outside the app, null when the app handles it */
function outside(event: MouseEvent): string | null {
	if (event.defaultPrevented || event.button > 1) return null;
	const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
	if (!(link instanceof HTMLAnchorElement)) return null;

	// Compared by parts since tauri:// pages have no origin on macOS and Linux
	const url = new URL(link.href);
	if (url.protocol !== location.protocol || url.host !== location.host) return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.href : null;

	// Own pages meant for a new tab open on the hosted site
	return link.target === '_blank' ? SITE_URL + url.pathname + url.search + url.hash : null;
}

/** Sends links to the system browser and binds F11, returns the teardown */
export function bindDesktop(): () => void {
	if (!desktop) return () => {};

	// The webview drops new windows and would leave the app for other sites
	async function onLink(event: MouseEvent) {
		const href = outside(event);
		if (!href) return;
		event.preventDefault();
		const { openUrl } = await import('@tauri-apps/plugin-opener');
		await openUrl(href);
	}

	// Holding the key would queue a toggle per repeat
	let busy = false;
	async function onKey(event: KeyboardEvent) {
		if (event.key !== 'F11' || event.repeat || busy) return;
		event.preventDefault();
		busy = true;
		try {
			const { getCurrentWindow } = await import('@tauri-apps/api/window');
			const win = getCurrentWindow();
			await win.setFullscreen(!(await win.isFullscreen()));
		} finally {
			busy = false;
		}
	}

	window.addEventListener('click', onLink, true);
	window.addEventListener('auxclick', onLink, true);
	window.addEventListener('keydown', onKey);
	return () => {
		window.removeEventListener('click', onLink, true);
		window.removeEventListener('auxclick', onLink, true);
		window.removeEventListener('keydown', onKey);
	};
}
