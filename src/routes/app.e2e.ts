import { expect, test, type Page } from '@playwright/test';

/** Fails the test on any script error or CSP violation */
function watchErrors(page: Page) {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
	return errors;
}

/** Landing page first, the disclaimers only once a choice is made */
async function onboard(page: Page, choice: 'View demo' | 'Create profile') {
	await page.goto('/');
	await expect(page).toHaveURL(/\/welcome$/);
	await expect(page).toHaveTitle('Transkript Sanguis');
	await page.getByRole('button', { name: choice }).click();
	await expect(page.getByRole('heading', { name: 'This is not medical advice' })).toBeVisible();
	await page.getByRole('button', { name: 'I understand' }).click();
	await expect(page.getByRole('heading', { name: 'Your data stays on this device' })).toBeVisible();
	await page.getByRole('button', { name: 'I understand' }).click();
}

async function demo(page: Page) {
	await onboard(page, 'View demo');
	await expect(page.getByRole('heading', { name: 'Which demo do you want to see?' })).toBeVisible();
	await page.getByRole('button', { name: /Raven/ }).click();
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

	await page.getByRole('button', { name: 'Raven Demo' }).click();
	for (const name of [/^Sam\b/, /^Lena\b/, /^Max\b/]) await expect(page.getByRole('button', { name })).toBeVisible();
	expect(errors).toEqual([]);
});

test('demo profiles are edited on My data and can only be reset', async ({ page }) => {
	await demo(page);
	await page.getByRole('link', { name: 'My data' }).click();
	await page.getByRole('button', { name: 'Edit profile' }).click();
	await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Renamed');
	await page.getByRole('button', { name: 'Save profile' }).click();
	await expect(page.getByRole('heading', { level: 1, name: 'Renamed' })).toBeVisible();

	await page.goto('/profiles');
	await expect(page.getByRole('button', { name: 'Delete' })).toHaveCount(0);
	page.once('dialog', (d) => d.accept());
	await page.getByRole('listitem').filter({ hasText: 'Renamed' }).getByRole('button', { name: 'Reset' }).click();
	await expect(page.getByRole('listitem').filter({ hasText: 'Raven' })).toBeVisible();
});

test('chart markers follow the x axis mode', async ({ page }) => {
	await demo(page);
	const marker = page.locator('main svg[aria-roledescription="chart"]').first().locator('circle[stroke="var(--surface)"]').nth(2);
	const before = await marker.getAttribute('cx');
	await page.getByRole('radio', { name: 'Draws' }).click();
	await expect(marker).not.toHaveAttribute('cx', before!);
});

