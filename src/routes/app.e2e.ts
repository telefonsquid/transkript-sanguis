import { expect, test, type Page } from '@playwright/test';

/** Fails the test on any script error or CSP violation */
function watchErrors(page: Page) {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
	return errors;
}

async function onboard(page: Page) {
	await page.goto('/');
	await expect(page).toHaveURL(/\/welcome$/);
	await expect(page.getByRole('heading', { name: 'This is not medical advice' })).toBeVisible();
	await page.getByRole('button', { name: 'I understand' }).click();
	await expect(page.getByRole('heading', { name: 'Your data stays on this device' })).toBeVisible();
	await page.getByRole('button', { name: 'I understand' }).click();
}

async function demo(page: Page) {
	await onboard(page);
	await page.getByRole('button', { name: /View demo/ }).click();
	await expect(page).toHaveURL(/\/$/);
}

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		if (!sessionStorage.getItem('seeded')) {
			localStorage.clear();
			localStorage.setItem('transkript-sanguis:prefs:v1', JSON.stringify({ lang: 'en', second: 'de' }));
			sessionStorage.setItem('seeded', '1');
		}
	});
});

test('first visit shows both disclaimers, then the demo fills the dashboard', async ({ page }) => {
	const errors = watchErrors(page);
	await demo(page);
	await expect(page.getByRole('heading', { name: /Sex hormones/ })).toBeVisible();
	expect(await page.locator('svg[aria-roledescription="chart"]').count()).toBeGreaterThan(30);

	await page.getByRole('button', { name: '[DEMO] Raven' }).click();
	for (const name of ['[DEMO] Sam', '[DEMO] Lena', '[DEMO] Max']) await expect(page.getByRole('button', { name })).toBeVisible();
	expect(errors).toEqual([]);
});

test('chart markers follow the x axis mode', async ({ page }) => {
	await demo(page);
	const marker = page.locator('main svg[aria-roledescription="chart"]').first().locator('circle[stroke="var(--surface)"]').nth(2);
	const before = await marker.getAttribute('cx');
	await page.getByRole('radio', { name: 'Draws' }).click();
	await expect(marker).not.toHaveAttribute('cx', before!);
});

test('focus view explains the value and lists profile specific references', async ({ page }) => {
	await demo(page);
	await page.goto('/analyte/estradiol');
	await expect(page.getByRole('heading', { level: 1, name: /Estradiol/ })).toBeVisible();
	await expect(page.getByRole('row', { name: /HRT target \(Endocrine Society, WPATH\)/ })).toBeVisible();
	await expect(page.getByRole('row', { name: /Monotherapy suppression zone/ })).toBeVisible();

	// Masculinizing targets belong to the other therapy and stay hidden
	await page.goto('/analyte/testosterone');
	await expect(page.getByRole('row', { name: /320 to 1000/ })).toHaveCount(0);
});

test('a manually entered draw is stored and charted', async ({ page }) => {
	await onboard(page);
	await page.getByRole('button', { name: /Create profile/ }).click();
	await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Tester');
	await expect(page.getByRole('radio', { name: 'None' })).toBeChecked();
	await page.getByRole('button', { name: 'Create profile' }).click();
	await page.getByRole('link', { name: /Type them in/ }).click();

	await page.getByLabel('Date of the blood draw').fill('2025-05-01');
	await page.getByRole('combobox', { name: 'Value' }).first().fill('ferritin');
	await page.keyboard.press('Enter');
	await page.getByLabel('Result').first().fill('45');
	await page.getByRole('button', { name: 'Save blood draw' }).click();

	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('link', { name: 'Ferritin' }).first()).toBeVisible();
});

test('the interface switches to German', async ({ page }) => {
	await demo(page);
	await page.getByRole('button', { name: 'EN + DE' }).click();
	await page.getByRole('radiogroup', { name: 'App language' }).getByRole('radio', { name: 'Deutsch' }).check();
	await expect(page.getByRole('heading', { name: /Sexualhormone/ })).toBeVisible();
	await expect(page.getByRole('button', { name: 'DE + EN' })).toBeVisible();
	await expect(page.getByText('Nur in diesem Browser gespeichert', { exact: false })).toBeVisible();
});

test('agent instructions and schema are served as static files', async ({ request }) => {
	const md = await request.get('/agent-instructions.md');
	expect(md.ok()).toBe(true);
	expect(await md.text()).toContain('| estradiol |');

	const schema = await request.get('/import-schema.json');
	expect((await schema.json()).properties.format.const).toBe('transkript-sanguis/draws');
});
