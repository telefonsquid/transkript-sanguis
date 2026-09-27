<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { untrack } from 'svelte';
	import { fmtIso } from '#lib/analysis.js';
	import AnalytePicker from '#lib/components/AnalytePicker.svelte';
	import { isIsoDate, unitChoices } from '#lib/data/index.js';
	import type { Analyte, Draw, Result, Sex } from '#lib/data/types.js';
	import { fileKey, putFile } from '#lib/files.js';
	import { t } from '#lib/i18n/index.js';
	import { slide } from '#lib/motion.svelte.js';
	import { addCustom, current, deleteDraw, newId, saveDraw } from '#lib/profiles.svelte.js';
	import { fromResult, rowProblem, toResult, type EditRow } from '#lib/rows.js';

	interface Row extends EditRow {
		/** Name of a value that does not exist yet, created on save */
		custom?: string;
	}

	const PANELS: Record<keyof typeof t.manual.panels, string[]> = {
		bloodCount: ['leukocytes', 'erythrocytes', 'hemoglobin', 'hematocrit', 'mcv', 'mch', 'mchc', 'rdw', 'platelets'],
		hormonesFem: ['estradiol', 'testosterone', 'shbg', 'lh', 'fsh', 'prolactin'],
		hormonesMasc: ['testosterone', 'estradiol', 'shbg', 'lh', 'fsh'],
		liver: ['alt', 'ast', 'ggt', 'alp', 'bilirubin'],
		kidney: ['creatinine', 'egfr', 'urea', 'potassium', 'sodium'],
		lipids: ['cholesterol', 'hdl', 'ldl', 'triglycerides'],
		thyroid: ['tsh', 'ft4', 'ft3'],
		iron: ['ferritin', 'iron', 'transferrin', 'b12', 'folate', 'vitamin-d']
	};

	const profile = $derived(current.profile);

	// The draw being edited is read once, later profile changes must not reset the form
	const editing = untrack(() => current.profile?.draws.find((d) => d.id === page.url.searchParams.get('draw')));
	const editingReport = untrack(() => current.profile?.reports.find((r) => r.id === editing?.report));

	let date = $state(editing?.date ?? '');
	let time = $state(editing?.time ?? '');
	let lab = $state(editing?.lab ?? '');
	let rangesFor: Sex | '' = $state(editing?.rangesFor ?? '');
	let fasting: 'unknown' | 'yes' | 'no' = $state(editing?.fasting === undefined ? 'unknown' : editing.fasting ? 'yes' : 'no');
	let notes = $state(editing?.notes?.join('\n') ?? '');
	let file: File | null = $state(null);
	let rows: Row[] = $state(editing?.results.map((r) => fromResult(r, current.lookup(r.analyte), newId('row'))) ?? [blank()]);
	let tried = $state(false);
	let saving = $state(false);

	function blank(analyte: string | null = null): Row {
		const a = analyte ? current.lookup(analyte) : undefined;
		return { key: newId('row'), analyte, value: '', unit: a?.unit ?? '', low: '', high: '', rangeNote: '', flag: '', note: '' };
	}

	function unitOptions(a: Analyte, unit: string): string[] {
		const list = unitChoices(a);
		return unit && !list.includes(unit) ? [unit, ...list] : list;
	}

	const labs = $derived([...new Set((profile?.draws ?? []).map((d) => d.lab).filter(Boolean))] as string[]);
	const sameDay = $derived(!editing && date ? profile?.draws.find((d) => d.date === date) : undefined);

	const filled = $derived(rows.filter((r) => r.analyte || r.custom || r.value.trim()));

	/** A value of the user's own needs a unit here, unlike one read from a report */
	function problem(row: Row): string | undefined {
		const target = row.custom ? 'custom' : row.analyte ? current.lookup(row.analyte) : undefined;
		const p = rowProblem(row, target, filled) ?? (row.custom && !row.unit.trim() ? 'unit' : undefined);
		return p && t.manual.errors[p];
	}

	const errors = $derived(new Map(filled.map((r) => [r.key, problem(r)])));
	const dateError = $derived(!isIsoDate(date) ? t.manual.errors.date : undefined);
	const valid = $derived(!dateError && filled.length > 0 && [...errors.values()].every((e) => !e));

	function pick(row: Row, id: string | null, custom?: string) {
		row.analyte = id;
		row.custom = custom;
		const a = id ? current.lookup(id) : undefined;
		row.unit = a?.unit ?? '';
	}

	function addPanel(ids: string[]) {
		const have = new Set(rows.map((r) => r.analyte));
		const add = ids.filter((id) => !have.has(id) && current.lookup(id)).map((id) => blank(id));
		rows = [...rows.filter((r) => r.analyte || r.custom || r.value), ...add];
	}

	async function save(e: SubmitEvent) {
		e.preventDefault();
		tried = true;
		if (!valid || !profile || saving) return;
		saving = true;

		let report = editing?.report;
		if (file) {
			report ??= newId('report');
			const meta = { id: report, lab: lab.trim() || undefined, issued: date, file: { name: file.name, type: file.type, size: file.size } };
			profile.reports = [...profile.reports.filter((r) => r.id !== report), meta];
			await putFile(fileKey(profile.id, report), file);
		}

		const results: Result[] = filled.map((row) => {
			const analyte = row.custom ? addCustom(profile, row.custom, row.unit.trim()).id : row.analyte!;
			return toResult(row, analyte, current.lookup(analyte)?.unit);
		});

		const draw: Draw = { id: editing?.id ?? newId('draw'), date, results };
		if (time) draw.time = time;
		if (lab.trim()) draw.lab = lab.trim();
		if (rangesFor) draw.rangesFor = rangesFor;
		if (fasting !== 'unknown') draw.fasting = fasting === 'yes';
		const noteLines = notes.split('\n').map((n) => n.trim()).filter(Boolean);
		if (noteLines.length) draw.notes = noteLines;
		if (report) draw.report = report;

		saveDraw(profile, draw);
		goto(resolve('/'));
	}

	function remove() {
		if (!profile || !editing || !confirm(t.common.confirmDelete)) return;
		deleteDraw(profile, editing.id);
		goto(resolve('/data'));
	}

	const field = 'h-9 w-full rounded-md border-line bg-surface px-2.5 text-sm';
	const cell = 'h-8 w-full rounded-md bg-surface px-2 text-sm';