test('the filter bar only offers what the current view uses', async ({ page }) => {
	await demo(page);
	await expect(page.getByRole('button', { name: 'Display' })).toBeVisible();
	await page.getByRole('button', { name: 'Table', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Display' })).toHaveCount(0);
	await expect(page.getByRole('radiogroup', { name: 'X', exact: true })).toHaveCount(0);
	await expect(page.getByRole('button', { name: /^Data/ })).toBeVisible();
});

test('focus view explains the value and lists profile specific references', async ({ page }) => {
	await demo(page);
	await page.goto('/analyte/estradiol');
	await expect(page.getByRole('heading', { level: 1, name: /Estradiol/ })).toBeVisible();
	await expect(page.getByRole('row', { name: /HRT target \(Endocrine Society, WPATH\)/ })).toBeVisible();
	await expect(page.getByRole('row', { name: /Monotherapy suppression zone/ })).toBeVisible();

	// HRT specifics sit in their own box, the background unfolds on demand
	await expect(page.getByText('On feminizing HRT (MTF)', { exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Show more' }).click();
	await expect(page.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
	await expect(page.locator('p', { hasText: 'Sources:' }).getByRole('link', { name: 'Endocrine Society 2017' })).toBeVisible();

	// LH has no guideline target, the trans cohort range stands in
	await page.goto('/analyte/lh');
	await expect(page.getByRole('row', { name: /Trans women on HRT/ })).toBeVisible();

	// Masculinizing targets belong to the other therapy and stay hidden
	await page.goto('/analyte/testosterone');
	await expect(page.getByRole('row', { name: /320 to 1000/ })).toHaveCount(0);
});

test('reference rails and table rows switch the same band', async ({ page }) => {
	await demo(page);
	await page.goto('/analyte/estradiol');
	const row = page.getByRole('switch', { name: /Show Monotherapy suppression zone/ });
	await expect(row).toHaveAttribute('aria-checked', 'false');
	await page.getByRole('button', { name: /Monotherapy suppression zone/ }).click();
	await expect(row).toHaveAttribute('aria-checked', 'true');
	await row.click();
	await expect(page.getByRole('button', { name: /Monotherapy suppression zone/ })).toHaveAttribute('aria-pressed', 'false');
});

test('results of one value are edited in place from the focus view', async ({ page }) => {
	await demo(page);
	await page.goto('/analyte/estradiol');
	await page.getByRole('button', { name: 'Edit', exact: true }).click();

	const newest = page.getByRole('textbox', { name: 'Value', exact: true }).first();
	await newest.fill('abc');
	await page.getByRole('button', { name: 'Save', exact: true }).click();
	await expect(page.getByText(/^Not a number/)).toBeVisible();

	await newest.fill('205');
	await page.getByRole('button', { name: 'Save', exact: true }).click();
	await expect(page.getByRole('row', { name: /205 pg\/ml/ })).toBeVisible();
	await page.reload();
	await expect(page.getByRole('row', { name: /205 pg\/ml/ })).toBeVisible();
});

test('reduce motion can be forced and is remembered', async ({ page }) => {
	await demo(page);
	await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
	await page.getByRole('button', { name: /Auto/ }).click();
	await page.getByRole('checkbox', { name: /Reduce motion/ }).check();
	await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
});

test('a manually entered draw is stored and charted', async ({ page }) => {
	await onboard(page, 'Create profile');
	await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Tester');
	await expect(page.getByRole('radio', { name: 'None' })).toBeChecked();
	await page.getByRole('button', { name: 'Create profile' }).click();
	await page.getByRole('link', { name: /By hand/ }).click();

	await page.getByLabel('Date of the blood draw').fill('2025-05-01');

	// Without typing, the list offers suggestions and then the whole catalogue
	await page.getByRole('combobox', { name: 'Value' }).first().focus();
	await expect(page.getByText('All values', { exact: true })).toBeVisible();
	expect(await page.getByRole('option').count()).toBeGreaterThan(100);

	await page.getByRole('combobox', { name: 'Value' }).first().fill('ferritin');
	await page.keyboard.press('Enter');
	await page.getByLabel('Result').first().fill('45');
	await page.getByRole('button', { name: 'Save blood draw' }).click();

	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole('link', { name: 'Ferritin' }).first()).toBeVisible();
});

test('an agent import only takes units the app can convert', async ({ page }) => {
	const errors = watchErrors(page);
	await onboard(page, 'Create profile');
	await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Tester');
	await page.getByRole('button', { name: 'Create profile' }).click();
	await page.goto('/data/agent');

	const results = [
		{ analyte: 'ferritin', value: '45', unit: 'µg/l', low: 15, high: 150 },
		{ analyte: 'ast', value: '22', unit: '$\\sigma/1$', high: 35 },
		{ analyte: 'creatinine', value: '0,8', unit: '$mg/dl$', rangeText: '$0.50-0..90$' }
	];
	await page.getByPlaceholder('Paste JSON here…').fill(JSON.stringify({ format: 'transkript-sanguis/draws', version: 2, draws: [{ date: '2025-05-01', results }] }));
	await page.getByRole('button', { name: 'Check', exact: true }).click();

	// A garbled unit is guessed and waits for a look, a LaTeX wrapped one is read as it is
	const units = page.getByRole('combobox', { name: 'Unit' });
	await expect(units.nth(1)).toHaveValue('U/l');
	await expect(units.nth(2)).toHaveValue('mg/dl');
	await expect(page.getByLabel('Min').nth(2)).toHaveValue('0.5');
	await expect(page.getByRole('button', { name: /Import 1 blood draw/ })).toBeDisabled();

	await page.getByRole('button', { name: /Confirm 1 guessed unit/ }).click();
	await page.getByRole('button', { name: /Import 1 blood draw/ }).click();

	const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('transkript-sanguis:db:v1')!));
	const draw = stored.profiles.find((p: { name: string }) => p.name === 'Tester').draws[0];
	expect(draw.results.find((r: { analyte: string }) => r.analyte === 'ferritin')).toMatchObject({ value: '45', low: 15, high: 150 });
	expect(draw.results.find((r: { analyte: string }) => r.analyte === 'creatinine')).toMatchObject({ low: 0.5, high: 0.9 });
	expect(errors).toEqual([]);
});

test('the interface switches to German', async ({ page }) => {
	await demo(page);
	await page.getByRole('button', { name: 'EN', exact: true }).click();
	await page.getByRole('radiogroup', { name: 'App language' }).getByRole('radio', { name: 'Deutsch' }).check();
	await expect(page.getByRole('heading', { name: /Sexualhormone/ })).toBeVisible();
	await expect(page.getByRole('button', { name: 'DE', exact: true })).toBeVisible();
	await expect(page.getByText('Nur in diesem Browser gespeichert', { exact: false })).toBeVisible();
});

test('the landing page opens first and leads with the own profile', async ({ page }) => {
	await onboard(page, 'Create profile');
	await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Tester');
	await page.getByRole('button', { name: 'Create profile' }).click();
	await page.getByRole('link', { name: /Skip for now/ }).click();
	await expect(page).toHaveURL(/\/$/);

	// A reload stays put, the wordmark leads back to the landing page
	await page.reload();
	await expect(page).toHaveURL(/\/$/);
	await page.getByRole('link', { name: 'Transkript Sanguis' }).click();
	await expect(page).toHaveURL(/\/welcome$/);
	await page.getByRole('button', { name: 'Manage my data' }).click();
	await expect(page).toHaveURL(/\/data$/);

	// A new session starts on the landing page again
	await page.evaluate(() => sessionStorage.removeItem('transkript-sanguis:landed'));
	await page.goto('/data');
	await expect(page).toHaveURL(/\/welcome$/);
	await page.getByRole('button', { name: /Tester/ }).click();
	await expect(page).toHaveURL(/\/$/);
});

test('agent instructions and schema are served as static files', async ({ request }) => {
	const md = await request.get('/agent-instructions.md');
	expect(md.ok()).toBe(true);
	expect(await md.text()).toContain('| estradiol |');

	const schema = await request.get('/import-schema.json');
	expect((await schema.json()).properties.format.const).toBe('transkript-sanguis/draws');
});
