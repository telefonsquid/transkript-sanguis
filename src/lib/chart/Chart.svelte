<script lang="ts">
	import { scaleLinear, scaleLog } from 'd3-scale';
	import { curveLinear, curveMonotoneX, curveStepAfter, line } from 'd3-shape';
	import { fmtDate, fmtHrt, hrtStartTime } from '../analysis';
	import { toTime, type ResolvedPhase } from '../data';
	import { t, tx } from '../i18n';
	import { current } from '../profiles.svelte';
	import { hover, type XMode } from '../state.svelte';
	import type { ChartBand, ChartPoint, ChartSeries } from './types';
	import { makeX } from './xscale';

	interface Props {
		series: ChartSeries[];
		bands?: ChartBand[];
		labBand?: boolean;
		height: number;
		compact?: boolean;
		rails?: boolean;
		log?: boolean;
		fitBands?: boolean;
		xMode: XMode;
		positions: number[];
		domain: [number, number];
		xLabel: 'date' | 'hrt';
		showPhases?: boolean;
		showEvents?: boolean;
		labels?: 'none' | 'last' | 'extremes' | 'all';
		curve?: 'linear' | 'step' | 'monotone';
		yTitle?: string;
		/** Band shown filled on top of the configured ones, driven by hovering a legend row */
		highlight?: string | null;
		onbandhover?: (id: string | null) => void;
		onpick?: (t: number) => void;
		zeroLine?: number;
		ariaLabel: string;
	}

	let {
		series,
		bands = [],
		labBand = true,
		height,
		compact = false,
		rails = false,
		log = false,
		fitBands = true,
		xMode,
		positions,
		domain,
		xLabel,
		showPhases = true,
		showEvents = true,
		labels = 'last',
		curve = 'linear',
		yTitle,
		highlight = null,
		onbandhover,
		onpick,
		zeroLine,
		ariaLabel
	}: Props = $props();

	const uid = $props.id();
	let width = $state(0);

	const railStep = 9;
	const railBands = $derived(rails ? bands : []);
	const margin = $derived({
		top: compact ? 6 : 22,
		right: compact ? 8 : railBands.length ? 18 + railBands.length * railStep : 14,
		bottom: compact ? 18 : 26,
		left: compact ? 8 : 52
	});
	const plotW = $derived(Math.max(10, width - margin.left - margin.right));
	const plotH = $derived(Math.max(10, height - margin.top - margin.bottom));

	const allPoints = $derived(series.flatMap((s) => s.points));
	const times = $derived([...new Set(allPoints.map((p) => p.t))].sort((a, b) => a - b));

	const pad = $derived(compact ? 10 : 18);
	const xs = $derived(
		makeX(xMode, positions, domain, [margin.left + pad, margin.left + plotW - pad], xLabel, compact)
	);

	// Log needs strictly positive values, otherwise fall back to linear
	const useLog = $derived(log && allPoints.every((p) => p.v > 0) && allPoints.length > 0);

	const yDomain = $derived.by((): [number, number] => {
		const vals = allPoints.map((p) => p.v);
		if (zeroLine !== undefined) vals.push(zeroLine);
		if (fitBands) {
			for (const b of bands.filter((b) => b.filled)) {
				if (b.low !== undefined) vals.push(b.low);
				if (b.high !== undefined) vals.push(b.high);
			}
			if (labBand) {
				for (const p of allPoints) {
					if (p.lab?.low !== undefined) vals.push(p.lab.low);
					if (p.lab?.high !== undefined) vals.push(p.lab.high);
				}
			}
		}
		const usable = useLog ? vals.filter((v) => v > 0) : vals;
		if (!usable.length) return [0, 1];
		let lo = Math.min(...usable);
		let hi = Math.max(...usable);
		if (useLog) return [lo / 1.35, hi * 1.35];
		if (lo === hi) [lo, hi] = [lo - Math.abs(lo || 1) * 0.1, hi + Math.abs(hi || 1) * 0.1];
		const span = hi - lo;
		return [lo - span * 0.1, hi + span * 0.12];
	});

	const y = $derived.by(() => {
		const range = [margin.top + plotH, margin.top];
		return useLog ? scaleLog().domain(yDomain).range(range) : scaleLinear().domain(yDomain).range(range).nice(compact ? 3 : 5);
	});

	const yTicks = $derived.by(() => {
		const count = compact ? 3 : Math.max(3, Math.floor(plotH / 42));
		if (!useLog) return (y as ReturnType<typeof scaleLinear<number>>).ticks(count);
		const all = (y as ReturnType<typeof scaleLog<number>>).ticks(count * 3);
		const leading = (v: number) => +v.toExponential().charAt(0);
		let picked = all.filter((v) => leading(v) === 1);
		if (picked.length < count) picked = all.filter((v) => [1, 2, 5].includes(leading(v)));
		if (picked.length < 2) picked = all;
		return picked;
	});

	function fmtTick(v: number): string {
		if (v === 0) return '0';
		const abs = Math.abs(v);
		if (abs >= 1000) return `${+(v / 1000).toFixed(1)}k`;
		if (abs >= 10) return String(+v.toFixed(0));
		if (abs >= 1) return String(+v.toFixed(1));
		return String(+v.toPrecision(2));
	}

	const plotTop = $derived(margin.top);
	const plotBottom = $derived(margin.top + plotH);
	const plotLeft = $derived(margin.left);
	const plotRight = $derived(margin.left + plotW);

	const clampY = (v: number) => Math.max(plotTop, Math.min(plotBottom, v));

	// Zero has no place on a log axis, so a lower bound of 0 runs off the bottom
	const yOf = (v: number | undefined, fallback: number) => {
		if (v === undefined) return fallback;
		if (useLog && v <= 0) return plotBottom;
		return clampY(y(v));
	};

	const curveFn = $derived(curve === 'step' ? curveStepAfter : curve === 'monotone' ? curveMonotoneX : curveLinear);

	function pathFor(points: ChartPoint[]): string {
		const solid = points.filter((p) => !p.m.suspect);
		return (
			line<ChartPoint>()
				.x((p) => xs.x(p.t))
				.y((p) => y(p.v))
				.curve(curveFn)(solid) ?? ''
		);
	}

	/** Printed lab ranges as a stepped band, each value owns the span halfway to its neighbours */
	const labSteps = $derived.by(() => {
		if (!labBand || !series[0]) return [];
		const pts = series[0].points.filter((p) => p.lab);
		return pts.map((p, i) => {
			const x0 = i === 0 ? plotLeft : (xs.x(pts[i - 1].t) + xs.x(p.t)) / 2;
			const x1 = i === pts.length - 1 ? plotRight : (xs.x(p.t) + xs.x(pts[i + 1].t)) / 2;
			return { x0, x1, y0: yOf(p.lab!.high, plotTop), y1: yOf(p.lab!.low, plotBottom), hasLow: p.lab!.low !== undefined, hasHigh: p.lab!.high !== undefined };
		});
	});

	const phases = $derived(current.built.phases);
	const baselineLabel = $derived(current.therapy === 'none' ? t.data.baseline.none : t.data.baseline.hrt);
	const phaseName = (p: ResolvedPhase) => (p.implicit ? baselineLabel : p.label);

	const phaseRegions = $derived.by(() => {
		const starts = phases.filter((p) => p.start).map((p) => ({ p, x: xs.x(toTime(p.start)) }));
		return phases.map((p, i) => {
			const x0 = i === 0 ? plotLeft - 40 : starts[i - 1].x;
			const x1 = i < phases.length - 1 ? starts[i].x : plotRight + 40;
			return { p, i, x0: Math.max(plotLeft, x0), x1: Math.min(plotRight, x1) };
		});
	});

	const labelled = $derived.by(() => {
		if (labels === 'none') return new Set<ChartPoint>();
		const picked = series.flatMap((s) => {
			const pts = s.points;
			if (!pts.length || labels === 'all') return pts;
			if (labels === 'extremes' && pts.length > 2) {
				const sorted = [...pts].sort((a, b) => a.v - b.v);
				return [pts[pts.length - 1], sorted[0], sorted[sorted.length - 1]];
			}
			return [pts[pts.length - 1]];
		});
		return new Set(picked);
	});

	const hoverT = $derived(hover.t !== null && times.includes(hover.t) ? hover.t : null);
	const isSource = $derived(hover.source === uid);

	function onmove(e: PointerEvent) {
		const rect = (e.currentTarget as SVGElement).closest('svg')!.getBoundingClientRect();
		const t = xs.nearest(e.clientX - rect.left, times);
		if (t === undefined) return;
		hover.t = t;
		hover.source = uid;
	}

	function onleave() {
		if (hover.source === uid) {
			hover.t = null;
			hover.source = null;
		}
	}

	function onkey(e: KeyboardEvent) {
		if (!times.length) return;
		const i = hover.t === null ? -1 : times.indexOf(hover.t);
		if (e.key === 'ArrowRight') hover.t = times[Math.min(times.length - 1, i + 1)];
		else if (e.key === 'ArrowLeft') hover.t = times[Math.max(0, i === -1 ? times.length - 1 : i - 1)];
		else if (e.key === 'Enter' && hover.t !== null) onpick?.(hover.t);
		else return;
		hover.source = uid;
		e.preventDefault();
	}

	const tipPoints = $derived(hoverT === null ? [] : series.map((s) => ({ s, p: s.points.find((p) => p.t === hoverT) })).filter((r) => r.p));
	const tipLeft = $derived(hoverT === null ? 0 : xs.x(hoverT));

	function marker(p: ChartPoint, r: number): string {
		const cx = xs.x(p.t);
		const cy = y(p.v);
		if (p.m.censor === '<') return `M${cx - r},${cy - r * 0.7}L${cx + r},${cy - r * 0.7}L${cx},${cy + r}Z`;
		if (p.m.censor === '>') return `M${cx - r},${cy + r * 0.7}L${cx + r},${cy + r * 0.7}L${cx},${cy - r}Z`;
		if (p.m.derived) return `M${cx},${cy - r * 1.2}L${cx + r * 1.2},${cy}L${cx},${cy + r * 1.2}L${cx - r * 1.2},${cy}Z`;
		return '';
	}

	// Phase name cut to its region at roughly 5.8 px per character
	function phaseLabel(p: ResolvedPhase, w: number): string {
		const mark = p.approx && p.start ? ' ≈' : '';
		const name = phaseName(p);
		const room = Math.floor((w - 12) / 5.8) - mark.length;
		if (room >= name.length) return name + mark;
		return room >= 6 ? name.slice(0, room - 1).trimEnd() + '…' + mark : '';
	}

	const statusGlyph = (s: string) => (s === 'high' ? '▲' : s === 'low' ? '▼' : '');
