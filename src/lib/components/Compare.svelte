<script lang="ts">
	import { resolve } from '$app/paths';
	import { fmtValue, position, unitOf } from '../analysis';
	import Chart from '../chart/Chart.svelte';
	import type { ChartSeries } from '../chart/types';
	import { groups } from '../data';
	import { altNameOf, nameOf, t, tx } from '../i18n';
	import { fade, flip, pop } from '../motion.svelte';
	import { current, lookup } from '../profiles.svelte';
	import { filtered, settings } from '../state.svelte';
	import { bandsFor, chartProps, judge, seriesFor, useLog } from '../view.svelte';
	import Segmented from '../ui/Segmented.svelte';

	const MAX = 8;

	const quick = $derived(
		[
			{ id: 'hormones', ids: current.therapy === 'masculinizing' ? ['testosterone', 'free-t-calc', 'shbg', 'estradiol'] : ['estradiol', 'testosterone', 'shbg', 'prolactin'] },
			{ id: 'red', ids: ['hemoglobin', 'hematocrit', 'erythrocytes'] },
			{ id: 'liver', ids: ['alt', 'ast', 'ggt', 'alp'] },
			{ id: 'lipids', ids: ['cholesterol', 'hdl', 'ldl', 'triglycerides'] },
			{ id: 'kidney', ids: ['creatinine', 'egfr-f', 'egfr-m', 'cystatin-c'] }
		]
			.map((q) => ({ ...q, label: t.compare.quickSets[q.id as keyof typeof t.compare.quickSets], ids: q.ids.filter((id) => filtered.byAnalyte.has(id)) }))
			.filter((q) => q.ids.length)
	);

	// A first visit starts with the profile's hormones instead of an empty chart
	$effect(() => {
		if (!settings.compare.length && quick.length) setQuick(quick[0].ids);
	});

	function slotOf(id: string): number {
		return settings.compareSlots[id] ?? 0;
	}

	function add(id: string) {
		if (!id || settings.compare.includes(id) || settings.compare.length >= MAX) return;
		const used = new Set(settings.compare.map(slotOf));
		const free = [...Array(MAX).keys()].find((i) => !used.has(i)) ?? 0;
		settings.compareSlots = { ...settings.compareSlots, [id]: free };
		settings.compare = [...settings.compare, id];
	}

	function remove(id: string) {
		settings.compare = settings.compare.filter((x) => x !== id);
		settings.compareSlots = Object.fromEntries(Object.entries(settings.compareSlots).filter(([k]) => k !== id));
	}

	function setQuick(ids: string[]) {
		settings.compare = [];
		settings.compareSlots = {};
		ids.forEach(add);
	}

	const color = (id: string) => `var(--s${slotOf(id) + 1})`;

	/** Every series on one shared axis, so the values have to be brought to a common scale first */
	const normalized = $derived.by((): ChartSeries[] =>
		settings.compare
			.filter((id) => lookup(id))
			.map((id) => {
				const a = lookup(id)!;
				const raw = seriesFor(id, color(id));
				const vals = raw.points.map((p) => p.m.value);
				const first = vals[0];
				const mean = vals.reduce((s, v) => s + v, 0) / (vals.length || 1);
				const sd = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(1, vals.length - 1));

				const points = raw.points.flatMap((p) => {
					let v: number | undefined;
					if (settings.compareMode === 'range') {
						const pos = position(p.m.value, judge(p.m).bounds);
						v = pos === undefined ? undefined : pos * 100;
					} else if (settings.compareMode === 'index') v = first ? (p.m.value / first) * 100 : undefined;
					else v = sd > 0 ? (p.m.value - mean) / sd : undefined;
					return v === undefined || !Number.isFinite(v) ? [] : [{ ...p, v, status: judge(p.m).status }];
				});
				return { ...raw, name: nameOf(a), points };
			})
	);

	const dropped = $derived(settings.compare.filter((id) => (filtered.byAnalyte.get(id)?.length ?? 0) > 0 && !normalized.find((s) => s.id === id)?.points.length));

	const modeText = $derived(
		settings.compareMode === 'range' ? t.compare.modeText.range(t.basis[settings.basis]) : t.compare.modeText[settings.compareMode]
	);

	/** Filled curated bands of a small chart, the printed lab range only without one */
	function smallBands(id: string) {
		const bands = bandsFor(id);
		const curated = bands.filter((b) => b.filled && b.id !== 'lab');
		return curated.length ? curated : bands.filter((b) => b.id === 'lab').map((b) => ({ ...b, filled: true }));
	}

	const available = $derived(current.analytes.filter((a) => !settings.compare.includes(a.id) && (filtered.byAnalyte.get(a.id)?.length ?? 0) > 0));
</script>

