<script lang="ts">
	import { scaleUtc } from 'd3-scale';
	import { fmtDate, fmtHrt, fmtMonth } from '../analysis';
	import { toTime } from '../data';
	import { t } from '../i18n';
	import { current } from '../profiles.svelte';
	import { hover, settings } from '../state.svelte';

	let width = $state(0);
	const height = 64;
	const m = { left: 12, right: 12, top: 20, bottom: 16 };

	const DAY = 86_400_000;

	const draws = $derived(current.profile?.draws ?? []);
	const phases = $derived(current.built.phases);
	const labs = $derived(current.built.labs);

	const t0 = $derived(draws.length ? toTime(draws[0].date) - 45 * DAY : Date.now() - 365 * DAY);
	const t1 = $derived(Math.max(Date.now(), draws.length ? toTime(draws.at(-1)!.date) : 0) + 30 * DAY);

	const x = $derived(scaleUtc().domain([t0, t1]).range([m.left, Math.max(m.left + 1, width - m.right)]));
	const ticks = $derived(x.ticks(Math.max(2, Math.floor(width / 90))));

	const counts = $derived(Map.groupBy(current.built.measurements, (mm) => mm.drawId));
	const drawList = $derived(draws.map((d) => ({ ...d, lab: d.lab?.trim() ?? '', t: toTime(d.date, d.time), n: counts.get(d.id)?.length ?? 0 })));

	const baseline = $derived(current.therapy === 'none' ? t.data.baseline.none : t.data.baseline.hrt);

	const segments = $derived(
		phases.map((p, i) => {
			const start = p.start ? toTime(p.start) : t0;
			const end = phases[i + 1]?.start ? toTime(phases[i + 1].start) : t1;
			return { p, i, x0: x(start), x1: x(end) };
		})
	);

	const selFrom = $derived(settings.from ? x(toTime(settings.from, '00:00')) : null);
	const selTo = $derived(settings.to ? x(toTime(settings.to, '23:59')) : null);
	const hasSel = $derived(selFrom !== null || selTo !== null);

	let drag: { mode: 'new' | 'left' | 'right' | 'move'; px: number; from: number; to: number } | null = null;

	// The brush glides to presets but follows the pointer directly while dragged
	let dragging = $state(false);

	const iso = (time: number) => new Date(Math.min(t1, Math.max(t0, time))).toISOString().slice(0, 10);

	function local(e: PointerEvent): number {
		const svg = (e.currentTarget as Element).closest('svg')!;
		return e.clientX - svg.getBoundingClientRect().left;
	}

	function down(e: PointerEvent, mode: 'new' | 'left' | 'right' | 'move') {
		const px = local(e);
		const from = selFrom ?? m.left;
		const to = selTo ?? width - m.right;
		drag = { mode, px, from, to };
		dragging = true;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		e.stopPropagation();
	}

	function move(e: PointerEvent) {
		if (!drag) return;
		const px = local(e);
		const dx = px - drag.px;
		let a = drag.from;
		let b = drag.to;
		if (drag.mode === 'new') [a, b] = [Math.min(drag.px, px), Math.max(drag.px, px)];
		if (drag.mode === 'left') a = Math.min(drag.from + dx, b - 4);
		if (drag.mode === 'right') b = Math.max(drag.to + dx, a + 4);
		if (drag.mode === 'move') [a, b] = [drag.from + dx, drag.to + dx];
		if (drag.mode === 'new' && b - a < 3) return;
		settings.from = iso(x.invert(a).getTime());
		settings.to = iso(x.invert(b).getTime());
		settings.datePreset = 'custom';
	}

	function up() {
		drag = null;
		dragging = false;
	}

	function clear() {
		settings.from = null;
		settings.to = null;
		settings.datePreset = 'all';
	}

	const GLYPHS = ['●', '◆', '■', '▲'];

	/** Marker shape per lab, so draws from different labs tell apart without colour */
	function shape(lab: string, cx: number, cy: number, r: number): string {
		const i = Math.max(0, labs.indexOf(lab)) % GLYPHS.length;
		if (i === 1) return `M${cx},${cy - r * 1.3}L${cx + r * 1.3},${cy}L${cx},${cy + r * 1.3}L${cx - r * 1.3},${cy}Z`;
		if (i === 2) return `M${cx - r},${cy - r}h${2 * r}v${2 * r}h${-2 * r}Z`;
		if (i === 3) return `M${cx},${cy - r * 1.25}L${cx + r * 1.2},${cy + r}L${cx - r * 1.2},${cy + r}Z`;
		return `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0`;
	}
</script>

