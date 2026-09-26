<script lang="ts">
	import { resolve } from '$app/paths';
	import { boundsFor, fmtDay, fmtHrt, monthsOnHrt, phaseName, statusOf } from '../../analysis';
	import { toTime } from '../../data';
	import type { Draw, Measurement, Profile } from '../../data/types';
	import { deleteFile, fileKey, openFile, putFile } from '../../files';
	import { t } from '../../i18n';
	import { current, deleteDraw, lookup, newId } from '../../profiles.svelte';
	import { settings } from '../../state.svelte';

	let { profile }: { profile: Profile } = $props();

	const byDraw = $derived(Map.groupBy(current.built.measurements, (m) => m.drawId));

	/** Newest year first, newest draw first within it */
	const years = $derived([...Map.groupBy([...profile.draws].reverse(), (d) => d.date.slice(0, 4))]);

	function summary(ms: Measurement[]) {
		let high = 0;
		let low = 0;
		for (const m of ms) {
			const a = lookup(m.analyte);
			if (!a || m.derived) continue;
			const s = statusOf(m, boundsFor(a, m, settings.basis));
			if (s === 'high') high++;
			else if (s === 'low') low++;
		}
		const computed = ms.filter((m) => m.derived).length;
		return { printed: ms.length - computed, computed, high, low };
	}

	async function attach(draw: Draw, input: HTMLInputElement) {
		const file = input.files?.[0];
		if (!file) return;
		const id = draw.report ?? newId('report');
		profile.reports = [...profile.reports.filter((r) => r.id !== id), { id, lab: draw.lab, issued: draw.date, file: { name: file.name, type: file.type, size: file.size } }];
		await putFile(fileKey(profile.id, id), file);
		draw.report = id;
		input.value = '';
	}

	async function detach(draw: Draw) {
		if (!draw.report || !confirm(t.data.removePdfConfirm)) return;
		const id = draw.report;
		await deleteFile(fileKey(profile.id, id)).catch(() => undefined);
		profile.reports = profile.reports.map((r) => (r.id === id ? { ...r, file: undefined } : r));
	}

	function remove(draw: Draw) {
		if (confirm(t.common.confirmDelete)) deleteDraw(profile, draw.id);
	}

	const iconButton = 'inline-flex size-7 items-center justify-center rounded-md text-ink-3 hover:bg-hover hover:text-ink';
</script>

<div class="@container space-y-5">
	{#each years as [year, draws] (year)}
		<section aria-labelledby="year-{year}">
			<div class="mb-1.5 flex items-baseline gap-3 px-1">
				<h3 id="year-{year}" class="num text-sm font-semibold">{year}</h3>
				<span class="h-px flex-1 self-center bg-line"></span>
				<span class="text-[11px] text-ink-3">{t.profile.draws(draws.length)}</span>
			</div>
			<ul class="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
				{#each draws as d, i (d.id)}
					{const ms = $derived(byDraw.get(d.id) ?? [])}
					{const s = $derived(summary(ms))}
					{const time = $derived(toTime(d.date, d.time))}
					{const report = $derived(profile.reports.find((r) => r.id === d.report))}
					{const phase = $derived(ms[0] && profile.phases.length ? phaseName(ms[0].phase) : '')}
					<li style:--i={i + 3} class="rise grid grid-cols-[4.25rem_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 px-4 py-3 hover:bg-hover @2xl:grid-cols-[4.25rem_minmax(0,1fr)_9.5rem_auto]">
						<div class="num">
							<div class="text-sm font-semibold text-ink">{fmtDay(time)}</div>
							<div class="text-[11px] text-ink-3">{d.time ?? (monthsOnHrt(time) !== undefined ? fmtHrt(time) : '')}</div>
						</div>

						<div class="min-w-0">
							<div class="truncate">
								<span class={d.lab ? 'font-medium text-ink' : 'text-ink-3'}>{d.lab || t.common.noLab}</span>
								{#if d.rangesFor}<span class="text-xs text-ink-3"> · {t.data.rangesFor(t.profile.sexes[d.rangesFor])}</span>{/if}
							</div>
							{#if phase || d.notes?.length}
								<div class="mt-0.5 flex min-w-0 items-center gap-2 text-xs">
									{#if phase}<span class="shrink-0 rounded bg-surface-3 px-1.5 py-px text-[11px] text-ink-2">{phase}</span>{/if}
									{#if d.notes?.length}<span class="truncate text-ink-3" title={d.notes.join('\n')}>{d.notes.join(' · ')}</span>{/if}
								</div>
							{/if}
						</div>

						<div class="col-start-2 row-start-2 flex flex-wrap gap-x-3 text-xs @2xl:col-start-auto @2xl:row-start-auto @2xl:block">
							<div class="num text-ink-2" title={s.computed ? t.data.withComputed(s.computed) : undefined}>{t.data.values(s.printed)}</div>
							{#if s.high || s.low}
								<div class="num flex gap-2 text-[11px] text-ink-2 @2xl:mt-0.5">
									{#if s.high}<span><span style:color="var(--high)" aria-hidden="true">▲</span> {t.data.high(s.high)}</span>{/if}
									{#if s.low}<span><span style:color="var(--low)" aria-hidden="true">▼</span> {t.data.low(s.low)}</span>{/if}
								</div>
							{:else if s.printed}
								<div class="text-[11px] text-ink-3 @2xl:mt-0.5">{t.data.noneOut}</div>
							{/if}
						</div>

						<div class="flex items-center gap-0.5">
							{#if report?.file}
								<button type="button" onclick={() => openFile(fileKey(profile.id, report.id))} title={report.file.name} class="rounded-md border border-line px-2 py-1 text-[11px] font-medium text-ink-2 hover:bg-surface-3 hover:text-ink">
									PDF
								</button>
								<button type="button" onclick={() => detach(d)} class={iconButton} aria-label={t.data.removePdf} title={t.data.removePdf}>×</button>
							{:else}
								<label class="cursor-pointer rounded-md border border-dashed border-line-strong px-2 py-1 text-[11px] text-ink-3 hover:text-ink" title={t.data.attachPdf}>
									+ PDF
									<input type="file" accept="application/pdf,image/*" class="sr-only" onchange={(e) => attach(d, e.currentTarget)} aria-label={t.data.attachPdf} />
								</label>
							{/if}
							<a href="{resolve('/data/manual')}?draw={d.id}" class="ml-1 rounded-md px-2 py-1 text-xs font-medium text-ink-2 hover:bg-surface-3 hover:text-ink">{t.data.editDraw}</a>
							<button type="button" onclick={() => remove(d)} class="{iconButton} hover:text-[var(--critical)]" aria-label={t.manual.deleteDraw} title={t.manual.deleteDraw}>
								<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true">
									<path d="M2.5 4.5h11M6 4.5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M4 4.5l.7 8.6a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-8.6" />
								</svg>
							</button>
						</div>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