</script>

<div class="relative select-none" bind:clientWidth={width} style:height="{height}px">
	{#if width > 0}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
		<svg
			{width}
			{height}
			role="application"
			aria-roledescription="chart"
			aria-label={ariaLabel}
			tabindex="0"
			onkeydown={onkey}
			onblur={onleave}
			class="block overflow-visible outline-none"
		>
			<defs>
				<clipPath id="clip-{uid}">
					<rect x={plotLeft} y={plotTop - 2} width={plotW} height={plotH + 4} />
				</clipPath>
			</defs>

			<!-- Medication phases -->
			{#if showPhases}
				<g clip-path="url(#clip-{uid})">
					{#each phaseRegions as r (r.p.id)}
						{#if r.x1 > r.x0}
							<rect
								x={r.x0}
								y={plotTop}
								width={r.x1 - r.x0}
								height={plotH}
								fill={r.p.implicit ? 'var(--pre)' : r.i % 2 ? 'var(--phase-a)' : 'transparent'}
							/>
						{/if}
					{/each}
				</g>
			{/if}

			{#if showPhases && !compact}
				{#each phaseRegions as r (r.p.id)}
					{const text = $derived(phaseLabel(r.p, r.x1 - r.x0))}
					{#if text}
						<text x={(r.x0 + r.x1) / 2} y={plotTop - 8} text-anchor="middle" class="fill-ink-3 text-[10px] font-medium">{text}</text>
					{/if}
				{/each}
			{/if}

			<!-- Grid -->
			{#each yTicks as v (v)}
				<line x1={plotLeft} x2={plotRight} y1={y(v)} y2={y(v)} stroke="var(--grid)" stroke-width="1" />
				{#if compact}
					<text x={plotLeft + 2} y={y(v) - 3} class="fill-ink-3 num text-[9.5px]">{fmtTick(v)}</text>
				{:else}
					<text x={plotLeft - 8} y={y(v)} dy="0.32em" text-anchor="end" class="fill-ink-3 num text-[11px]">{fmtTick(v)}</text>
				{/if}
			{/each}
			{#if zeroLine !== undefined}
				<line x1={plotLeft} x2={plotRight} y1={y(zeroLine)} y2={y(zeroLine)} stroke="var(--axis)" stroke-width="1" />
			{/if}

			<g clip-path="url(#clip-{uid})">
				<!-- Printed lab ranges, stepped because they change between reports -->
				{#if labBand}
					{#each labSteps as s, i (i)}
						<rect x={s.x0} y={s.y0} width={Math.max(0, s.x1 - s.x0)} height={Math.max(0, s.y1 - s.y0)} fill="var(--ref-lab)" opacity="0.08" />
						{#if s.hasHigh}<line x1={s.x0} x2={s.x1} y1={s.y0} y2={s.y0} stroke="var(--ref-lab)" stroke-width="1" opacity="0.55" />{/if}
						{#if s.hasLow}<line x1={s.x0} x2={s.x1} y1={s.y1} y2={s.y1} stroke="var(--ref-lab)" stroke-width="1" opacity="0.55" />{/if}
					{/each}
				{/if}

				<!-- Curated reference bands -->
				{#each bands as b (b.id)}
					{#if b.filled || highlight === b.id}
						{const y0 = $derived(yOf(b.high, plotTop))}
						{const y1 = $derived(yOf(b.low, plotBottom))}
						<rect x={plotLeft} y={y0} width={plotW} height={Math.max(0, y1 - y0)} fill="var(--ref-{b.kind})" opacity={highlight === b.id ? 0.16 : 0.09} />
						{#if b.high !== undefined}<line x1={plotLeft} x2={plotRight} y1={y0} y2={y0} stroke="var(--ref-{b.kind})" stroke-width={highlight === b.id ? 1.5 : 1} />{/if}
						{#if b.low !== undefined}<line x1={plotLeft} x2={plotRight} y1={y1} y2={y1} stroke="var(--ref-{b.kind})" stroke-width={highlight === b.id ? 1.5 : 1} />{/if}
					{/if}
				{/each}

				<!-- Regimen changes, dotted when the date is approximate -->
				{#if showEvents}
					{#each phases.filter((p) => p.start) as p, i (p.id)}
						{const ex = $derived(xs.x(toTime(p.start)))}
						<line x1={ex} x2={ex} y1={plotTop} y2={plotBottom} stroke="var(--ink-3)" stroke-width={i === 0 ? 1.5 : 1} stroke-dasharray={p.approx ? '2 3' : undefined} opacity={compact ? 0.6 : 1}>
							<title>{p.label}{p.approx ? ` (${t.common.approx})` : ''}{p.regimen ? `: ${p.regimen}` : ''}</title>
						</line>
					{/each}
				{/if}

				<!-- Crosshair -->
				{#if hoverT !== null}
					<line x1={xs.x(hoverT)} x2={xs.x(hoverT)} y1={plotTop} y2={plotBottom} stroke="var(--ink-2)" stroke-width="1" />
				{/if}

				<!-- Series -->
				{#each series as s (s.id)}
					<path d={pathFor(s.points)} fill="none" stroke={s.color} stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
				{/each}
			</g>

			<!-- Markers stay outside the clip so edge points keep their ring -->
			{#each series as s (s.id)}
				{#each s.points as p (p.m.drawId + p.m.analyte)}
					{const r = $derived((compact ? 3.5 : 4.5) + (hoverT === p.t ? 1.5 : 0))}
					{const cx = $derived(xs.x(p.t))}
					{const cy = $derived(y(p.v))}
					{#if p.status === 'high' || p.status === 'low'}
						<circle {cx} {cy} r={r + 3.2} fill="none" stroke="var(--{p.status})" stroke-width="1.5" />
					{/if}
					{#if p.m.censor || p.m.derived}
						<path d={marker(p, r)} fill="var(--surface)" stroke={s.color} stroke-width="2" stroke-linejoin="round" />
					{:else if p.m.suspect}
						<circle {cx} {cy} {r} fill="var(--surface)" stroke={s.color} stroke-width="1.5" stroke-dasharray="2 2" />
						{#if !compact}<text x={cx} y={cy} dy="0.35em" text-anchor="middle" class="text-[8px] font-bold" fill={s.color}>?</text>{/if}
					{:else}
						<circle {cx} {cy} {r} fill={s.color} stroke="var(--surface)" stroke-width="2" />
					{/if}
				{/each}
			{/each}

			<!-- Value labels -->
			{#each series as s (s.id)}
				{#each s.points.filter((p) => labelled.has(p)) as p (p.m.drawId + p.m.analyte)}
					{const above = $derived(y(p.v) - plotTop > 18)}
					<text
						x={xs.x(p.t)}
						y={y(p.v) + (above ? -10 : 17)}
						text-anchor={xs.x(p.t) > plotRight - 20 ? 'end' : xs.x(p.t) < plotLeft + 20 ? 'start' : 'middle'}
						class="num fill-ink font-semibold {compact ? 'text-[10.5px]' : 'text-[11.5px]'}"
						stroke="var(--surface)"
						stroke-width="3"
						paint-order="stroke"
						stroke-linejoin="round">{p.text}{statusGlyph(p.status) ? ` ${statusGlyph(p.status)}` : ''}</text
					>
				{/each}
			{/each}

			<!-- X axis -->
			<line x1={plotLeft} x2={plotRight} y1={plotBottom} y2={plotBottom} stroke="var(--axis)" stroke-width="1" />
			{#each xs.ticks as tick, i (i)}
				{#if tick.x >= plotLeft - 1 && tick.x <= plotRight + 1}
					<line x1={tick.x} x2={tick.x} y1={plotBottom} y2={plotBottom + 3} stroke="var(--axis)" />
					<text
						x={tick.x}
						y={plotBottom + (compact ? 13 : 16)}
						text-anchor={compact ? (i === 0 ? 'start' : i === xs.ticks.length - 1 ? 'end' : 'middle') : 'middle'}
						class="num {tick.major ? 'fill-ink-2' : 'fill-ink-3'} {compact ? 'text-[9.5px]' : 'text-[11px]'}">{tick.label}</text
					>
				{/if}
			{/each}

			{#if yTitle && !compact}
				<text x={4} y={plotTop - 8} class="fill-ink-3 text-[10.5px] font-medium">{yTitle}</text>
			{/if}

			<!-- Reference rails in the right gutter -->
			{#each railBands as b, i (b.id)}
				{const rx = $derived(plotRight + 14 + i * railStep)}
				{const ry0 = $derived(yOf(b.high, plotTop - 4))}
				{const ry1 = $derived(yOf(b.low, plotBottom + 4))}
				{const active = $derived(highlight === b.id || b.filled)}
				<g
					role="presentation"
					onpointerenter={() => onbandhover?.(b.id)}
					onpointerleave={() => onbandhover?.(null)}
					class="cursor-default"
				>
					<rect x={rx - 4} y={plotTop - 6} width={railStep} height={plotH + 12} fill="transparent" />
					<line x1={rx} x2={rx} y1={ry0} y2={ry1} stroke="var(--ref-{b.kind})" stroke-width={active ? 3.5 : 2.5} stroke-linecap="round" opacity={highlight && highlight !== b.id ? 0.35 : 1} />
					{#if b.high === undefined}<path d="M{rx - 3},{ry0 + 4}L{rx},{ry0}L{rx + 3},{ry0 + 4}" fill="none" stroke="var(--ref-{b.kind})" stroke-width="1.5" />{/if}
					{#if b.low === undefined}<path d="M{rx - 3},{ry1 - 4}L{rx},{ry1}L{rx + 3},{ry1 - 4}" fill="none" stroke="var(--ref-{b.kind})" stroke-width="1.5" />{/if}
					<title>{t.kind[b.kind]}: {b.label} ({b.range})</title>
				</g>
			{/each}

			<!-- Hit area, bigger than any mark -->
			<rect
				x={plotLeft}
				y={plotTop}
				width={plotW}
				height={plotH}
				fill="transparent"
				role="presentation"
				onpointermove={onmove}
				onpointerleave={onleave}
				onclick={() => hover.t !== null && onpick?.(hover.t)}
				class={onpick ? 'cursor-pointer' : 'cursor-crosshair'}
			/>
		</svg>

		{#if isSource && hoverT !== null && tipPoints.length}
			{const first = $derived(tipPoints[0].p!)}
			{const phase = $derived(phases.find((p) => p.id === first.m.phase))}
			{const start = $derived(hrtStartTime())}
			<div
				class="pointer-events-none absolute z-30 min-w-44 max-w-72 rounded-md border border-line bg-surface px-3 py-2 text-xs shadow-[var(--shadow)]"
				style:top="{Math.max(0, margin.top - 4)}px"
				style:left={tipLeft > width * 0.6 ? undefined : `${tipLeft + 14}px`}
				style:right={tipLeft > width * 0.6 ? `${width - tipLeft + 14}px` : undefined}
			>
				<div class="mb-1 flex items-baseline justify-between gap-3">
					<span class="font-semibold text-ink">{fmtDate(hoverT)}</span>
					{#if start !== undefined}<span class="num text-ink-3">{hoverT < start ? baselineLabel : fmtHrt(hoverT)}</span>{/if}
				</div>
				{#each tipPoints as { s, p } (s.id)}
					<div class="flex items-center gap-2 py-0.5">
						{#if series.length > 1}<span class="inline-block h-0.5 w-3 shrink-0 rounded" style:background={s.color}></span>{/if}
						<span class="num text-sm font-semibold text-ink">{p!.text}</span>
						<span class="text-ink-3">{s.unit}</span>
						{#if p!.status === 'high' || p!.status === 'low'}
							<span class="font-medium" style:color="var(--{p!.status})">{p!.status === 'high' ? '▲' : '▼'} {t.status[p!.status]}</span>
						{/if}
						{#if series.length > 1}<span class="ml-auto truncate pl-2 text-ink-2">{s.name}</span>{/if}
					</div>
				{/each}
				{#if series.length === 1}
					<div class="mt-1.5 space-y-0.5 border-t border-line pt-1.5 text-ink-2">
						{#if first.m.labRef}
							<div>
								{t.chart.lab} <span class="num text-ink">{first.m.labRef.text}</span>
								{#if first.m.rangesFor}<span class="text-ink-3">({t.profile.sexes[first.m.rangesFor]})</span>{/if}
							</div>
						{/if}
						<div>{first.m.lab || t.common.noLab}{#if phase} · {phaseName(phase)}{/if}</div>
						{#if first.m.censor}<div class="text-ink-3">{t.chart.censored}</div>{/if}
						{#if first.m.derived}<div class="text-ink-3">{t.chart.derived}: {tx(first.m.derived)}</div>{/if}
						{#if first.m.suspect}<div class="text-[var(--serious)]">⚠ {t.chart.suspect}: {first.m.suspect}</div>{/if}
						{#if first.m.note && !first.m.derived}<div class="text-ink-3">{first.m.note}</div>{/if}
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>
