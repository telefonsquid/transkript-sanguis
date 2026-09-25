/**
 * Renders the PNG app icons for the web manifest from the favicon SVG.
 * Run with `node scripts/icons.ts` after changing the icon. Needs a Playwright Chromium,
 * set CHROMIUM to its executable if the pinned build is not installed.
 */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const svg = readFileSync('static/favicon.svg', 'utf8');

// Maskable icons get cropped to a circle by some launchers, so the logo sits in the inner 80 %
const variants = [
	{ file: 'static/icon-192.png', size: 192, pad: 0 },
	{ file: 'static/icon-512.png', size: 512, pad: 0 },
	{ file: 'static/icon-maskable-512.png', size: 512, pad: 0.1 },
	{ file: 'static/apple-touch-icon.png', size: 180, pad: 0 }
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM });
const page = await browser.newPage();

for (const v of variants) {
	const inner = v.size * (1 - 2 * v.pad);
	await page.setViewportSize({ width: v.size, height: v.size });
	await page.setContent(
		`<body style="margin:0;display:grid;place-items:center;width:${v.size}px;height:${v.size}px;background:${v.pad ? '#1b1b1a' : 'transparent'}">
			<div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div>
		</body>`
	);
	await page.screenshot({ path: v.file, omitBackground: !v.pad });
}

await browser.close();
