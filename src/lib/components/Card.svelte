<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { boundsFor, convert, decimalsOf, fmtBounds, fmtNum, statusOf, unitOf } from '../analysis';
	import Chart from '../chart/Chart.svelte';
	import type { Analyte } from '../data/types';
	import { altNameOf, nameOf, t } from '../i18n';
	import { fly } from '../motion.svelte';
	import { bandsFor, positionsFor, seriesFor, useLog } from '../series';
	import { filtered, settings } from '../state.svelte';

	interface Props {
		analyte: Analyte;
		height: number;
	}

	let { analyte: a, height }: Props = $props();

	const series = $derived(seriesFor(a.id));
	const ms = $derived(filtered.byAnalyte.get(a.id) ?? []);
	const last = $derived(ms.at(-1));
	const prev = $derived(ms.at(-2));
	const lastPoint = $derived(series.points.at(-1));
	const bounds = $derived(last ? boundsFor(a, last, settings.basis) : undefined);
	const status = $derived(last ? statusOf(last, bounds) : 'none');

	const delta = $derived.by(() => {
		if (!last || !prev || last.censor || prev.censor) return undefined;
		const d = convert(a, last.value, settings.units) - convert(a, prev.value, settings.units);
		return d;
	});

	const unit = $derived(unitOf(a, settings.units));
	const alt = $derived(altNameOf(a));

	// Small charts only draw the band values are judged against, the lab range when there is none
	const cardBands = $derived(bandsFor(a).filter((b) => b.filled));
	const href = $derived(resolve('/analyte/[id]', { id: a.id }));
</script>

<article
	data-hero={a.id}
	class="flex h-full flex-col rounded-lg border border-line bg-surface transition-[box-shadow,border-color] duration-200 hover:border-line-strong hover:shadow-[var(--shadow)]"
>
	<header class="flex items-start justify-between gap-2 px-3 pt-2.5">
		<div class="min-w-0">
			<a {href} class="block truncate text-[13px] leading-tight font-semibold text-ink hover:underline">
				{nameOf(a)}{#if settings.pinned.includes(a.id)}<span class="ml-1 text-ink-3">★</span>{/if}
			</a>
			<div class="truncate text-[11px] text-ink-3">{alt ? `${alt} · ` : ''}{unit}{a.derived ? ` · ${t.grid.derivedBadge}` : ''}</div>
		</div>
		{#if lastPoint}
			<div class="shrink-0 text-right">
				<div class="flex items-baseline justify-end gap-1">
					{#if status === 'high' || status === 'low'}
						<span class="text-[10px]" style:color="var(--{status})">{status === 'high' ? '▲' : '▼'}</span>
					{/if}
					{#key lastPoint.text}
						<span class="text-[17px] leading-none font-semibold tracking-tight text-ink" in:fly={{ y: 8, duration: 280 }}>{lastPoint.text}</span>
					{/key}
				</div>
				{#if delta !== undefined}
					<div class="num text-[10.5px] text-ink-3" title={t.focus.change}>
						{delta > 0 ? '+' : delta < 0 ? '−' : '±'}{fmtNum(Math.abs(delta), decimalsOf(a, settings.units))}
					</div>
				{/if}
			</div>
		{/if}
	</header>

	<div class="px-1">
		<Chart
			series={[series]}
			bands={cardBands}
			labBand={settings.kinds.includes('lab') && !cardBands.some((b) => b.filled)}
			{height}
			compact
			log={useLog(a)}
			fitBands={settings.yFit === 'refs'}
			xMode={settings.xMode}
			positions={positionsFor([series])}
			domain={filtered.domain}
			xLabel={settings.xLabel}
			showPhases={settings.showPhases}
			showEvents={settings.showEvents}
			labels={settings.labels}
			curve={settings.curve}
			onpick={() => goto(href)}
			ariaLabel="{t.chart.ariaChart(nameOf(a))}, {t.grid.values(ms.length)}, {unit}"
		/>
	</div>

	<footer class="flex items-center justify-between gap-2 border-t border-line px-3 py-1.5 text-[10.5px] text-ink-3">
		<span class="num shrink-0">n = {ms.length}</span>
		{#if bounds}
			<span class="truncate" title={bounds.label}>
				<span class="mr-1 inline-block h-2 w-0.5 rounded-full align-middle" style:background="var(--ref-{bounds.kind})"></span>{bounds.label}
				<span class="num text-ink-2">{fmtBounds(a, bounds, settings.units)}</span>
			</span>
		{/if}
	</footer>
</article>
