<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { boundsLabel, fmtBounds, fmtDate, fmtInputs, fmtLabRef, fmtValue, position, unitOf } from '../analysis';
	import { groupById, toTime } from '../data';
	import type { Measurement } from '../data/types';
	import { altNameOf, nameOf, t, tx } from '../i18n';
	import { current, lookup } from '../profiles.svelte';
	import { hover } from '../chart/hover.svelte';
	import { filtered, settings } from '../state.svelte';
	import { hrtLabel, judge, phaseLabel } from '../view.svelte';

	const columns = $derived(
		(current.profile?.draws ?? []).map((d) => ({ d, t: toTime(d.date, d.time) })).filter((c) => filtered.drawTimes.includes(c.t))
	);

	const rows = $derived(
		filtered.visible.map((a, i, list) => {
			const byDraw = new Map((filtered.byAnalyte.get(a.id) ?? []).map((m) => [m.drawId, m]));
			const groupStart = settings.sort === 'group' && !settings.pinned.length && a.group !== list[i - 1]?.group;
			return { a, byDraw, groupStart };
		})
	);

	const phaseOfDraw = $derived(new Map(filtered.measurements.map((m) => [m.drawId, m.phase])));
	const start = $derived(current.hrtStart);

	/**
	 * Diverging colour: blue below, red above, neutral inside.
	 * Strength grows with the distance from the nearest limit, measured in range widths.
	 */
	function cellStyle(m: Measurement): string {
		const { bounds: b, status: s } = judge(m);
		const pos = position(m.value, b);
		if (s === 'none' || pos === undefined) return 'background: transparent';
		if (s === 'in') return 'background: color-mix(in srgb, var(--div-mid) 70%, transparent)';
		const dist = s === 'high' ? pos - 1 : -pos;
		const pct = Math.round(22 + Math.min(1, dist) * 48);
		return `background: color-mix(in srgb, var(--div-${s === 'high' ? 'high' : 'low'}) ${pct}%, var(--surface))`;
	}

	function title(m: Measurement): string {
		const a = lookup(m.analyte)!;
		const b = judge(m).bounds;
		const lines = [
			`${nameOf(a)} · ${fmtDate(m.t)}`,
			`${fmtValue(a, m, settings.units)} ${unitOf(a, settings.units)}`,
			b ? `${boundsLabel(b)}: ${fmtBounds(a, b, settings.units)}` : t.matrix.noRef,
			m.labRef ? `${t.matrix.printed}: ${fmtLabRef(m.labRef)}${m.rangesFor ? ` (${t.profile.sexes[m.rangesFor]})` : ''}` : '',
			m.derived ? `${t.matrix.computed}: ${tx(m.derived)}` : '',
			m.inputs?.length ? `${t.chart.from}: ${fmtInputs(m.inputs, settings.units)}` : '',
			m.suspect ? `${t.matrix.suspect}: ${m.suspect}` : ''
		];
		return lines.filter(Boolean).join('\n');
	}
</script>

