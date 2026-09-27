<script lang="ts">
	import { untrack } from 'svelte';
	import { fmtDate } from '../analysis';
	import { toTime, unitChoices } from '../data';
	import type { Analyte, Draw } from '../data/types';
	import { t } from '../i18n';
	import { slide } from '../motion.svelte';
	import { current } from '../profiles.svelte';
	import { fromResult, rowProblem, toResult, type EditRow } from '../rows';

	interface Props {
		a: Analyte;
		ondone: () => void;
	}

	let { a, ondone }: Props = $props();

	const profile = $derived(current.profile);

	// One row per draw, newest first, read once so saving elsewhere does not reset the form
	let rows: (EditRow & { draw: Draw; computed?: string })[] = $state(
		untrack(() =>
			[...(current.profile?.draws ?? [])].reverse().map((draw) => {
				const r = draw.results.find((x) => x.analyte === a.id);
				const row = r ? fromResult(r, a, draw.id) : { key: draw.id, analyte: a.id, value: '', unit: a.unit, low: '', high: '', rangeNote: '', flag: '', note: '' };
				const computed = current.built.measurements.find((m) => m.drawId === draw.id && m.analyte === a.id && m.derived)?.raw;
				return { ...row, draw, computed };
			})
		)
	);
	let tried = $state(false);

	// An empty value leaves the draw without this result
	const errors = $derived(new Map(rows.filter((r) => r.value.trim()).map((r) => [r.key, rowProblem(r, a, [])])));
	const valid = $derived([...errors.values()].every((e) => !e));

	function units(unit: string): string[] {
		const list = unitChoices(a);
		return unit && !list.includes(unit) ? [unit, ...list] : list;
	}

	function save(e: SubmitEvent) {
		e.preventDefault();
		tried = true;
		if (!valid || !profile) return;

		for (const row of rows) {
			const draw = profile.draws.find((d) => d.id === row.draw.id);
			if (!draw) continue;
			const i = draw.results.findIndex((r) => r.analyte === a.id);
			const old = draw.results[i];
			if (!row.value.trim()) {
				if (old) draw.results.splice(i, 1);
				continue;
			}

			const next = toResult(row, a.id, a.unit);
			if (old) draw.results[i] = next;
			else draw.results.push(next);
		}
		ondone();
	}

	const cell = 'h-7 w-full rounded-md bg-surface px-2 text-xs';
	const bad = (row: EditRow, p: string) => (tried && errors.get(row.key) === p ? 'border-[var(--critical)]' : 'border-line');
</script>

<form onsubmit={save} novalidate in:slide>
	<p class="border-b border-line px-3 py-1.5 text-xs text-ink-3">{t.focus.editHint}</p>
	<table class="num w-full text-xs">
		<thead class="text-left text-ink-3">
			<tr class="border-b border-line">
				<th class="px-3 py-1.5 font-medium">{t.focus.cols.date}</th>
				<th class="px-2 py-1.5 font-medium">{t.focus.cols.value}</th>
				<th class="px-2 py-1.5 font-medium">{t.manual.unit}</th>
				<th class="px-2 py-1.5 font-medium">{t.focus.cols.printed}</th>
				<th class="px-2 py-1.5 font-medium">{t.manual.flag}</th>
				<th class="px-3 py-1.5 font-medium">{t.focus.cols.notes}</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.key)}
				{const err = $derived(tried ? errors.get(row.key) : undefined)}
				<tr class="border-b border-line align-top last:border-0">
					<td class="px-3 py-1.5 whitespace-nowrap text-ink">
						<div class="flex h-7 items-center">{fmtDate(toTime(row.draw.date, row.draw.time))}</div>
						<div class="text-[10.5px] text-ink-3">{row.draw.lab || t.common.noLab}</div>
					</td>
					<td class="w-28 px-2 py-1.5">
						<input bind:value={row.value} placeholder={row.computed ? `◇ ${row.computed}` : '—'} inputmode="decimal" aria-label={t.focus.cols.value} class={[cell, bad(row, 'value')]} />
					</td>
					<td class="w-32 px-2 py-1.5">
						<select bind:value={row.unit} aria-label={t.manual.unit} class={[cell, 'pr-6', bad(row, 'unit')]}>
							{#each units(row.unit) as u (u)}<option value={u}>{u}</option>{/each}
						</select>
					</td>
					<td class="w-44 px-2 py-1.5" title={t.manual.rangeHelp}>
						<div class="flex items-center gap-1">
							<input bind:value={row.low} placeholder={t.manual.low} inputmode="decimal" aria-label={t.manual.low} class={[cell, bad(row, 'range')]} />
							<span class="text-ink-3">–</span>
							<input bind:value={row.high} placeholder={t.manual.high} inputmode="decimal" aria-label={t.manual.high} class={[cell, bad(row, 'range')]} />
						</div>
						{#if row.rangeNote}<input bind:value={row.rangeNote} aria-label={t.manual.note} class="mt-1 h-6 w-full rounded border-line bg-surface px-1.5 text-[11px] text-ink-2" />{/if}
					</td>
					<td class="w-16 px-2 py-1.5"><input bind:value={row.flag} maxlength="4" aria-label={t.manual.flag} class={[cell, 'border-line']} /></td>
					<td class="px-3 py-1.5 font-sans">
						<input bind:value={row.note} aria-label={t.manual.note} class={[cell, 'border-line']} />
						{#if err}<p transition:slide={{ duration: 160 }} class="mt-1 text-[var(--critical)]">{t.manual.errors[err]}</p>{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="flex items-center gap-2 border-t border-line px-3 py-2">
		<button type="submit" class="rounded-md bg-ink px-3 py-1 text-xs font-medium text-surface hover:opacity-90">{t.common.save}</button>
		<button type="button" onclick={ondone} class="rounded-md border border-line px-3 py-1 text-xs font-medium text-ink-2 hover:bg-hover hover:text-ink">{t.common.cancel}</button>
	</div>
</form>
