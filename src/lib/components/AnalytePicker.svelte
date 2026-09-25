<script lang="ts">
	import { tick } from 'svelte';
	import { groupById, groups } from '../data';
	import type { Analyte, Therapy } from '../data/types';
	import { altNameOf, nameOf, t, tx } from '../i18n';
	import { normName } from '../io';
	import { current } from '../profiles.svelte';

	interface Props {
		/** Selected analyte id, or null */
		value: string | null;
		/** Name of a value the user wants to create */
		custom?: string;
		exclude?: string[];
		invalid?: boolean;
		onpick: (id: string | null, custom?: string) => void;
	}

	let { value, custom, exclude = [], invalid = false, onpick }: Props = $props();

	const uid = $props.id();
	let query = $state('');
	let open = $state(false);
	let active = $state(0);
	let list: HTMLUListElement | undefined = $state();
	let up = $state(false);
	let height = $state(384);

	const selected = $derived(value ? current.lookup(value) : undefined);
	const shown = $derived(selected ? nameOf(selected) : (custom ?? ''));

	/** Common values per therapy, they fill the suggestions while the profile has little history */
	const COMMON: Record<Therapy, string[]> = {
		feminizing: ['estradiol', 'testosterone', 'prolactin', 'lh', 'shbg', 'hemoglobin', 'creatinine', 'alt', 'potassium', 'cholesterol'],
		masculinizing: ['testosterone', 'estradiol', 'hematocrit', 'hemoglobin', 'shbg', 'lh', 'alt', 'cholesterol', 'ldl', 'hdl'],
		none: ['hemoglobin', 'leukocytes', 'creatinine', 'alt', 'ggt', 'cholesterol', 'ldl', 'glucose', 'tsh', 'ferritin']
	};

	/** Pickable, excluding computed series nobody types in and values already in the draw */
	const available = $derived(
		current.analytes.filter(
			(a) => (!a.derived || ['non-hdl', 'ldl-hdl', 'fai', 'tsat', 'free-t-calc', 'homa-ir'].includes(a.id)) && (!exclude.includes(a.id) || a.id === value)
		)
	);

	/** What this profile measures most often, topped up with the common values */
	const suggested = $derived.by(() => {
		const measured = [...Map.groupBy(current.built.measurements.filter((m) => !m.derived), (m) => m.analyte)]
			.sort((a, b) => b[1].length - a[1].length)
			.map(([id]) => id);
		const ids = [...measured, ...COMMON[current.therapy]].filter((id, i, all) => all.indexOf(id) === i);
		return ids
			.map((id) => available.find((a) => a.id === id))
			.filter((a) => a !== undefined)
			.slice(0, 10);
	});

	function score(a: Analyte, q: string): number {
		const names = [a.name.en, a.name.de, a.id, ...(a.aliases ?? [])].map(normName);
		if (names.some((n) => n === q)) return 0;
		if (names.some((n) => n.startsWith(q))) return 1;
		if (names.some((n) => n.includes(q))) return 2;
		return 9;
	}

	/** Search results while typing, otherwise the suggestions followed by the whole catalogue */
	const sections = $derived.by(() => {
		const q = normName(query);
		if (q) {
			const hits = available
				.map((a) => ({ a, s: score(a, q) }))
				.filter((x) => x.s < 9)
				.sort((x, y) => x.s - y.s)
				.map((x) => x.a);
			return hits.length ? [{ label: '', items: hits }] : [];
		}
		const all = groups.map((g) => ({ label: tx(g.label), items: available.filter((a) => a.group === g.id) })).filter((s) => s.items.length);
		return [{ label: t.manual.suggested, items: suggested }, { label: t.manual.allValues, items: [] }, ...all].filter((s, i) => i === 1 || s.items.length);
	});

	const results = $derived(sections.flatMap((s) => s.items));
	const offsets = $derived(sections.map((_, k) => sections.slice(0, k).reduce((n, s) => n + s.items.length, 0)));

	const offerCustom = $derived(query.trim().length > 1 && !results.some((a) => score(a, normName(query)) === 0));
	const options = $derived(results.length + (offerCustom ? 1 : 0));

	function pick(i: number) {
		if (i < results.length) onpick(results[i].id);
		else if (offerCustom) onpick(null, query.trim());
		open = false;
		query = '';
	}

	async function move(to: number) {
		active = Math.max(0, Math.min(options - 1, to));
		await tick();
		list?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
	}

	// Open upwards when the list would run off the bottom of the screen, never taller than the room it has
	function place(input: HTMLInputElement) {
		const box = input.getBoundingClientRect();
		const below = innerHeight - box.bottom;
		up = below < 320 && box.top > below;
		height = Math.min(384, Math.max(160, (up ? box.top : below) - 16));
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') move(active + 1);
		else if (e.key === 'ArrowUp') move(active - 1);
		else if (e.key === 'Enter' && open && options) pick(active);
		else if (e.key === 'Escape') open = false;
		else return;
		e.preventDefault();
	}