<!-- The table scrolls inside the visible area, so its horizontal scrollbar never hides below the fold -->
<div class="flex h-full flex-col p-4">
	<div class="mb-3 flex flex-wrap items-center gap-4 text-xs text-ink-2">
		<span>{t.matrix.judged(t.basis[settings.basis])}</span>
		<span class="flex items-center gap-1">
			<span class="h-3 w-6 rounded-sm" style="background: color-mix(in srgb, var(--div-low) 70%, var(--surface))"></span>
			<span class="h-3 w-6 rounded-sm" style="background: color-mix(in srgb, var(--div-low) 22%, var(--surface))"></span>
			<span class="px-1">{t.matrix.below}</span>
			<span class="h-3 w-6 rounded-sm border border-line" style="background: color-mix(in srgb, var(--div-mid) 70%, transparent)"></span>
			<span class="px-1">{t.matrix.inside}</span>
			<span class="h-3 w-6 rounded-sm" style="background: color-mix(in srgb, var(--div-high) 22%, var(--surface))"></span>
			<span class="h-3 w-6 rounded-sm" style="background: color-mix(in srgb, var(--div-high) 70%, var(--surface))"></span>
			<span class="px-1">{t.matrix.above}</span>
		</span>
		<span class="text-ink-3">{t.matrix.marks}</span>
	</div>

	<div class="min-h-64 overflow-auto rounded-lg border border-line bg-surface">
		<table class="num border-separate border-spacing-0 text-xs">
			<thead class="sticky top-0 z-20 bg-surface">
				<tr>
					<th class="sticky left-0 z-30 border-b border-line bg-surface px-3 py-2 text-left font-medium text-ink-3">{t.matrix.analyte}</th>
					<th class="border-b border-line px-2 py-2 text-left font-medium text-ink-3">{t.matrix.unit}</th>
					{#each columns as c (c.d.id)}
						<th
							class={['border-b border-l border-line px-2 py-1.5 text-right font-medium whitespace-nowrap', hover.t === c.t ? 'bg-surface-3' : '']}
							onpointerenter={() => {
								hover.t = c.t;
								hover.source = 'matrix';
							}}
							onpointerleave={() => (hover.t = null)}
						>
							<div class="text-ink">{fmtDate(c.t)}</div>
							<div class="text-[10px] font-normal text-ink-3">
								{c.d.lab || t.common.noLab}{#if start !== undefined} · {c.t < start ? t.data.baseline.hrt : hrtLabel(c.t)}{/if}
							</div>
							<div class="max-w-32 truncate text-[10px] font-normal text-ink-3">{phaseLabel(phaseOfDraw.get(c.d.id) ?? '')}</div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each rows as { a, byDraw, groupStart }, i (a.id)}
					{#if groupStart}
						<tr>
							<!-- A cell spanning the whole row cannot stick, the label inside it can -->
							<td colspan={columns.length + 2} class="border-b border-line bg-surface-2 p-0 text-[11px] font-semibold text-ink-2">
								<div class="sticky left-0 w-fit px-3 py-1">{tx(groupById.get(a.group)?.label)}</div>
							</td>
						</tr>
					{/if}
					<tr class="group rise-row" style:--i={i}>
						<td class="sticky left-0 z-10 border-b border-line bg-surface px-3 py-1 whitespace-nowrap group-hover:bg-surface-2">
							<a href={resolve('/analyte/[id]', { id: a.id })} class="font-medium text-ink hover:underline">{nameOf(a)}</a>
							{#if altNameOf(a)}<span class="ml-1 text-[10.5px] text-ink-3">{altNameOf(a)}</span>{/if}
						</td>
						<td class="border-b border-line px-2 py-1 whitespace-nowrap text-ink-3">{unitOf(a, settings.units)}</td>
						{#each columns as c, ci (c.d.id)}
							{const m = $derived(byDraw.get(c.d.id))}
							{#if m}
								<!-- Cells wash in from the oldest draw to the newest -->
								<td
									class="appear cursor-pointer border-b border-l border-line px-2 py-1 text-right whitespace-nowrap text-ink hover:outline-2 hover:-outline-offset-2 hover:outline-[var(--ink)]"
									style:--delay="{Math.min(i, 40) * 6 + ci * 14}ms"
									style:--dur="200ms"
									style={cellStyle(m)}
									title={title(m)}
									onclick={() => goto(resolve('/analyte/[id]', { id: a.id }))}
								>
									{#if m.suspect}<span class="mr-0.5" style:color="var(--serious)">⚠</span>{/if}
									<span class={m.derived ? 'text-ink-2 italic' : 'font-medium'}>{fmtValue(a, m, settings.units)}</span>
									{#if m.derived}<span class="text-ink-3">◇</span>{/if}
								</td>
							{:else}
								<td class={['border-b border-l border-line px-2 py-1', hover.t === c.t ? 'bg-surface-2' : '']}></td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