</script>

<svelte:head><title>{editing ? t.manual.editTitle : t.manual.title} · {t.app.name}</title></svelte:head>

<form onsubmit={save} class="mx-auto max-w-5xl space-y-5 p-6" novalidate>
	<header class="flex flex-wrap items-baseline justify-between gap-2">
		<div>
			<a href={resolve('/data')} class="text-xs text-ink-3 hover:text-ink">← {t.data.title}</a>
			<h1 class="text-2xl font-semibold tracking-tight">{editing ? t.manual.editTitle : t.manual.title}</h1>
			{#if profile}<p class="text-xs text-ink-3">{t.profile.title}: <strong class="text-ink-2">{profile.name}</strong></p>{/if}
		</div>
		{#if editing}
			<button type="button" onclick={remove} class="rounded-md border border-line px-3 py-1.5 text-xs text-[var(--critical)] hover:bg-hover">{t.manual.deleteDraw}</button>
		{/if}
	</header>

	<section class="grid gap-4 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3">
		<label class="grid content-start gap-1">
			<span class="text-sm font-medium">{t.manual.date}</span>
			<input type="date" bind:value={date} class={[field, !date && 'empty', tried && dateError && 'border-[var(--critical)]']} required />
			<span class="text-xs text-ink-3">{tried && dateError ? dateError : t.manual.dateHint}</span>
			{#if sameDay}<span class="text-xs text-[var(--serious)]">{t.manual.existing(fmtIso(date))}</span>{/if}
		</label>
		<label class="grid content-start gap-1">
			<span class="text-sm font-medium">{t.manual.time} <span class="font-normal text-ink-3">({t.common.optional})</span></span>
			<input type="time" bind:value={time} class={[field, !time && 'empty']} />
		</label>
		<label class="grid content-start gap-1">
			<span class="text-sm font-medium">{t.manual.lab} <span class="font-normal text-ink-3">({t.common.optional})</span></span>
			<input bind:value={lab} list="labs" class={field} autocomplete="off" />
			<datalist id="labs">{#each labs as l (l)}<option value={l}></option>{/each}</datalist>
			<span class="text-xs text-ink-3">{t.manual.labHint}</span>
		</label>
		<label class="grid content-start gap-1">
			<span class="text-sm font-medium">{t.manual.rangesFor} <span class="font-normal text-ink-3">({t.common.optional})</span></span>
			<select bind:value={rangesFor} class={[field, !rangesFor && 'empty']}>
				<option value="">{t.profile.sexes.unset}</option>
				<option value="female">{t.profile.sexes.female}</option>
				<option value="male">{t.profile.sexes.male}</option>
			</select>
			<span class="text-xs text-ink-3">{t.manual.rangesForHint}</span>
		</label>
		<label class="grid content-start gap-1">
			<span class="text-sm font-medium">{t.manual.fasting} <span class="font-normal text-ink-3">({t.common.optional})</span></span>
			<select bind:value={fasting} class={[field, fasting === 'unknown' && 'empty']}>
				{#each ['unknown', 'yes', 'no'] as const as f (f)}<option value={f}>{t.manual.fastingOptions[f]}</option>{/each}
			</select>
		</label>
		<label class="grid content-start gap-1">
			<span class="text-sm font-medium">{t.manual.report} <span class="font-normal text-ink-3">({t.common.optional})</span></span>
			<input type="file" accept="application/pdf,image/*" onchange={(e) => (file = e.currentTarget.files?.[0] ?? null)} class="text-xs file:mr-2 file:rounded-md file:border file:border-line file:bg-surface-2 file:px-2 file:py-1 file:text-xs" />
			<span class="text-xs text-ink-3">{editingReport?.file && !file ? `📎 ${editingReport.file.name}` : t.manual.reportHint}</span>
		</label>
		<label class="grid content-start gap-1 sm:col-span-2 lg:col-span-3">
			<span class="text-sm font-medium">{t.manual.notes} <span class="font-normal text-ink-3">({t.common.optional})</span></span>
			<textarea bind:value={notes} rows="2" class="w-full rounded-md border-line bg-surface px-2.5 py-1.5 text-sm" placeholder={t.manual.notesHint}></textarea>
		</label>
	</section>

	<section class="rounded-lg border border-line bg-surface">
		<div class="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2.5">
			<h2 class="text-sm font-semibold">{t.manual.results}</h2>
			<span class="ml-auto text-xs text-ink-3">{t.manual.addPanel}:</span>
			{#each Object.entries(PANELS) as [key, ids] (key)}
				<button type="button" onclick={() => addPanel(ids)} class="rounded-md bg-surface-2 px-2 py-1 text-xs text-ink-2 hover:text-ink">{t.manual.panels[key as keyof typeof PANELS]}</button>
			{/each}
		</div>

		<div class="hidden grid-cols-[minmax(0,2.2fr)_7rem_8rem_10rem_4rem_minmax(0,1.2fr)_2rem] gap-2 px-4 pt-2 text-[11px] font-medium text-ink-3 md:grid">
			<span>{t.manual.analyte}</span>
			<span>{t.manual.printedValue}</span>
			<span>{t.manual.unit}</span>
			<span>{t.manual.range} <span class="font-normal">({t.manual.low} / {t.manual.high})</span></span>
			<span>{t.manual.flag}</span>
			<span>{t.manual.note}</span>
			<span></span>
		</div>

		<ul class="divide-y divide-line">
			{#each rows as row (row.key)}
				{const a = $derived(row.analyte ? current.lookup(row.analyte) : undefined)}
				{const err = $derived(errors.get(row.key))}
				{const show = $derived(tried || !!row.value)}
				<li transition:slide class="grid gap-2 px-4 py-2 md:grid-cols-[minmax(0,2.2fr)_7rem_8rem_10rem_4rem_minmax(0,1.2fr)_2rem] md:items-start">
					<AnalytePicker
						value={row.analyte}
						custom={row.custom}
						exclude={rows.filter((r) => r !== row).map((r) => r.analyte ?? '')}
						invalid={show && err === t.manual.errors.analyte}
						onpick={(id, custom) => pick(row, id, custom)}
					/>
					<input bind:value={row.value} placeholder={t.manual.valueHint} inputmode="decimal" aria-label={t.manual.printedValue} class={['num', cell, show && err === t.manual.errors.value ? 'border-[var(--critical)]' : 'border-line']} />
					{#if a}
						<select bind:value={row.unit} aria-label={t.manual.unit} class={[cell, 'pr-6', show && err === t.manual.errors.unit ? 'border-[var(--critical)]' : 'border-line']}>
							{#each unitOptions(a, row.unit) as u (u)}<option value={u}>{u}</option>{/each}
						</select>
					{:else}
						<input bind:value={row.unit} placeholder={t.manual.customUnit} aria-label={t.manual.unit} class={[cell, show && err === t.manual.errors.unit ? 'border-[var(--critical)]' : 'border-line']} />
					{/if}
					<div class="grid gap-1" title={t.manual.rangeHelp}>
						<div class="flex items-center gap-1">
							<input bind:value={row.low} placeholder={t.manual.low} inputmode="decimal" aria-label={t.manual.low} class={['num', cell, show && err === t.manual.errors.range ? 'border-[var(--critical)]' : 'border-line']} />
							<span class="text-ink-3">–</span>
							<input bind:value={row.high} placeholder={t.manual.high} inputmode="decimal" aria-label={t.manual.high} class={['num', cell, show && err === t.manual.errors.range ? 'border-[var(--critical)]' : 'border-line']} />
						</div>
						{#if row.rangeNote}<input bind:value={row.rangeNote} aria-label={t.manual.note} class="h-6 w-full rounded border-line bg-surface px-1.5 text-[11px] text-ink-2" />{/if}
					</div>
					<input bind:value={row.flag} maxlength="4" aria-label={t.manual.flag} class={['border-line', cell]} />
					<input bind:value={row.note} aria-label={t.manual.note} class={['border-line', cell]} />
					<button type="button" onclick={() => (rows = rows.filter((r) => r !== row))} aria-label={t.common.remove} class="h-8 rounded-md text-ink-3 hover:bg-hover hover:text-ink">×</button>
					{#if show && err}<p transition:slide={{ duration: 160 }} class="text-xs text-[var(--critical)] md:col-span-7">{err}</p>{/if}
				</li>
			{/each}
		</ul>

		<div class="border-t border-line px-4 py-2.5">
			<button type="button" onclick={() => (rows = [...rows, blank()])} class="rounded-md border border-line px-3 py-1 text-xs font-medium hover:bg-hover">+ {t.manual.addRow}</button>
		</div>
	</section>

	<div class="flex items-center gap-3">
		<button type="submit" disabled={saving} class="rounded-md bg-ink px-4 py-2 text-sm font-medium text-surface hover:opacity-90 disabled:opacity-50">{t.manual.saveDraw}</button>
		{#if tried && !filled.length}<span class="text-xs text-[var(--critical)]">{t.manual.errors.empty}</span>{/if}
	</div>
</form>
