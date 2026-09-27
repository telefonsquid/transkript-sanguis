/**
 * Renders the README images in docs/assets from the demo profiles, once per theme.
 * Run with `node scripts/readme.ts` against a running app (BASE, default the dev server on 5173).
 * Needs a Playwright Chromium, set CHROMIUM to its executable if the pinned build is not installed.
 */
import { chromium, type Page } from '@playwright/test';

const BASE = process.env.BASE ?? 'http://localhost:5173';
const OUT = 'docs/assets';

// GitHub page colours, so the halo around the letters melts into the README background
const GROUND = { light: '#ffffff', dark: '#0d1117' };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM });

for (const theme of ['light', 'dark'] as const) {
	const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5, colorScheme: theme, reducedMotion: 'reduce' });
	await context.addInitScript((theme) => {
		if (sessionStorage.getItem('seeded')) return;
		localStorage.clear();
		localStorage.setItem('transkript-sanguis:prefs:v1', JSON.stringify({ lang: 'en', second: 'de', theme, reduceMotion: true }));
		sessionStorage.setItem('seeded', '1');
	}, theme);
	const page = await context.newPage();

	await page.goto(`${BASE}/welcome`);
	await page.getByRole('button', { name: 'View demo' }).waitFor();
	await logo(page, `${OUT}/logo-${theme}.png`, GROUND[theme]);
	await page.reload();
	await page.getByRole('button', { name: 'View demo' }).click();
	await page.getByRole('button', { name: 'I understand' }).click();
	await page.getByRole('button', { name: 'I understand' }).click();
	await page.getByRole('button', { name: /Raven/ }).click();
	await page.waitForURL(`${BASE}/`);

	await shoot(page, `${OUT}/overview-${theme}.png`);
	for (const view of ['Compare', 'Matrix'] as const) {
		await page.getByRole('navigation').getByRole('button', { name: view }).click();
		await shoot(page, `${OUT}/${view.toLowerCase()}-${theme}.png`);
	}
	await page.goto(`${BASE}/analyte/estradiol`);
	await shoot(page, `${OUT}/focus-${theme}.png`);
	await page.goto(`${BASE}/data/agent`);
	await shoot(page, `${OUT}/agent-${theme}.png`);

	await context.close();
}

await browser.close();

async function shoot(page: Page, path: string) {
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(800);
	await page.screenshot({ path });
}

// The hero wordmark alone on a transparent ground, swash included
async function logo(page: Page, path: string, ground: string) {
	await page.evaluate(() => document.fonts.ready);
	const box = await page.evaluate((ground) => {
		const style = document.createElement('style');
		style.textContent = `*, *::before, *::after { background: transparent !important; visibility: hidden }
			h1, h1 * { visibility: visible }`;
		document.head.append(style);
		const logo = document.querySelector<HTMLElement>('h1 .logo')!;
		logo.style.setProperty('--logo-ground', ground);

		// The swash and descenders reach below the box of the letters
		const r = logo.getBoundingClientRect();
		const em = parseFloat(getComputedStyle(logo).fontSize);
		return { x: r.left - 0.3 * em, y: r.top - 0.15 * em, width: r.width + 0.6 * em, height: r.height + 0.6 * em };
	}, ground);
	await page.screenshot({ path, omitBackground: true, clip: box });
}
