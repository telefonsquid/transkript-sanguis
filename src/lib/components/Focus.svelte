<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		KIND_ORDER,
		bestRef,
		boundsLabel,
		convert,
		decimalsOf,
		fmtBounds,
		fmtDate,
		fmtInputs,
		fmtLabRef,
		fmtNum,
		fmtValue,
		refBounds,
		refsFor,
		statusOf,
		stats,
		unitOf
	} from '../analysis';
	import Chart from '../chart/Chart.svelte';
	import { groupById, sourceById } from '../data';
	import { fileKey, openFile } from '../files';
	import { altNameOf, nameOf, t, tx } from '../i18n';
	import { fly, pop, slide } from '../motion.svelte';
	import { prefs } from '../prefs.svelte';
	import { current, lookup } from '../profiles.svelte';
	import { filtered, settings, toggle } from '../state.svelte';
	import { bandsFor, chartProps, hrtLabel, judge, phaseLabel, seriesFor, useLog } from '../view.svelte';
	import Card from './Card.svelte';
	import FocusEditor from './FocusEditor.svelte';

	interface Props {
		id: string;
	}

	let { id }: Props = $props();

	const a = $derived(lookup(id)!);
	const group = $derived(groupById.get(a.group)!);
	const units = $derived(settings.units);
	const unit = $derived(unitOf(a, units));
	const dec = $derived(decimalsOf(a, units));
	const alt = $derived(altNameOf(a));
	const info = $derived(a.info[prefs.lang] ?? a.info.en);

	const series = $derived(seriesFor(a.id));
	const ms = $derived(filtered.byAnalyte.get(a.id) ?? []);
	const all = $derived(current.built.measurements.filter((m) => m.analyte === a.id));
	const hiddenCount = $derived(all.length - ms.length);
	const st = $derived(stats(ms));
	const start = $derived(current.hrtStart);

	let highlight: string | null = $state(null);

	/** Bands switched on or off by hand, the rest follow the display setting */
	let shown: Record<string, boolean> = $state({});

	const bands = $derived(bandsFor(a.id).map((b) => ({ ...b, filled: shown[b.id] ?? b.filled })));
	const labOn = $derived(!!bands.find((b) => b.id === 'lab')?.filled);

	function toggleBand(id: string) {
		shown[id] = !bands.find((b) => b.id === id)?.filled;
	}
	const refs = $derived([...refsFor(a, current.subject)].sort((x, y) => KIND_ORDER.indexOf(x.kind) - KIND_ORDER.indexOf(y.kind)));
	const primary = $derived(bestRef(a, current.subject));

	const last = $derived(st.last);
	const lastBounds = $derived(last ? judge(last).bounds : undefined);
	const lastStatus = $derived(last ? judge(last).status : 'none');

	const reports = $derived(new Map((current.profile?.reports ?? []).map((r) => [r.id, r])));

	/** Distinct printed lab ranges in order of appearance, a switch between male and female ranges shows here */
	const labRanges = $derived.by(() => {
		const out: { text: string; lab: string; sex?: string; from: number; to: number }[] = [];
		for (const m of ms) {
			if (!m.labRef) continue;
			const text = fmtLabRef(m.labRef);
			const key = `${text}|${m.lab}|${m.rangesFor}`;
			const prev = out.at(-1);
			if (prev && `${prev.text}|${prev.lab}|${prev.sex}` === key) prev.to = m.t;
			else out.push({ text, lab: m.lab || t.common.noLab, sex: m.rangesFor, from: m.t, to: m.t });
		}
		return out;
	});

	const order = $derived(filtered.visible.map((x) => x.id));
	const idx = $derived(order.indexOf(a.id));
	const prevId = $derived(idx > 0 ? order[idx - 1] : undefined);
	const nextId = $derived(idx >= 0 && idx < order.length - 1 ? order[idx + 1] : undefined);

	const conv = (v: number | undefined) => (v === undefined ? '—' : fmtNum(convert(a, v, units), dec));

	const hrtNote = $derived(
		current.therapy === 'feminizing' && info.fem
			? { label: t.focus.info.fem, text: info.fem, tint: 'var(--fem)', ink: 'var(--fem-ink)' }
			: current.therapy === 'masculinizing' && info.masc
				? { label: t.focus.info.masc, text: info.masc, tint: 'var(--masc)', ink: 'var(--masc-ink)' }
				: undefined
	);
	const cited = $derived((a.cites ?? []).map((c) => sourceById.get(c)!));
	const paragraphs = (text: string) => text.split('\n\n');

	/** Value whose results are being edited, moving to another value leaves the form */
	let editing: string | null = $state(null);

	/** Value whose background is unfolded, so moving to another value folds it again */
	let unfolded: string | null = $state(null);
	const expanded = $derived(unfolded === a.id);

	function hrtText(time: number): string {
		if (start === undefined) return '';
		return time < start ? phaseLabel('baseline') : hrtLabel(time);
	}

	function onkeydown(e: KeyboardEvent) {
		if ((e.target as HTMLElement).closest('input, select, textarea')) return;
		if (e.key === ']' && nextId) goto(resolve('/analyte/[id]', { id: nextId }));
		if (e.key === '[' && prevId) goto(resolve('/analyte/[id]', { id: prevId }));
	}

	function addToCompare() {
		settings.compare = [...new Set([...settings.compare, a.id])];
		settings.view = 'compare';
		goto(resolve('/'));
	}
