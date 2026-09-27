/**
 * PDFs attached to reports, kept in IndexedDB because localStorage is too small for them.
 * Keyed by profile and report id, nothing here ever leaves the browser.
 */
import { SLUG } from './app';
import { desktop, openInViewer } from './desktop';

const DB = `${SLUG}-files`;
const STORE = 'files';

let opening: Promise<IDBDatabase> | undefined;

function open(): Promise<IDBDatabase> {
	opening ??= new Promise((resolve, reject) => {
		const req = indexedDB.open(DB, 1);
		req.onupgradeneeded = () => req.result.createObjectStore(STORE);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => {
			opening = undefined;
			reject(req.error);
		};
	});
	return opening;
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
	const db = await open();
	return new Promise((resolve, reject) => {
		const req = fn(db.transaction(STORE, mode).objectStore(STORE));
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

export const fileKey = (profile: string, report: string) => `${profile}/${report}`;

export const putFile = (key: string, blob: Blob) => run('readwrite', (s) => s.put(blob, key));

export const getFile = (key: string) => run<Blob | undefined>('readonly', (s) => s.get(key));

export const deleteFile = (key: string) => run('readwrite', (s) => s.delete(key));

export async function deleteProfileFiles(profile: string) {
	const range = IDBKeyRange.bound(`${profile}/`, `${profile}/￿`);
	await run('readwrite', (s) => s.delete(range));
}

/** Shows a stored report, in the system viewer on desktop where the webview opens no tabs */
export async function openFile(key: string, name: string) {
	const blob = await getFile(key);
	if (!blob) return false;
	if (desktop) {
		await openInViewer(name, blob);
		return true;
	}

	const url = URL.createObjectURL(blob);
	window.open(url, '_blank', 'noopener');
	setTimeout(() => URL.revokeObjectURL(url), 60_000);
	return true;
}
