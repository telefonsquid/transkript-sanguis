<script lang="ts">
	import { unitChoices } from '../data';
	import type { Draw, Result } from '../data/types';
	import { t } from '../i18n';
	import { customName, drawProblem, newDraw, normName, previewProblem, resolveUnit, type PreviewDraw, type PreviewRow } from '../io';
	import { addCustom, current, newId, saveDraw } from '../profiles.svelte';
	import { toResult, type RowProblem } from '../rows';
	import AnalytePicker from './AnalytePicker.svelte';

	interface Props {
		draws: PreviewDraw[];
		notes?: string[];
		ondone: (count: number) => void;
	}

	let { draws = $bindable(), notes = [], ondone }: Props = $props();

	const problemText = (p: RowProblem) => t.manual.errors[p];

	/** Units the app converts for the row's value, plus a converted spelling outside the usual list */
	function choicesFor(row: PreviewRow): string[] {
		const a = row.analyte ? current.lookup(row.analyte) : undefined;
		const list = a ? unitChoices(a) : [];
		return row.unit && !list.includes(row.unit) ? [row.unit, ...list] : list;
	}

	/** The printed name only adds something when it differs from the catalogue name */
	function showPrinted(row: PreviewRow): boolean {
		if (!row.printed || row.action === 'custom') return false;
		const a = row.analyte ? current.lookup(row.analyte) : undefined;
		return !a || ![a.name.en, a.name.de].some((n) => normName(n) === normName(row.printed));
	}

	/** Another draw on the same date, stored or earlier in the file */
	function clash(d: PreviewDraw): boolean {
		if (!d.date) return false;
		if (current.profile?.draws.some((x) => x.date === d.date)) return true;
		return draws.slice(0, draws.indexOf(d)).some((x) => x.mode !== 'skip' && x.date === d.date);
	}

	// A merge without a draw to join falls back to a new one
	$effect(() => {
		for (const d of draws) if (d.mode === 'merge' && !clash(d)) d.mode = 'new';
	});

	const active = $derived(draws.filter((d) => d.mode !== 'skip'));
	const guessed = $derived(active.flatMap((d) => d.rows.filter((r) => r.suggested && r.action === 'import')));
	const problems = $derived(
		active.reduce((n, d) => n + (drawProblem(d) ? 1 : 0) + d.rows.filter((r) => previewProblem(r, d.rows, current.lookup)).length, 0)
	);

	function doImport() {
		const profile = current.profile;
		if (!profile || problems) return;

		for (const d of active) {
			const results: Result[] = d.rows
				.filter((r) => r.action !== 'drop')
				.map((r) =>
					r.action === 'custom'
						? toResult(r, addCustom(profile, customName(r), r.unit).id, r.unit)
						: toResult(r, r.analyte!, current.lookup(r.analyte!)?.unit)
				);

			const target = d.mode === 'merge' ? profile.draws.find((x) => x.date === d.date) : undefined;
			if (target) {
				// Newly read values win over the stored ones of the same analyte
				const incoming = new Set(results.map((r) => r.analyte));
				const notes = [...new Set([...(target.notes ?? []), ...d.notes])];
				const merged: Draw = {
					...target,
					time: target.time ?? (d.time || undefined),
					lab: target.lab ?? (d.lab || undefined),
					rangesFor: target.rangesFor ?? d.rangesFor,
					fasting: target.fasting ?? d.fasting,
					notes: notes.length ? notes : undefined,
					results: [...target.results.filter((r) => !incoming.has(r.analyte)), ...results]
				};
				saveDraw(profile, merged);
			} else {
				saveDraw(profile, { ...newDraw(newId('draw'), d), results });
			}
		}
		ondone(active.length);
	}
</script>

