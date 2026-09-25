/*
 * Makes the app work offline once loaded. Only the app's own files are cached,
 * health data never passes through here: it lives in localStorage and IndexedDB.
 */
import { version } from '$app/env';
import { assets, immutable, prerendered } from '$app/manifest';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `laborwerte-${version}`;

// Manifest paths are relative to the base path, which is where this worker lives
const url = (path: string) => new URL(path, sw.location.href).href;
const SHELL = url('./');
const ASSETS = [...immutable, ...assets, ...prerendered].map((f) => url(f.path));

sw.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => cache.addAll([...ASSETS, SHELL]))
			.then(() => sw.skipWaiting())
	);
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
			.then(() => sw.clients.claim())
	);
});

sw.addEventListener('fetch', (event) => {
	const request = event.request;
	if (request.method !== 'GET' || new URL(request.url).origin !== sw.location.origin) return;

	// Every route renders from the same app shell, so offline navigation falls back to it
	if (request.mode === 'navigate') {
		event.respondWith(fetch(request).catch(async () => (await caches.match(SHELL)) ?? Response.error()));
		return;
	}

	event.respondWith(caches.match(request).then((hit) => hit ?? fetch(request)));
});
