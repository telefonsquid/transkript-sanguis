<script lang="ts">
	import { resolve } from '$app/paths';
	import { boundsFor, statusOf } from '../analysis';
	import { groups, presets } from '../data';
	import type { Analyte, GroupId, Preset } from '../data/types';
	import { altNameOf, nameOf, t, tx } from '../i18n';
	import { slide } from '../motion.svelte';
	import { current } from '../profiles.svelte';
	import { filtered, settings, toggle } from '../state.svelte';

	interface Props {
		active?: string;
	}

	let { active }: Props = $props();

	const CHECK = 'rounded border-line-strong bg-surface text-[var(--ref-target)] checked:bg-[var(--ref-target)] indeterminate:bg-[var(--ref-target)]';

	let searchInput: HTMLInputElement | undefined = $state();

	/** Values with at least one result in this profile, the rest of the catalogue stays one click away */
	const withData = $derived(new Set(current.built.measurements.map((m) => m.analyte)));
	const listed = $derived(settings.showEmpty ? current.analytes : current.analytes.filter((a) => withData.has(a.id)));

	const allIds = $derived(current.analytes.map((a) => a.id));
	const selected = $derived(new Set(settings.selection ?? allIds));

	const counts = $derived(Map.groupBy(current.built.measurements, (m) => m.analyte));

	const profilePresets = $derived.by((): Preset[] => {
		const fixed = presets.filter((p) => !p.therapy || p.therapy === current.therapy);
		const long = [...counts].filter(([, list]) => new Set(list.map((m) => m.drawId)).size >= 5).map(([id]) => id);
		const dynamic: Preset[] = long.length
			? [{ id: 'long', label: { en: t.sidebar.longSeries, de: t.sidebar.longSeries }, description: { en: t.sidebar.longSeriesDesc, de: t.sidebar.longSeriesDesc }, analytes: long }]
			: [];
		return [...fixed, ...dynamic].filter((p) => p.analytes.some((id) => withData.has(id)));
	});

	function matches(a: Analyte): boolean {
		const q = settings.search.trim().toLowerCase();
		if (!q) return true;
		const hay = [a.id, a.name.en, a.name.de, ...(a.aliases ?? [])].join(' ').toLowerCase();
		return q.split(/\s+/).every((w) => hay.includes(w));
	}

	const byGroup = $derived(
		groups.map((g) => ({ g, items: listed.filter((a) => a.group === g.id && matches(a)) })).filter((row) => row.items.length)
	);

	function setSelection(ids: string[] | null, preset: string | null = null) {
		settings.selection = ids && ids.length === allIds.length ? null : ids;
		settings.preset = preset;
	}

	function toggleOne(id: string) {
		setSelection(toggle([...selected], id));
	}

	function toggleGroup(id: GroupId) {
		const ids = listed.filter((a) => a.group === id).map((a) => a.id);
		const allOn = ids.every((i) => selected.has(i));
		const base = [...selected].filter((i) => !ids.includes(i));
		setSelection(allOn ? base : [...base, ...ids]);
	}

	function latest(a: Analyte) {
		const last = filtered.byAnalyte.get(a.id)?.at(-1);
		if (!last) return 'none';
		return statusOf(last, boundsFor(a, last, settings.basis));
	}

	function onkeydown(e: KeyboardEvent) {
		const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement;
		if (e.key === '/' && !typing) {
			e.preventDefault();
			searchInput?.focus();
		}
	}
</script>

<svelte:window {onkeydown} />

