<script lang="ts">
	import { resolve } from '$app/paths';
	import { groupById } from '../data';
	import type { Analyte } from '../data/types';
	import { t, tx } from '../i18n';
	import { current } from '../profiles.svelte';
	import { filtered, resetProfileFilters, settings } from '../state.svelte';
	import Card from './Card.svelte';

	const size = $derived({ s: { col: 230, h: 96 }, m: { col: 290, h: 124 }, l: { col: 400, h: 180 } }[settings.cardSize]);

	// Group headings only make sense while sorted by group and nothing is pinned
	const sections = $derived.by(() => {
		const list = filtered.visible;
		if (settings.sort !== 'group' || settings.pinned.length) return [{ id: 'all', label: '', items: list }];
		const out: { id: string; label: string; items: Analyte[] }[] = [];
		for (const a of list) {
			const g = groupById.get(a.group)!;
			if (out.at(-1)?.id !== g.id) out.push({ id: g.id, label: tx(g.label), items: [] });
			out.at(-1)!.items.push(a);
		}
		return out;
	});

	function clearFilters() {
		resetProfileFilters();
		settings.selection = null;
		settings.preset = null;
		settings.search = '';
		settings.onlyOut = false;
		settings.minPoints = 1;
	}
</script>

<div class="p-4">
	{#if !current.built.measurements.length}
		<div class="rounded-lg border border-dashed border-line-strong p-10 text-center text-sm text-ink-2">
			<p class="mb-4">{t.grid.noData}</p>
			<a href={resolve('/data')} class="inline-block rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-surface hover:opacity-90">{t.grid.addFirst}</a>
		</div>
	{:else if !filtered.visible.length}
		<div class="rounded-lg border border-dashed border-line-strong p-10 text-center text-sm text-ink-2">
			<p class="mb-3">{t.grid.empty}</p>
			<button type="button" onclick={clearFilters} class="rounded-md border border-line px-3 py-1 text-xs hover:bg-hover">{t.grid.clearFilters}</button>
		</div>
	{/if}

	{#each sections as s (s.id)}
		<section class="mb-6">
			{#if s.label}
				<h2 class="mb-2 flex items-baseline gap-2">
					<span class="text-sm font-semibold text-ink">{s.label}</span>
					<span class="num text-xs text-ink-3">· {s.items.length}</span>
				</h2>
			{/if}
			<div class="grid gap-3" style:grid-template-columns="repeat(auto-fill, minmax({size.col}px, 1fr))">
				{#each s.items as a (a.id)}
					<Card analyte={a} height={size.h} />
				{/each}
			</div>
		</section>
	{/each}
</div>