</script>

<div class="relative min-w-0">
	<input
		value={open ? query : shown}
		oninput={(e) => {
			query = e.currentTarget.value;
			open = true;
			active = 0;
			if (list) list.scrollTop = 0;
		}}
		onfocus={(e) => {
			place(e.currentTarget);
			query = '';
			active = 0;
			open = true;
		}}
		onblur={() => setTimeout(() => (open = false), 150)}
		{onkeydown}
		role="combobox"
		aria-expanded={open}
		aria-controls="{uid}-list"
		aria-activedescendant={open && options ? `${uid}-${active}` : undefined}
		aria-autocomplete="list"
		aria-invalid={invalid}
		aria-label={t.manual.analyte}
		placeholder={t.manual.pick}
		class={['h-8 w-full rounded-md bg-surface px-2 text-sm', invalid ? 'border-[var(--critical)]' : 'border-line']}
		autocomplete="off"
	/>
	{#if open && options}
		<ul
			bind:this={list}
			id="{uid}-list"
			role="listbox"
			aria-label={t.manual.analyte}
			style:max-height="{height}px"
			class={['absolute left-0 z-40 w-full min-w-80 overflow-y-auto rounded-md border border-line bg-surface pb-1 text-sm shadow-[var(--shadow)]', up ? 'bottom-full mb-1' : 'top-full mt-1']}
		>
			{#each sections as s, k (s.label)}
				{#if s.label && s.items.length}
					<li role="presentation" class="label sticky top-0 z-10 border-b border-line bg-surface-2 px-2.5 py-1">{s.label}</li>
				{:else if s.label}
					<li role="presentation" class="mt-1 border-t border-line-strong px-2.5 pt-2.5 pb-1 text-xs font-semibold text-ink">{s.label}</li>
				{/if}
				{#each s.items as a, j (a.id)}
					{const i = $derived(offsets[k] + j)}
					{const alt = $derived(altNameOf(a))}
					<li id="{uid}-{i}" role="option" aria-selected={i === active}>
						<button
							type="button"
							tabindex="-1"
							onmousedown={(e) => e.preventDefault()}
							onclick={() => pick(i)}
							onmouseenter={() => (active = i)}
							class={['block w-full px-2.5 py-1 text-left', i === active ? 'bg-hover' : '']}
						>
							<span class="block truncate font-medium text-ink">{nameOf(a)}{#if alt}<span class="ml-1.5 font-normal text-ink-3">{alt}</span>{/if}</span>
							<span class="block text-[11px] text-ink-3">{a.unit}{!s.label || k === 0 ? ` · ${tx(groupById.get(a.group)?.label)}` : ''}</span>
						</button>
					</li>
				{/each}
			{/each}
			{#if offerCustom}
				<li id="{uid}-{results.length}" role="option" aria-selected={active === results.length}>
					<button
						type="button"
						tabindex="-1"
						onmousedown={(e) => e.preventDefault()}
						onclick={() => pick(results.length)}
						onmouseenter={() => (active = results.length)}
						class={['w-full border-t border-line px-2.5 py-1.5 text-left text-xs text-ink-2', active === results.length ? 'bg-hover' : '']}
					>
						{t.manual.customNew(query.trim())}
					</button>
				</li>
			{/if}
		</ul>
	{/if}
</div>