<nav class="flex h-full flex-col text-sm" aria-label={t.sidebar.groups}>
	<div class="space-y-2 border-b border-line p-3">
		<div class="relative">
			<input
				bind:this={searchInput}
				bind:value={settings.search}
				type="search"
				aria-label={t.sidebar.search}
				placeholder={t.sidebar.searchHint}
				class="h-8 w-full rounded-md border-line bg-surface pr-8 pl-2.5 text-xs placeholder:text-ink-3"
			/>
			<kbd class="pointer-events-none absolute top-1.5 right-2 rounded border border-line px-1 text-[10px] text-ink-3">/</kbd>
		</div>

		<div class="flex flex-wrap gap-1">
			<button
				type="button"
				onclick={() => setSelection(null)}
				class={['rounded-md px-2 py-1 text-xs font-medium', !settings.selection ? 'bg-ink text-surface' : 'bg-surface-2 text-ink-2 hover:text-ink']}>{t.common.all}</button
			>
			{#each profilePresets as p (p.id)}
				<button
					type="button"
					title={tx(p.description)}
					onclick={() => setSelection(p.analytes, p.id)}
					class={['rounded-md px-2 py-1 text-xs font-medium', settings.preset === p.id ? 'bg-ink text-surface' : 'bg-surface-2 text-ink-2 hover:text-ink']}
					>{tx(p.label)}</button
				>
			{/each}
		</div>
	</div>

	<div class="min-h-0 flex-1 overflow-y-auto px-1.5 py-2">
		{#each byGroup as { g, items } (g.id)}
			{const on = $derived(items.filter((a) => selected.has(a.id)).length)}
			{const collapsed = $derived(settings.collapsed.includes(g.id) && !settings.search)}
			<section class="mb-1">
				<div class="group flex items-center gap-1.5 rounded px-1.5 py-1 hover:bg-hover">
					<input
						type="checkbox"
						checked={on === items.length}
						indeterminate={on > 0 && on < items.length}
						onchange={() => toggleGroup(g.id)}
						aria-label={t.sidebar.selectGroup(tx(g.label))}
						class={CHECK}
					/>
					<button type="button" class="flex min-w-0 flex-1 items-baseline gap-1.5 text-left" onclick={() => (settings.collapsed = toggle(settings.collapsed, g.id))} aria-expanded={!collapsed}>
						<span class="truncate text-xs font-semibold text-ink">{tx(g.label)}</span>
						<span class="num ml-auto text-[11px] text-ink-3">{on}/{items.length}</span>
					</button>
				</div>
				{#if !collapsed}
					<ul transition:slide>
						{#each items as a (a.id)}
							{const n = $derived(filtered.byAnalyte.get(a.id)?.length ?? 0)}
							{const s = $derived(latest(a))}
							{const alt = $derived(altNameOf(a))}
							<li class={['group flex items-center gap-1.5 rounded py-0.5 pr-1 pl-5', active === a.id ? 'bg-surface-3' : 'hover:bg-hover']}>
								<input type="checkbox" checked={selected.has(a.id)} onchange={() => toggleOne(a.id)} aria-label={t.sidebar.showOne(nameOf(a))} class="size-3.5 {CHECK}" />
								<a href={resolve('/analyte/[id]', { id: a.id })} class={['min-w-0 flex-1 truncate text-xs', n ? 'text-ink' : 'text-ink-3']} title={alt ? `${nameOf(a)} · ${alt}` : nameOf(a)}>
									{nameOf(a)}{#if a.derived}<span class="text-ink-3"> ◇</span>{/if}
								</a>
								{#if s === 'high' || s === 'low'}
									<span class="text-[10px]" style:color="var(--{s})" title={t.status[s]}>{s === 'high' ? '▲' : '▼'}</span>
								{/if}
								<button type="button" onclick={() => setSelection([a.id])} class="hidden text-[10px] text-ink-3 group-hover:inline hover:text-ink" title={t.sidebar.onlyTitle}>{t.sidebar.only}</button>
								<button
									type="button"
									onclick={() => (settings.pinned = toggle(settings.pinned, a.id))}
									class={['text-[11px]', settings.pinned.includes(a.id) ? 'text-ink' : 'hidden text-ink-3 group-hover:inline hover:text-ink']}
									title={settings.pinned.includes(a.id) ? t.sidebar.unpin : t.sidebar.pin}>{settings.pinned.includes(a.id) ? '★' : '☆'}</button
								>
								<span class="num w-4 text-right text-[10.5px] text-ink-3">{n}</span>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{:else}
			<p class="px-3 py-6 text-center text-xs text-ink-3">{t.sidebar.nothing}</p>
		{/each}
	</div>

	<div class="space-y-1.5 border-t border-line px-3 py-2 text-[11px] text-ink-3">
		<label class="flex items-center gap-1.5 text-ink-2">
			<input type="checkbox" bind:checked={settings.showEmpty} class={CHECK} />
			{t.sidebar.showEmpty}
		</label>

		<!-- Filters for the overview, a single value has nothing to filter -->
		{#if !active}
			<div class="space-y-1.5 border-t border-line pt-1.5 text-ink-2">
				<label class="flex items-center gap-1.5" title={t.sidebar.onlyOutTitle}>
					<input type="checkbox" bind:checked={settings.onlyOut} class={CHECK} />
					{t.sidebar.onlyOut}
				</label>
				<label class="flex items-center justify-between gap-1.5">
					{t.sidebar.minPoints}
					<select bind:value={settings.minPoints} class="h-6 rounded border-line bg-surface py-0 pr-6 pl-1.5 text-[11px]">
						{#each [1, 2, 3, 5] as n (n)}<option value={n}>{n}</option>{/each}
					</select>
				</label>
			</div>
		{/if}

		<div class="flex items-center justify-between">
			<span class="num">{t.sidebar.shown(filtered.visible.length, listed.length)}</span>
			<button type="button" onclick={() => setSelection([])} class="hover:text-ink">{t.sidebar.selectNone}</button>
		</div>
	</div>
</nav>
