import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: { command: 'npm run build && npm run preview', port: 4173 },
	testMatch: '**/*.e2e.{ts,js}',

	// CHROMIUM points at an already installed browser when the pinned build is missing
	use: { launchOptions: { executablePath: process.env.CHROMIUM || undefined } }
});