<div class="relative" bind:clientWidth={width}>
	{#if width > 0 && draws.length}
		<svg {width} {height} class="block touch-none select-none" role="group" aria-label="{t.timeline.label}. {t.timeline.hint}">
			<!-- Background accepts a fresh brush -->
			<rect
				x={m.left}
				y={0}
				width={width - m.left - m.right}
				{height}
				fill="transparent"
				class="cursor-crosshair"
				role="presentation"
				onpointerdown={(e) => down(e, 'new')}
				onpointermove={move}
				onpointerup={up}
				ondblclick={clear}
			/>

			{#each segments as s (s.p.id)}
				<rect
					x={s.x0}
					y={m.top + 12}
					width={Math.max(0, s.x1 - s.x0 - 1)}
					height={6}
					rx="1"
					fill={s.p.implicit ? 'var(--surface-3)' : s.i % 2 ? 'var(--ink-3)' : 'var(--ink-2)'}
					opacity={s.p.implicit ? 1 : 0.55}
					class="pointer-events-none"
				/>
				{#if s.x1 - s.x0 > 50}
					{const name = $derived(s.p.implicit ? baseline : s.p.label)}
					{const room = $derived(Math.floor((s.x1 - s.x0 - 8) / 5.8))}
					<text x={s.x0 + 2} y={m.top + 8} class="pointer-events-none fill-ink-3 text-[10px] font-medium">
						{name.length > room ? name.slice(0, room - 1) + '…' : name}{s.p.approx ? ' ≈' : ''}
					</text>
				{/if}
			{/each}

			{#each ticks as tick (tick.getTime())}
				<line x1={x(tick)} x2={x(tick)} y1={height - m.bottom} y2={height - m.bottom + 3} stroke="var(--axis)" class="pointer-events-none" />
				<text x={x(tick)} y={height - 3} text-anchor="middle" class="num pointer-events-none fill-ink-3 text-[10px]">
					{tick.getUTCMonth() === 0 ? tick.getUTCFullYear() : fmtMonth(tick.getTime())}
				</text>
			{/each}
			<line x1={m.left} x2={width - m.right} y1={height - m.bottom} y2={height - m.bottom} stroke="var(--axis)" class="pointer-events-none" />

			{#if hasSel}
				{@render brush(selFrom ?? m.left, selTo ?? width - m.right)}
			{/if}

			{#each drawList as d (d.id)}
				{const cx = $derived(x(d.t))}
				{const shown = $derived(!settings.hiddenLabs.includes(d.lab))}
				<g
					role="presentation"
					onpointerenter={() => {
						hover.t = d.t;
						hover.source = 'timeline';
					}}
					onpointerleave={() => {
						hover.t = null;
						hover.source = null;
					}}
				>
					<rect x={cx - 8} y={m.top - 4} width="16" height="30" fill="transparent" />
					<path
						d={shape(d.lab, cx, m.top + 15, hover.t === d.t ? 5 : 4)}
						fill={shown ? 'var(--ink)' : 'var(--surface)'}
						stroke="var(--ink)"
						stroke-width={shown ? 2 : 1.2}
						paint-order="stroke"
						class="glide"
					/>
					<title>{fmtDate(d.t)} · {d.lab || t.common.noLab} · {t.data.values(d.n)}{current.built.hrtStart ? ` · ${fmtHrt(d.t)}` : ''}</title>
				</g>
			{/each}
		</svg>
		<div class="pointer-events-none absolute top-0 right-3 flex gap-3 text-[10px] text-ink-3">
			{#if labs.length > 1}
				{#each labs.slice(0, 4) as lab, i (lab)}<span>{GLYPHS[i]} {lab || t.common.noLab}</span>{/each}
			{/if}
			<span class="hidden text-ink-3/80 sm:inline">{t.timeline.hint}</span>
		</div>
	{/if}
</div>

{#snippet brush(a: number, b: number)}
	<rect x={a} y={2} width={Math.max(2, b - a)} height={height - m.bottom - 2} fill="var(--ref-target)" opacity="0.12" class={['cursor-grab', !dragging && 'glide']} role="presentation" onpointerdown={(e) => down(e, 'move')} onpointermove={move} onpointerup={up} ondblclick={clear} />
	<rect x={a - 3} y={2} width="6" height={height - m.bottom - 2} fill="transparent" class="cursor-ew-resize" role="presentation" onpointerdown={(e) => down(e, 'left')} onpointermove={move} onpointerup={up} />
	<rect x={b - 3} y={2} width="6" height={height - m.bottom - 2} fill="transparent" class="cursor-ew-resize" role="presentation" onpointerdown={(e) => down(e, 'right')} onpointermove={move} onpointerup={up} />
	<rect x={a - 1} y={2} width="2" height={height - m.bottom - 2} fill="var(--ref-target)" class={['pointer-events-none', !dragging && 'glide']} />
	<rect x={b - 1} y={2} width="2" height={height - m.bottom - 2} fill="var(--ref-target)" class={['pointer-events-none', !dragging && 'glide']} />
{/snippet}