</script>

<svelte:window {onkeydown} />

<div class="mx-auto max-w-[1500px] p-4">
	<div class="rise mb-3 flex items-center justify-between text-xs text-ink-3">
		<div class="flex items-center gap-1.5">
			<a href={resolve('/')} class="hover:text-ink">{t.focus.back}</a>
			<span>/</span>
			<span>{tx(group.label)}</span>
		</div>
		<div class="flex items-center gap-1">
			{#if prevId}
				<a href={resolve('/analyte/[id]', { id: prevId })} class="rounded-md border border-line px-2 py-0.5 hover:bg-hover hover:text-ink" title={t.focus.prevTitle}>← {nameOf(lookup(prevId)!)}</a>
			{/if}
			{#if nextId}
				<a href={resolve('/analyte/[id]', { id: nextId })} class="rounded-md border border-line px-2 py-0.5 hover:bg-hover hover:text-ink" title={t.focus.nextTitle}>{nameOf(lookup(nextId)!)} →</a>
			{/if}
		</div>
	</div>

	<header class="rise mb-4 flex flex-wrap items-end justify-between gap-4" style:--i="1">
		<div class="min-w-0">
			<h1 class="text-2xl font-semibold tracking-tight text-ink">
				{nameOf(a)}
				{#if alt}<span class="ml-1 text-lg font-normal text-ink-3">{alt}</span>{/if}
			</h1>
			<div class="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-ink-2">
				<span class="rounded bg-surface-3 px-1.5 py-0.5">{tx(group.label)}</span>
				<span class="num rounded bg-surface-3 px-1.5 py-0.5">{unit}{a.si && units === 'conv' ? ` · ${t.focus.siHint(a.si.unit, fmtNum(a.si.factor, String(a.si.factor).split('.')[1]?.length ?? 0))}` : ''}</span>
				{#if a.derived}<span class="rounded bg-surface-3 px-1.5 py-0.5">{t.focus.computed}</span>{/if}
				{#each a.aliases ?? [] as alias (alias)}
					<span class="rounded border border-line px-1.5 py-0.5 text-ink-3">{alias}</span>
				{/each}
				<button type="button" onclick={() => (settings.pinned = toggle(settings.pinned, a.id))} class="rounded border border-line px-1.5 py-0.5 hover:bg-hover">
					{settings.pinned.includes(a.id) ? t.focus.pinned : t.focus.pin}
				</button>
				<button type="button" onclick={addToCompare} class="rounded border border-line px-1.5 py-0.5 hover:bg-hover">{t.focus.addCompare}</button>
			</div>
		</div>

		{#if last}
			<div class="text-right">
				<div class="flex items-baseline justify-end gap-2">
					{#key fmtValue(a, last, units)}
						<span class="text-5xl font-semibold tracking-tight text-ink" in:fly={{ y: 14, duration: 320 }}>{fmtValue(a, last, units)}</span>
					{/key}
					<span class="text-sm text-ink-3">{unit}</span>
				</div>
				<div class="mt-1 text-xs text-ink-2">
					{#if lastStatus === 'high' || lastStatus === 'low'}
						<span style:color="var(--{lastStatus})">{lastStatus === 'high' ? '▲' : '▼'}</span>
					{/if}
					{lastStatus === 'none' ? t.focus.status.none : t.focus.status[lastStatus](lastBounds ? boundsLabel(lastBounds) : '')}
					{#if lastBounds}<span class="num text-ink-3">({fmtBounds(a, lastBounds, units)})</span>{/if}
				</div>
				<div class="num mt-0.5 text-[11px] text-ink-3">
					{fmtDate(last.t)}{#if hrtText(last.t)} · {hrtText(last.t)}{/if} · {last.lab || t.common.noLab}
					{#if st.prev && !last.censor && !st.prev.censor}
						{const d = $derived(convert(a, last.value, units) - convert(a, st.prev.value, units))}
						· {d >= 0 ? '+' : '−'}{fmtNum(Math.abs(d), dec)} {t.focus.vs(fmtDate(st.prev.t))}
					{/if}
				</div>
			</div>
		{/if}
	</header>

	<div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
		<div class="min-w-0 space-y-4">
			<section class="rise rounded-lg border border-line bg-surface p-3" style:--i="2" data-hero={a.id}>
				{#if hiddenCount > 0}
					<div class="mb-2 text-[11px] text-ink-3">{t.focus.hidden(hiddenCount)}</div>
				{/if}
				<Chart
					series={[series]}
					{bands}
					{...chartProps([series])}
					height={400}
					rails
					log={useLog(a.id)}
					labels={settings.labels === 'last' ? 'all' : settings.labels}
					yTitle={unit}
					{highlight}
					onbandhover={(b) => (highlight = b)}
					onbandclick={toggleBand}
					ariaLabel={t.chart.ariaChart(`${nameOf(a)} (${unit})`)}
				/>
				<div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-3">
					<span>{t.focus.legend.measured}</span>
					<span>{t.focus.legend.censored}</span>
					<span>{t.focus.legend.derived}</span>
					<span>{t.focus.legend.suspect}</span>
					<span><span style:color="var(--high)">◯</span> {t.focus.legend.outside(t.basis[settings.basis])}</span>
					<span>{t.focus.legend.phase}</span>
				</div>
			</section>

			<section class="rise rounded-lg border border-line bg-surface" style:--i="3">
				<h2 class="flex items-baseline justify-between gap-3 border-b border-line px-3 py-2">
					<span class="text-sm font-semibold">{t.focus.references}</span>
					<span class="text-[11px] text-ink-3">{t.focus.referencesHint}</span>
				</h2>
				<table class="w-full text-xs">
					<tbody>
						{#if labRanges.length}
							<tr
								class={['ref-row cursor-pointer border-b border-line align-top', labOn && 'is-on', highlight === 'lab' && 'is-lit']}
								style:--kind="var(--ref-lab)"
								onpointerenter={() => (highlight = 'lab')}
								onpointerleave={() => (highlight = null)}
								onclick={() => toggleBand('lab')}
							>
								<td class="w-12 py-2 pl-3">
									<button
										type="button"
										role="switch"
										aria-checked={labOn}
										aria-label={t.focus.showLabOnChart}
										class="band-chip"
										onclick={(e) => {
											e.stopPropagation();
											toggleBand('lab');
										}}><span class="band-fill"></span></button
									>
								</td>
								<td class="px-2 py-2">
									<div class="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-medium text-ink">
										<span class="ref-name">{t.focus.printedByLab}</span>
										{#if labOn}
											<span class="on-tag" in:pop={{ y: 0, from: 0.6 }}>{t.focus.onChart}</span>
										{/if}
									</div>
									<div class="text-ink-3">{t.focus.printedByLabNote(a.unit)}</div>
								</td>
								<td class="num px-2 py-2 text-ink-2" colspan="3">
									{#each labRanges as r, i (i)}
										<div>
											<span class="text-ink">{r.text}</span>
											<span class="text-ink-3">· {r.lab}{r.sex ? `, ${t.profile.sexes[r.sex as 'female' | 'male']}` : ''} · {fmtDate(r.from)}{r.to !== r.from ? ` – ${fmtDate(r.to)}` : ''}</span>
										</div>
									{/each}
								</td>
							</tr>
						{/if}
						{#each refs as r (r.id)}
							{const b = $derived(bands.find((x) => x.id === r.id))}
							{const s = $derived(last ? statusOf(last, refBounds(r)) : 'none')}
							{const src = $derived(sourceById.get(r.source))}
							{const on = $derived(!!b?.filled)}
							<tr
								class={['ref-row cursor-pointer border-b border-line align-top last:border-0', on && 'is-on', highlight === r.id && 'is-lit', !b && 'opacity-45']}
								style:--kind="var(--ref-{r.kind})"
								onpointerenter={() => (highlight = r.id)}
								onpointerleave={() => (highlight = null)}
								onclick={() => toggleBand(r.id)}
							>
								<td class="w-12 py-2 pl-3">
									<button
										type="button"
										role="switch"
										aria-checked={on}
										aria-label={t.focus.showOnChart(tx(r.label))}
										class="band-chip"
										onclick={(e) => {
											e.stopPropagation();
											toggleBand(r.id);
										}}><span class="band-fill"></span></button
									>
								</td>
								<td class="px-2 py-2">
									<div class="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-medium text-ink">
										<span class="ref-name">{tx(r.label)}</span>
										{#if on}
											<span class="on-tag" in:pop={{ y: 0, from: 0.6 }}>{t.focus.onChart}</span>
										{/if}
										{#if r.id === primary?.id}<span class="rounded bg-surface-3 px-1 text-[10px] text-ink-2">{t.focus.defaultBasis}</span>{/if}
									</div>
									<div class="text-ink-3">{t.kind[r.kind]}{r.note ? ` · ${tx(r.note)}` : ''}</div>
								</td>
								<td class="num px-2 py-2 whitespace-nowrap text-ink">{fmtBounds(a, r, units)} <span class="text-ink-3">{unit}</span></td>
								<td class="px-2 py-2 whitespace-nowrap text-ink-2">
									{#if s === 'high' || s === 'low'}
										<span style:color="var(--{s})">{s === 'high' ? '▲' : '▼'}</span> {s === 'high' ? t.focus.latestAbove : t.focus.latestBelow}
									{:else if s === 'in'}
										<span class="text-ink-3">{t.focus.latestInside}</span>
									{/if}
								</td>
								<td class="py-2 pr-3 text-right whitespace-nowrap">
									{#if src?.url}
										<a href={src.url} target="_blank" rel="noreferrer" class="text-ink-3 underline decoration-line-strong underline-offset-2 hover:text-ink" onclick={(e) => e.stopPropagation()} title={src.title}>{src.short}</a>
									{:else}
										<span class="text-ink-3" title={src?.title}>{src?.short}</span>
									{/if}
								</td>
							</tr>
						{/each}
						{#if !refs.length && !labRanges.length}
							<tr><td class="px-3 py-3 text-ink-3">{t.focus.noRefs}</td></tr>
						{/if}
					</tbody>
				</table>
			</section>

			<section class="rise overflow-x-auto rounded-lg border border-line bg-surface" style:--i="4">
				<div class="flex items-center border-b border-line px-3 py-2">
					<h2 class="text-sm font-semibold">{t.focus.yourData}</h2>
					{#if current.profile?.draws.length && !editing}
						<button type="button" onclick={() => (editing = a.id)} class="ml-auto rounded-md border border-line px-2 py-0.5 text-xs font-medium text-ink-2 hover:bg-hover hover:text-ink">{t.common.edit}</button>
					{/if}
				</div>
				{#if editing === a.id}
					<FocusEditor {a} ondone={() => (editing = null)} />
				{:else}
				<table class="num w-full text-xs">
					<thead class="text-left text-ink-3">
						<tr class="border-b border-line">
							<th class="px-3 py-1.5 font-medium">{t.focus.cols.date}</th>
							{#if start !== undefined}<th class="px-2 py-1.5 font-medium">{t.focus.cols.hrt}</th>{/if}
							<th class="px-2 py-1.5 text-right font-medium">{t.focus.cols.value}</th>
							<th class="px-2 py-1.5 font-medium">{t.focus.cols.status}</th>
							<th class="px-2 py-1.5 font-medium">{t.focus.cols.printed}</th>
							<th class="px-2 py-1.5 font-medium">{t.focus.cols.lab}</th>
							<th class="px-2 py-1.5 font-medium">{t.focus.cols.phase}</th>
							<th class="px-2 py-1.5 font-medium">{t.focus.cols.report}</th>
							<th class="px-3 py-1.5 font-medium">{t.focus.cols.notes}</th>
						</tr>
					</thead>
					<tbody>
						{#each [...ms].reverse() as m (m.drawId)}
							{const s = $derived(judge(m).status)}
							{const report = $derived(m.report ? reports.get(m.report) : undefined)}
							<tr class="border-b border-line align-top last:border-0 hover:bg-hover">
								<td class="px-3 py-1.5 whitespace-nowrap text-ink">{fmtDate(m.t)}</td>
								{#if start !== undefined}<td class="px-2 py-1.5 whitespace-nowrap text-ink-3">{hrtText(m.t)}</td>{/if}
								<td class="px-2 py-1.5 text-right font-semibold whitespace-nowrap text-ink">{fmtValue(a, m, units)} <span class="font-normal text-ink-3">{unit}</span></td>
								<td class="px-2 py-1.5 whitespace-nowrap">
									{#if s === 'high' || s === 'low'}<span style:color="var(--{s})">{s === 'high' ? '▲' : '▼'} {t.status[s]}</span>{:else if s === 'in'}<span class="text-ink-3">{t.status.in}</span>{/if}
								</td>
								<td class={['px-2 py-1.5 whitespace-nowrap', m.labRef ? 'text-ink-2' : 'text-ink-3']}>
									{fmtLabRef(m.labRef)}{#if m.printedUnit}<span class="text-ink-3"> {m.printedUnit}</span>{/if}{#if m.labRef && m.rangesFor}<span class="text-ink-3"> ({t.profile.sexes[m.rangesFor]})</span>{/if}{#if m.labFlag}<span class="ml-1 text-ink-3">[{m.labFlag}]</span>{/if}
								</td>
								<td class={['px-2 py-1.5 whitespace-nowrap', m.lab ? 'text-ink-2' : 'text-ink-3']}>{m.lab || '—'}</td>
								<td class="max-w-40 truncate px-2 py-1.5 whitespace-nowrap text-ink-2">{phaseLabel(m.phase)}</td>
								<td class="px-2 py-1.5 whitespace-nowrap">
									{#if report?.file && current.profile}
										{const key = $derived(fileKey(current.profile.id, report.id))}
										<button type="button" onclick={() => openFile(key)} class="text-[11px] text-ink-3 underline decoration-line-strong underline-offset-2 hover:text-ink" title={report.file.name}>{t.focus.openPdf}</button>
									{/if}
								</td>
								<td class="max-w-md px-3 py-1.5 font-sans text-ink-2">
									{#if m.derived}<div>◇ {tx(m.derived)}</div>{/if}
									{#if m.inputs?.length}<div class="text-ink-3">{t.chart.from}: {fmtInputs(m.inputs, units)}</div>{/if}
									{#if m.note}<div>{m.note}</div>{/if}
									{#if m.suspect}<div style:color="var(--serious)">⚠ {m.suspect}</div>{/if}
									{#if m.censor}<div class="text-ink-3">{t.focus.censoredNote(m.raw)}</div>{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				{/if}
			</section>
		</div>

		<aside class="space-y-4">
			<section class="rise rounded-lg border border-line bg-surface p-4 text-[13px] leading-relaxed" style:--i="3">
				<dl class="space-y-3">
					<div>
						<dt class="label mb-0.5">{t.focus.info.what}</dt>
						<dd class="text-ink">{info.what}</dd>
					</div>
					{#if info.why}
						<div>
							<dt class="label mb-0.5">{t.focus.info.why}</dt>
							<dd class="text-ink">{info.why}</dd>
						</div>
					{/if}
					{#if hrtNote}
						<div class="hrt-note rounded-md p-2.5" style:--tint={hrtNote.tint}>
							<dt class="label mb-0.5" style:color={hrtNote.ink}>{hrtNote.label}</dt>
							{#each paragraphs(hrtNote.text) as p, i (i)}<dd class="text-ink" class:mt-1.5={i > 0}>{p}</dd>{/each}
						</div>
					{/if}
					{#if info.high}
						<div>
							<dt class="label mb-0.5"><span style:color="var(--high)">▲</span> {t.focus.info.high}</dt>
							<dd class="text-ink-2">{info.high}</dd>
						</div>
					{/if}
					{#if info.low}
						<div>
							<dt class="label mb-0.5"><span style:color="var(--low)">▼</span> {t.focus.info.low}</dt>
							<dd class="text-ink-2">{info.low}</dd>
						</div>
					{/if}
					{#if info.note || a.derived}
						<div>
							<dt class="label mb-0.5">{t.focus.info.notes}</dt>
							{#if a.derived}<dd class="text-ink-2">◇ {tx(a.derived)}</dd>{/if}
							{#if info.note}<dd class="text-ink-2">{info.note}</dd>{/if}
						</div>
					{/if}
				</dl>
				{#if info.more}
					<button type="button" class="more-toggle mt-3 flex items-center gap-1.5 text-xs font-medium text-ink-2 hover:text-ink" aria-expanded={expanded} onclick={() => (unfolded = expanded ? null : a.id)}>
						<svg viewBox="0 0 12 12" class="chevron size-3" class:open={expanded} aria-hidden="true"><path d="M4 2.5 7.5 6 4 9.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
						{expanded ? t.focus.info.less : t.focus.info.more}
					</button>
					{#if expanded}
						<div transition:slide class="space-y-2 pt-2 text-ink-2">
							{#each paragraphs(info.more) as p, i (i)}<p>{p}</p>{/each}
						</div>
					{/if}
				{/if}
				{#if cited.length}
					<p class="mt-4 flex flex-wrap gap-x-1.5 text-[11px] leading-5 text-ink-3">
						<span class="font-semibold">{t.focus.info.sources}:</span>
						{#each cited as src, i (src.id)}
							<span class="whitespace-nowrap"
								><a href={src.url} target="_blank" rel="noreferrer" title={src.title} class="underline decoration-line-strong underline-offset-2 hover:text-ink">{src.short}</a
								>{#if i < cited.length - 1}&nbsp;·{/if}</span
							>
						{/each}
					</p>
				{/if}
				<p class="mt-4 border-t border-line pt-3 text-[11px] text-ink-3">{t.focus.disclaimer}</p>
			</section>

			<section class="rise rounded-lg border border-line bg-surface p-4" style:--i="4">
				<h2 class="mb-2 text-sm font-semibold">{t.focus.stats.title} <span class="font-normal text-ink-3">· {unit}</span></h2>
				<dl class="num grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
					<dt class="text-ink-3">{t.focus.stats.n}</dt><dd class="text-right text-ink">{st.n}</dd>
					<dt class="text-ink-3">{t.focus.stats.first}</dt><dd class="text-right text-ink">{st.first ? fmtDate(st.first.t) : '—'}</dd>
					<dt class="text-ink-3">{t.focus.stats.min}</dt><dd class="text-right text-ink">{st.min ? fmtValue(a, st.min, units) : '—'} <span class="text-ink-3">{st.min ? fmtDate(st.min.t) : ''}</span></dd>
					<dt class="text-ink-3">{t.focus.stats.max}</dt><dd class="text-right text-ink">{st.max ? fmtValue(a, st.max, units) : '—'} <span class="text-ink-3">{st.max ? fmtDate(st.max.t) : ''}</span></dd>
					<dt class="text-ink-3">{t.focus.stats.mean}</dt><dd class="text-right text-ink">{conv(st.mean)}{st.sd !== undefined ? ` ± ${conv(st.sd)}` : ''}</dd>
					<dt class="text-ink-3">{t.focus.stats.median}</dt><dd class="text-right text-ink">{conv(st.median)}</dd>
					{#if start !== undefined}
						<dt class="text-ink-3">{t.focus.stats.pre}</dt><dd class="text-right text-ink">{conv(st.preMean)}</dd>
						<dt class="text-ink-3">{t.focus.stats.hrt}</dt><dd class="text-right text-ink">{conv(st.hrtMean)}</dd>
						{#if st.preMean !== undefined && st.hrtMean !== undefined && st.preMean !== 0}
							{const diff = $derived(st.hrtMean - st.preMean)}
							<dt class="text-ink-3">{t.focus.stats.change}</dt>
							<dd class="text-right text-ink">{diff >= 0 ? '+' : '−'}{conv(Math.abs(diff))} <span class="text-ink-3">({diff >= 0 ? '+' : '−'}{fmtNum(Math.abs((diff / st.preMean) * 100), 0)} %)</span></dd>
						{/if}
						<dt class="text-ink-3" title={t.focus.stats.slopeTitle}>{t.focus.stats.slope}</dt>
						<dd class="text-right text-ink">{st.slopePerYear !== undefined ? `${st.slopePerYear >= 0 ? '+' : '−'}${conv(Math.abs(st.slopePerYear))} ${t.focus.stats.perYear}` : '—'}</dd>
					{/if}
				</dl>
				<p class="mt-3 text-[11px] text-ink-3">{t.focus.stats.note}</p>
			</section>
		</aside>
	</div>

	{#if a.related?.length}
		{const related = $derived(a.related.filter((r) => current.built.measurements.some((m) => m.analyte === r)))}
		{#if related.length}
			<section class="mt-6">
				<h2 class="mb-2 text-sm font-semibold">{t.focus.related}</h2>
				<div class="grid gap-3" style:grid-template-columns="repeat(auto-fill, minmax(280px, 1fr))">
					{#each related as r (r)}
						<Card analyte={lookup(r)!} height={110} />
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>

<style>
	/* A shown reference lights up its row in its own colour, with a bar on the left */
	.ref-row {
		transition:
			background-color 220ms,
			box-shadow 280ms cubic-bezier(0.3, 1.4, 0.5, 1);
	}
	.ref-row:hover,
	.ref-row.is-lit {
		background: var(--hover);
	}
	.ref-row.is-on {
		background: color-mix(in srgb, var(--kind) 9%, var(--surface));
		box-shadow: inset 4px 0 0 var(--kind);
	}
	.ref-row.is-on:hover,
	.ref-row.is-on.is-lit {
		background: color-mix(in srgb, var(--kind) 15%, var(--surface));
	}
	.ref-row.is-on .ref-name {
		font-weight: 650;
	}

	/* Chip that looks like the band it stands for, hollow while hidden */
	.band-chip {
		position: relative;
		display: block;
		width: 30px;
		height: 18px;
		margin-top: 1px;
		overflow: hidden;
		border-radius: 4px;
		border: 1.5px dashed color-mix(in srgb, var(--kind) 65%, transparent);
		transition: border-color 200ms;
	}
	.band-fill {
		position: absolute;
		inset: 0;
		background: color-mix(in srgb, var(--kind) 30%, transparent);
		border-block: 2px solid var(--kind);
		transform: scaleY(0);
		transition: transform 320ms cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	.is-on .band-chip {
		border-style: solid;
		border-color: transparent;
	}
	.is-on .band-fill {
		transform: scaleY(1);
	}

	.hrt-note {
		background: color-mix(in srgb, var(--tint) 16%, var(--surface));
		box-shadow: inset 3px 0 0 var(--tint);
	}

	.chevron {
		transition: transform 220ms cubic-bezier(0.3, 1.4, 0.5, 1);
	}
	.chevron.open {
		transform: rotate(90deg);
	}

	.on-tag {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		border-radius: 999px;
		padding: 0 7px 0 5px;
		font-size: 10px;
		font-weight: 600;
		line-height: 16px;
		color: var(--ink);
		background: color-mix(in srgb, var(--kind) 22%, var(--surface));
	}
	.on-tag::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: var(--kind);
	}
</style>
