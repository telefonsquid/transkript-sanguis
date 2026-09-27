import { readFileSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

// The Tauri CLI sets this for its dev server and build
const desktop = !!process.env.TAURI_ENV_PLATFORM;

export default defineConfig({
	// Lets the desktop app tell whether a newer release exists (src/lib/update.ts)
	define: {
		__APP_VERSION__: JSON.stringify(version)
	},

	// Tauri expects the dev server on the port of devUrl, PORT runs a second one beside it
	server: {
		port: Number(process.env.PORT) || 5173,
		strictPort: true
	},

	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true),
				experimental: { async: true }
			},

			// Static build with a single page fallback, any web server can host it (see Dockerfile).
			// The desktop app serves index.html for unknown paths.
			adapter: adapter({ fallback: desktop ? 'index.html' : '200.html' }),

			// The desktop app ships its files, offline caching has nothing to add
			serviceWorker: { register: !desktop },

			// connect-src 'self' is what keeps the "nothing leaves this device" promise technically true.
			// The desktop app adds its bridge and GitHub for the opt in update check.
			csp: {
				mode: 'hash',
				directives: {
					'default-src': ['self'],
					'script-src': ['self'],
					'style-src': ['self', 'unsafe-inline'],
					'img-src': ['self', 'data:', 'blob:'],
					'font-src': ['self', 'data:'],
					'connect-src': desktop ? ['self', 'ipc:', 'http://ipc.localhost', 'https://api.github.com'] : ['self'],
					'worker-src': ['self'],
					'manifest-src': ['self'],
					'object-src': ['none'],
					'base-uri': ['self'],
					'form-action': ['self']
				}
			}
		})
	]
});
