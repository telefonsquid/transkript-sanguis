<script lang="ts">
	import type { Draw, Result } from '../data/types';
	import { t } from '../i18n';
	import { drawProblem, newDraw, normName, rowProblem, toResult, type PreviewDraw, type PreviewRow, type RowProblem } from '../io';
	import { addCustom, current, newId, saveDraw } from '../profiles.svelte';
	import AnalytePicker from './AnalytePicker.svelte';

	interface Props {
		draws: PreviewDraw[];
		notes?: string[];
		ondone: (count: number) => void;
	}

	let { draws = $bindable(), notes = [], ondone }: Props = $props();

	const problemText = (p: RowProblem) =>
		({ value: t.manual.errors.value, unit: t.manual.errors.unit, analyte: t.manual.errors.analyte, duplicate: t.manual.errors.duplicate })[p];

	/** The printed name only adds something when it differs from the catalogue name */
	function showPrinted(row: PreviewRow): boolean {
		if (!row.printed || row.action === 'custom') return false;
		const a = row.analyte ? current.lookup(row.analyte) : undefined;
		return !a || ![a.name.en, a.name.de].some((n) => normName(n) === normName(row.printed));
	}

	const active = $derived(draws.filter((d) => d.mode !== 'skip'));
	const problems = $derived(
		active.reduce((n, d) => n + (drawProblem(d) ? 1 : 0) + d.rows.filter((r) => rowProblem(r, d.rows, current.lookup)).length, 0)
	);

	function doImport() {
		const profile = current.profile;
		if (!profile || problems) return;

		for (const d of active) {
			const results: Result[] = d.rows
				.filter((r) => r.action !== 'drop')
				.map((r) => toResult(r, r.action === 'custom' ? addCustom(profile, r.printed || r.analyte || '?', r.unit).id : r.analyte!));

			const target = d.mode === 'merge' ? profile.draws.find((x) => x.id === d.existing) : undefined;
			if (target) {
				// Newly read values win over the stored ones of the same analyte
				const incoming = new Set(results.map((r) => r.analyte));
				const merged: Draw = {
					...target,
					lab: target.lab ?? (d.lab || undefined),
					rangesFor: target.rangesFor ?? d.rangesFor,
					notes: [...new Set([...(target.notes ?? []), ...d.notes])],
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
		<section class={['rounded-lg border bg-surface', d.mode === 'skip' ? 'border-dashed border-line opacity-60' : 'border-line']}>
			<header class="flex flex-wrap items-center gap-3 border-b border-line px-4 py-2.5 text-sm">
				<input type="date" bind:value={d.date} class={['h-8 rounded-md bg-surface px-2 text-sm', !d.date && 'empty', dp ? 'border-[var(--critical)]' : 'border-line']} aria-label={t.manual.date} />
				<input bind:value={d.lab} placeholder={t.manual.lab} class="h-8 w-48 rounded-md border-line bg-surface px-2 text-sm" aria-label={t.manual.lab} />
				<select bind:value={d.rangesFor} class={['h-8 rounded-md border-line bg-surface py-0 pr-7 pl-2 text-xs', !d.rangesFor && 'empty']} aria-label={t.manual.rangesFor}>
					<option value={undefined}>{t.manual.rangesFor}: {t.profile.sexes.unset}</option>
					<option value="female">{t.manual.rangesFor}: {t.profile.sexes.female}</option>
					<option value="male">{t.manual.rangesFor}: {t.profile.sexes.male}</option>
				</select>
				<span class="text-xs text-ink-3">{t.data.values(d.rows.filter((r) => r.action !== 'drop').length)}</span>
				<span class="ml-auto flex items-center gap-2 text-xs">
					{#if d.existing}<span class="text-[var(--serious)]">{t.agent.duplicateDraw}</span>{/if}
					<select bind:value={d.mode} class="h-7 rounded-md border-line bg-surface py-0 pr-7 pl-2 text-xs">
						{#if d.existing}<option value="merge">{t.agent.merge}</option>{/if}
						<option value="new">{d.existing ? t.agent.addSeparate : t.common.add}</option>
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
							<th class="px-2 py-1.5 font-medium">{t.manual.range}</th>
							<th class="px-4 py-1.5 font-medium"></th>
						</tr>
					</thead>
					<tbody>
						{#each d.rows as row (row.key)}
							{const p = $derived(rowProblem(row, d.rows, current.lookup))}
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
											}}
										/>
									{/if}
									{#if showPrinted(row)}<div class="mt-0.5 text-[11px] text-ink-3">{t.agent.printedAs} {row.printed}</div>{/if}
								</td>
								<td class="px-2 py-1.5"><input bind:value={row.value} class={['num h-8 w-24 rounded-md bg-surface px-2 text-sm', p === 'value' ? 'border-[var(--critical)]' : 'border-line']} aria-label={t.manual.printedValue} /></td>
								<td class="px-2 py-1.5"><input bind:value={row.unit} class={['h-8 w-24 rounded-md bg-surface px-2 text-sm', p === 'unit' ? 'border-[var(--critical)]' : 'border-line']} aria-label={t.manual.unit} /></td>
								<td class="px-2 py-1.5"><input bind:value={row.ref} class="num h-8 w-28 rounded-md border-line bg-surface px-2 text-sm" aria-label={t.manual.range} /></td>
								<td class="px-4 py-1.5 text-right">
									<select bind:value={row.action} class="h-8 rounded-md border-line bg-surface py-0 pr-7 pl-2 text-xs">
										<option value="import" disabled={!row.analyte}>{t.agent.importRow}</option>
										<option value="custom">{t.agent.keepCustom}</option>
										<option value="drop">{t.agent.drop}</option>
									</select>
								</td>
							</tr>
							{#if p}
								<tr><td colspan="5" class="px-4 pb-1.5 text-[11px] text-[var(--critical)]">{problemText(p)}</td></tr>
							{/if}
						{/each}
					</tbody>
				</table>
			{/if}
		</section>
	{/each}

	<div class="flex flex-wrap items-center gap-3">
		<button type="button" onclick={doImport} disabled={!!problems || !active.length || !current.profile} class="rounded-md bg-ink px-4 py-2 text-sm font-medium text-surface hover:opacity-90 disabled:opacity-40">
			{t.agent.importDraws(active.length)}
		</button>
		{#if current.profile}<span class="text-xs text-ink-3">{t.agent.importInto} <strong class="text-ink-2">{current.profile.name}</strong></span>{/if}
		{#if problems}<span class="text-xs text-[var(--critical)]">{t.agent.issues(problems)}</span>{/if}
	</div>
</div>