<div class="space-y-4 p-4">
	<section class="rounded-lg border border-line bg-surface p-3">
		<div class="mb-3 flex flex-wrap items-center gap-2">
			{#each settings.compare as id (id)}
				{const a = $derived(lookup(id))}
				{#if a}
					<span class="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 py-0.5 pr-1 pl-2 text-xs" in:pop={{ y: 0, from: 0.8 }}>
						<span class="inline-block h-0.5 w-3 rounded" style:background={color(id)}></span>
						<a href={resolve('/analyte/[id]', { id })} class="font-medium text-ink hover:underline">{nameOf(a)}</a>
						<button type="button" onclick={() => remove(id)} class="rounded px-1 text-ink-3 hover:bg-hover hover:text-ink" aria-label={t.compare.remove(nameOf(a))}>×</button>
					</span>
				{/if}
			{/each}
			<select
				class="h-7 rounded-md border-line bg-surface py-0 pr-7 pl-2 text-xs"
				disabled={settings.compare.length >= MAX}
				onchange={(e) => {
					add(e.currentTarget.value);
					e.currentTarget.value = '';
				}}
			>
				<option value="">{settings.compare.length >= MAX ? t.compare.max(MAX) : t.compare.addAnalyte}</option>
				{#each groups as g (g.id)}
					{const items = $derived(available.filter((a) => a.group === g.id))}
					{#if items.length}
						<optgroup label={tx(g.label)}>
							{#each items as a (a.id)}<option value={a.id}>{nameOf(a)}{altNameOf(a) ? ` · ${altNameOf(a)}` : ''}</option>{/each}
						</optgroup>
					{/if}
				{/each}
			</select>
			<span class="ml-auto flex flex-wrap items-center gap-1">
				<span class="label mr-1">{t.compare.quick}</span>
				{#each quick as q (q.id)}
					<button type="button" onclick={() => setQuick(q.ids)} class="rounded-md bg-surface-2 px-2 py-1 text-xs text-ink-2 hover:text-ink">{q.label}</button>
				{/each}
			</span>
		</div>

		<div class="mb-2 flex flex-wrap items-center gap-3">
			<Segmented
				label={t.compare.scale}
				bind:value={settings.compareMode}
				options={(['range', 'index', 'z'] as const).map((value) => ({ value, label: t.compare.modes[value] }))}
			/>
			<span class="text-xs text-ink-3">{modeText}</span>
		</div>

		{#if normalized.some((s) => s.points.length)}
			<Chart
				series={normalized}
				{...chartProps(normalized)}
				height={420}
				labels={settings.labels === 'all' ? 'all' : 'none'}
				bands={settings.compareMode === 'range'
					? [{ id: 'inside', color: 'var(--ink-3)', label: t.compare.inside, low: 0, high: 100, range: t.compare.insideRange, filled: true }]
					: []}
				zeroLine={settings.compareMode === 'index' ? 100 : 0}
				yTitle={t.compare.yTitles[settings.compareMode]}
				ariaLabel={normalized.map((s) => s.name).join(', ')}
			/>
			<div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
				{#each normalized as s (s.id)}
					{const last = $derived(s.points.at(-1))}
					<span class="inline-flex items-center gap-1.5">
						<span class="inline-block h-0.5 w-4 rounded" style:background={s.color}></span>
						<span class="text-ink">{s.name}</span>
						{#if last}<span class="num text-ink-3">{t.compare.last} {fmtValue(lookup(s.id), last.m, settings.units)} {s.unit}</span>{/if}
					</span>
				{/each}
			</div>
			{#if dropped.length}
				<p class="mt-2 text-xs text-ink-3">
					{t.compare.dropped} {dropped.map((id) => nameOf(lookup(id)!)).join(', ')}.
				</p>
			{/if}
		{:else}
			<p class="py-10 text-center text-sm text-ink-3">{t.compare.empty}</p>
		{/if}
	</section>

	<section>
		<h2 class="mb-2 text-sm font-semibold">{t.compare.ownUnits} <span class="font-normal text-ink-3">· {t.compare.aligned}</span></h2>
		<div class="relative grid gap-3" style:grid-template-columns="repeat(auto-fill, minmax(340px, 1fr))">
			{#each settings.compare.filter((id) => lookup(id)) as id, i (id)}
				{const a = $derived(lookup(id)!)}
				{const s = $derived(seriesFor(id, color(id)))}
				<article class="rise rounded-lg border border-line bg-surface p-2" style:--i={i} animate:flip out:fade={{ duration: 120 }}>
					<div class="flex items-baseline gap-2 px-1">
						<span class="inline-block h-0.5 w-3 rounded" style:background={color(id)}></span>
						<a href={resolve('/analyte/[id]', { id })} class="text-[13px] font-semibold hover:underline">{nameOf(a)}</a>
						<span class="text-[11px] text-ink-3">{altNameOf(a) ? `${altNameOf(a)} · ` : ''}{unitOf(a, settings.units)}</span>
					</div>
					<Chart
						series={[s]}
						{...chartProps(settings.xMode === 'points' ? normalized : [s])}
						bands={smallBands(id)}
						height={150}
						compact
						log={useLog(id)}
						ariaLabel={t.chart.ariaChart(`${nameOf(a)} (${unitOf(a, settings.units)})`)}
					/>
				</article>
			{/each}
		</div>
	</section>
</div>