<div class="space-y-4">
	{#if notes.length}
		<div class="rounded-lg border border-line bg-surface-2 p-3 text-xs">
			<div class="label mb-1">{t.agent.agentNotes}</div>
			<ul class="list-disc pl-4 text-ink-2">{#each notes as n, i (i)}<li>{n}</li>{/each}</ul>
		</div>
	{/if}

	{#each draws as d (d.key)}
		{const dp = $derived(drawProblem(d))}
		{const clashes = $derived(clash(d))}
		<section class={['rounded-lg border bg-surface', d.mode === 'skip' ? 'border-dashed border-line opacity-60' : 'border-line']}>
			<header class="flex flex-wrap items-center gap-3 border-b border-line px-4 py-2.5 text-sm">
				<input
					type="date"
					bind:value={d.date}
					onchange={() => d.mode !== 'skip' && (d.mode = clash(d) ? 'merge' : 'new')}
					class={['h-8 rounded-md bg-surface px-2 text-sm', !d.date && 'empty', dp ? 'border-[var(--critical)]' : 'border-line']}
					aria-label={t.manual.date}
				/>
				<input bind:value={d.lab} placeholder={t.manual.lab} class="h-8 w-48 rounded-md border-line bg-surface px-2 text-sm" aria-label={t.manual.lab} />
				<select bind:value={d.rangesFor} class={['h-8 rounded-md border-line bg-surface py-0 pr-7 pl-2 text-xs', !d.rangesFor && 'empty']} aria-label={t.manual.rangesFor}>
					<option value={undefined}>{t.manual.rangesFor}: {t.profile.sexes.unset}</option>
					<option value="female">{t.manual.rangesFor}: {t.profile.sexes.female}</option>
					<option value="male">{t.manual.rangesFor}: {t.profile.sexes.male}</option>
				</select>
				<span class="text-xs text-ink-3">{t.data.values(d.rows.filter((r) => r.action !== 'drop').length)}</span>
				<span class="ml-auto flex items-center gap-2 text-xs">
					{#if clashes}<span class="text-[var(--serious)]">{t.agent.duplicateDraw}</span>{/if}
					<select bind:value={d.mode} class="h-7 rounded-md border-line bg-surface py-0 pr-7 pl-2 text-xs">
						{#if clashes || d.mode === 'merge'}<option value="merge">{t.agent.merge}</option>{/if}
						<option value="new">{clashes ? t.agent.addSeparate : t.common.add}</option>
						<option value="skip">{t.agent.skip}</option>
					</select>
				</span>
			</header>
			{#if dp && d.mode !== 'skip'}<p class="px-4 pt-2 text-xs text-[var(--critical)]">{t.manual.errors.date}</p>{/if}
			{#if d.notes.length}<p class="px-4 pt-2 text-xs text-ink-2">{d.notes.join(' · ')}</p>{/if}

			{#if d.mode !== 'skip'}
				<table class="w-full text-xs">
					<thead class="text-left text-ink-3">
						<tr>
							<th class="px-4 py-1.5 font-medium">{t.table.cols.analyte}</th>
							<th class="px-2 py-1.5 font-medium">{t.manual.printedValue}</th>
							<th class="px-2 py-1.5 font-medium">{t.manual.unit}</th>
							<th class="px-2 py-1.5 font-medium">{t.manual.range} <span class="font-normal">({t.manual.low} / {t.manual.high})</span></th>
							<th class="px-4 py-1.5 font-medium"></th>
						</tr>
					</thead>
					<tbody>
						{#each d.rows as row (row.key)}
							{const p = $derived(previewProblem(row, d.rows, current.lookup))}
							<tr class={['border-t border-line align-top', row.action === 'drop' && 'opacity-45']}>
								<td class="w-[40%] px-4 py-1.5">
									{#if row.action === 'custom'}
										<div class="flex h-8 items-center gap-1.5 text-sm"><span class="rounded bg-surface-3 px-1 text-[10px] text-ink-2">{t.agent.unknown}</span> {row.printed}</div>
									{:else}
										<AnalytePicker
											value={row.analyte}
											invalid={p === 'analyte'}
											onpick={(id, custom) => {
												if (id) [row.analyte, row.action] = [id, 'import'];
												else if (custom) [row.printed, row.action] = [custom, 'custom'];
												resolveUnit(row, current.lookup);
											}}
										/>
									{/if}
									{#if showPrinted(row)}<div class="mt-0.5 text-[11px] text-ink-3">{t.agent.printedAs} {row.printed}</div>{/if}
								</td>
								<td class="px-2 py-1.5"><input bind:value={row.value} class={['num h-8 w-24 rounded-md bg-surface px-2 text-sm', p === 'value' ? 'border-[var(--critical)]' : 'border-line']} aria-label={t.manual.printedValue} /></td>
								<td class="px-2 py-1.5">
									{#if row.action === 'custom'}
										<input bind:value={row.unit} class="h-8 w-28 rounded-md border-line bg-surface px-2 text-sm" aria-label={t.manual.unit} />
									{:else}
										<div class="flex items-center gap-1">
											<select
												bind:value={row.unit}
												onchange={() => (row.suggested = false)}
												class={['h-8 w-28 rounded-md bg-surface py-0 pr-7 pl-2 text-sm', !row.unit && 'empty', p === 'unit' ? 'border-[var(--critical)]' : p === 'confirm' ? 'border-[var(--serious)]' : 'border-line']}
												aria-label={t.manual.unit}
											>
												<option value="" disabled>{t.manual.pickUnit}</option>
												{#each choicesFor(row) as u (u)}<option value={u}>{u}</option>{/each}
											</select>
											{#if row.suggested}
												<button type="button" onclick={() => (row.suggested = false)} class="h-8 rounded-md border border-[var(--serious)] px-2 text-[11px] text-ink-2 hover:bg-surface-2">{t.agent.confirm}</button>
											{/if}
										</div>
									{/if}
									{#if row.printedUnit && row.printedUnit !== row.unit}
										<div class="mt-0.5 text-[11px] text-ink-3">{t.agent.readAs(row.printedUnit)}{#if row.suggested} · <span class="text-[var(--serious)]">{t.agent.guessed}</span>{/if}</div>
									{/if}
								</td>
								<td class="px-2 py-1.5">
									<div class="flex items-center gap-1">
										<input bind:value={row.low} placeholder={t.manual.low} class={['num h-8 w-16 rounded-md bg-surface px-2 text-sm', p === 'range' ? 'border-[var(--critical)]' : 'border-line']} aria-label={t.manual.low} />
										<span class="text-ink-3">–</span>
										<input bind:value={row.high} placeholder={t.manual.high} class={['num h-8 w-16 rounded-md bg-surface px-2 text-sm', p === 'range' ? 'border-[var(--critical)]' : 'border-line']} aria-label={t.manual.high} />
									</div>
									{#if row.rangeNote}
										<input bind:value={row.rangeNote} class="mt-1 h-6 w-full rounded border-line bg-surface px-1.5 text-[11px] text-ink-2" aria-label={t.manual.note} />
									{/if}
								</td>
								<td class="px-4 py-1.5 text-right">
									<select bind:value={row.action} onchange={() => resolveUnit(row, current.lookup)} class="h-8 rounded-md border-line bg-surface py-0 pr-7 pl-2 text-xs">
										<option value="import" disabled={!row.analyte}>{t.agent.importRow}</option>
										<option value="custom">{t.agent.keepCustom}</option>
										<option value="drop">{t.agent.drop}</option>
									</select>
								</td>
							</tr>
							{#if p}
								<tr><td colspan="5" class={['px-4 pb-1.5 text-[11px]', p === 'confirm' ? 'text-[var(--serious)]' : 'text-[var(--critical)]']}>{problemText(p)}</td></tr>
							{/if}
						{/each}
					</tbody>
				</table>
			{/if}
		</section>
	{/each}

	<div class="flex flex-wrap items-center gap-3">
		{#if guessed.length}
			<button type="button" onclick={() => guessed.forEach((r) => (r.suggested = false))} class="rounded-md border border-[var(--serious)] px-3 py-2 text-sm text-ink-2 hover:bg-surface-2">
				{t.agent.confirmAll(guessed.length)}
			</button>
		{/if}
		<button type="button" onclick={doImport} disabled={!!problems || !active.length || !current.profile} class="rounded-md bg-ink px-4 py-2 text-sm font-medium text-surface hover:opacity-90 disabled:opacity-40">
			{t.agent.importDraws(active.length)}
		</button>
		{#if current.profile}<span class="text-xs text-ink-3">{t.agent.importInto} <strong class="text-ink-2">{current.profile.name}</strong></span>{/if}
		{#if problems}<span class="text-xs text-[var(--critical)]">{t.agent.issues(problems)}</span>{/if}
	</div>
</div>
