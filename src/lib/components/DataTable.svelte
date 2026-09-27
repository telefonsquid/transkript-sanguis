<script lang="ts">
	import { resolve } from '$app/paths';
	import { SLUG } from '../app';
	import { boundsLabel, convert, fmtBounds, fmtDate, fmtInputs, fmtLabRef, fmtNum, fmtValue, monthsOnHrt, unitOf } from '../analysis';
	import { groupById } from '../data';
	import type { Measurement } from '../data/types';
	import { altNameOf, nameOf, t, tx } from '../i18n';
	import { flip } from '../motion.svelte';
	import { current, lookup } from '../profiles.svelte';
	import { download } from '../io';
	import { filtered, settings } from '../state.svelte';
	import { judge, phaseLabel } from '../view.svelte';

	type Key = 'date' | 'analyte' | 'group' | 'value' | 'status' | 'lab' | 'phase';

	let sortKey: Key = $state('date');
	let desc = $state(true);

	const visibleIds = $derived(new Set(filtered.visible.map((a) => a.id)));

	const rows = $derived.by(() => {
		const list = filtered.measurements
			.filter((m) => visibleIds.has(m.analyte))
			.map((m) => {
				const a = lookup(m.analyte)!;
				const { bounds: b, status } = judge(m);
				return { m, a, b, status };
			});

		const rank = { low: 0, high: 1, in: 2, none: 3 };
		const cmp: Record<Key, (x: (typeof list)[0], y: (typeof list)[0]) => number> = {
			date: (x, y) => x.m.t - y.m.t || nameOf(x.a).localeCompare(nameOf(y.a)),
			analyte: (x, y) => nameOf(x.a).localeCompare(nameOf(y.a)) || x.m.t - y.m.t,
			group: (x, y) => x.a.group.localeCompare(y.a.group) || nameOf(x.a).localeCompare(nameOf(y.a)),
			value: (x, y) => x.m.value - y.m.value,
			status: (x, y) => rank[x.status] - rank[y.status],
			lab: (x, y) => x.m.lab.localeCompare(y.m.lab) || x.m.t - y.m.t,
			phase: (x, y) => x.m.phase.localeCompare(y.m.phase) || x.m.t - y.m.t
		};
		const sorted = list.sort(cmp[sortKey]);
		return desc ? sorted.reverse() : sorted;
	});

	function sortBy(key: Key) {
		if (sortKey === key) desc = !desc;
		else [sortKey, desc] = [key, key === 'date'];
	}

	function csvCell(v: unknown): string {
		const s = v === undefined || v === null ? '' : String(v);
		return /[",\n;]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
	}

	/** Machine readable row, always in English keys with dot decimals */
	function record(m: Measurement) {
		const a = lookup(m.analyte)!;
		const { bounds: b, status } = judge(m);
		const months = monthsOnHrt(m.t, current.hrtStart);
		return {
			date: m.date,
			months_on_hrt: months === undefined ? '' : +months.toFixed(2),
			analyte_id: a.id,
			analyte: a.name.en,
			analyte_de: a.name.de,
			group: a.group,
			value: +convert(a, m.value, settings.units).toPrecision(8),
			censor: m.censor ?? '',
			unit: unitOf(a, settings.units),
			as_printed: m.raw,
			printed_unit: m.printedUnit ?? '',
			status,
			judged_against: b ? `${b.ref?.label.en ?? 'lab'} ${fmtBounds(a, b, settings.units)}` : '',
			printed_range: m.labRef ? fmtLabRef(m.labRef) : '',
			ranges_for: m.rangesFor ?? '',
			lab_flag: m.labFlag ?? '',
			lab: m.lab,
			phase: phaseLabel(m.phase),
			computed: m.derived?.en ?? '',
			computed_from: m.inputs?.map((i) => `${i.of}=${i.censor ?? ''}${i.value}${i.assumed ? ' (assumed)' : ''}`).join(' ') ?? '',
			suspect: m.suspect ?? '',
			note: m.note ?? ''
		};
	}

	function exportCsv() {
		const recs = rows.map((r) => record(r.m));
		const head = Object.keys(recs[0] ?? {});
		const body = recs.map((r) => head.map((k) => csvCell(r[k as keyof typeof r])).join(','));
		download(`${SLUG}-${settings.units}.csv`, [head.join(','), ...body].join('\n'), 'text/csv');
	}

	function exportJson() {
		download(`${SLUG}-${settings.units}.json`, JSON.stringify(rows.map((r) => record(r.m)), null, 2), 'application/json');
	}

	const headers = $derived<{ key?: Key; label: string; right?: boolean }[]>([
		{ key: 'date', label: t.table.cols.date },
		{ label: t.table.cols.hrt },
		{ key: 'analyte', label: t.table.cols.analyte },
		{ key: 'group', label: t.table.cols.group },
		{ key: 'value', label: t.table.cols.value, right: true },
		{ label: t.table.cols.unit },
		{ key: 'status', label: t.table.cols.status },
		{ label: t.table.cols.judged },
		{ label: t.table.cols.printed },
		{ key: 'lab', label: t.table.cols.lab },
		{ key: 'phase', label: t.table.cols.phase },
		{ label: t.table.cols.notes }
	]);

	function hrtCell(time: number): string {
		const mo = monthsOnHrt(time, current.hrtStart);
		if (mo === undefined) return '';
		return mo < 0 ? t.data.baseline.hrt : t.months(fmtNum(mo, 1));
	}
</script>

<div class="p-4">
	<div class="mb-3 flex flex-wrap items-center gap-2 text-xs">
		<span class="num text-ink-2">{t.table.summary(rows.length, visibleIds.size, settings.units === 'si')}</span>
		<span class="ml-auto"></span>
		<button type="button" onclick={exportCsv} class="rounded-md border border-line bg-surface px-2 py-1 font-medium text-ink-2 hover:bg-hover hover:text-ink">{t.table.exportCsv}</button>
		<button type="button" onclick={exportJson} class="rounded-md border border-line bg-surface px-2 py-1 font-medium text-ink-2 hover:bg-hover hover:text-ink">{t.table.exportJson}</button>
	</div>

	<div class="overflow-auto rounded-lg border border-line bg-surface">
		<table class="num w-full text-xs">
			<thead class="sticky top-0 z-10 bg-surface text-left text-ink-3">
				<tr class="border-b border-line">
					{#each headers as h (h.label)}
						<th class={['px-2.5 py-2 font-medium whitespace-nowrap first:pl-3', h.right && 'text-right']} aria-sort={h.key && sortKey === h.key ? (desc ? 'descending' : 'ascending') : undefined}>
							{#if h.key}
								<button type="button" onclick={() => sortBy(h.key!)} class="hover:text-ink">
									{h.label}{sortKey === h.key ? (desc ? ' ↓' : ' ↑') : ''}
								</button>
							{:else}
								{h.label}
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each rows as { m, a, b, status }, i (m.analyte + m.drawId)}
					<tr class="rise-row border-b border-line align-top last:border-0 hover:bg-hover" style:--i={i} animate:flip={{ duration: rows.length > 400 ? 0 : 320 }}>
						<td class="py-1.5 pr-2.5 pl-3 whitespace-nowrap text-ink">{fmtDate(m.t)}</td>
						<td class="px-2.5 py-1.5 whitespace-nowrap text-ink-3">{hrtCell(m.t)}</td>
						<td class="px-2.5 py-1.5 whitespace-nowrap">
							<a href={resolve('/analyte/[id]', { id: a.id })} class="font-medium text-ink hover:underline">{nameOf(a)}</a>
							{#if altNameOf(a)}<span class="text-ink-3">{altNameOf(a)}</span>{/if}
						</td>
						<td class="px-2.5 py-1.5 whitespace-nowrap text-ink-2">{tx(groupById.get(a.group)?.label)}</td>
						<td class="px-2.5 py-1.5 text-right font-semibold whitespace-nowrap text-ink">{fmtValue(a, m, settings.units)}</td>
						<td class="px-2.5 py-1.5 whitespace-nowrap text-ink-3">{unitOf(a, settings.units)}</td>
						<td class="px-2.5 py-1.5 whitespace-nowrap">
							{#if status === 'high' || status === 'low'}<span style:color="var(--{status})">{status === 'high' ? '▲' : '▼'} {t.status[status]}</span>{:else if status === 'in'}<span class="text-ink-3">{t.status.in}</span>{/if}
						</td>
						<td class={['px-2.5 py-1.5 whitespace-nowrap', b ? 'text-ink-2' : 'text-ink-3']}>{b ? `${boundsLabel(b)} ${fmtBounds(a, b, settings.units)}` : '—'}</td>
						<td class={['px-2.5 py-1.5 whitespace-nowrap', m.labRef ? 'text-ink-2' : 'text-ink-3']}>
							{fmtLabRef(m.labRef)}{#if m.labRef && m.rangesFor}<span class="text-ink-3"> {m.rangesFor === 'male' ? '♂' : '♀'}</span>{/if}
						</td>
						<td class={['px-2.5 py-1.5 whitespace-nowrap', m.lab ? 'text-ink-2' : 'text-ink-3']}>{m.lab || '—'}</td>
						<td class="max-w-40 truncate px-2.5 py-1.5 whitespace-nowrap text-ink-2">{phaseLabel(m.phase)}</td>
						<td class="max-w-sm px-2.5 py-1.5 font-sans text-ink-2">
							{#if m.derived}◇ {tx(m.derived)}{/if}
							{#if m.inputs?.length}<span class="text-ink-3">{t.chart.from}: {fmtInputs(m.inputs, settings.units)}</span>{/if}
							{#if m.suspect}<span style:color="var(--serious)">⚠ {t.focus.suspect}</span>{/if}
							{#if m.censor}<span class="text-ink-3">{t.table.limit}</span>{/if}
							{#if m.note}<span class="text-ink-3">{m.note}</span>{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
