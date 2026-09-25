<script lang="ts">
	import { groupById } from '../data';
	import type { Analyte } from '../data/types';
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
	let input: HTMLInputElement | undefined = $state();

	const selected = $derived(value ? current.lookup(value) : undefined);
	const shown = $derived(selected ? nameOf(selected) : (custom ?? ''));

	/** Searchable, excluding computed series nobody types in */
	const pool = $derived(current.analytes.filter((a) => !a.derived || ['non-hdl', 'ldl-hdl', 'fai', 'tsat', 'free-t-calc', 'homa-ir'].includes(a.id)));

	function score(a: Analyte, q: string): number {
		const names = [a.name.en, a.name.de, a.id, ...(a.aliases ?? [])].map(normName);
		if (names.some((n) => n === q)) return 0;
		if (names.some((n) => n.startsWith(q))) return 1;
		if (names.some((n) => n.includes(q))) return 2;
		return 9;
	}

	const results = $derived.by(() => {
		const q = normName(query);
		const list = pool.filter((a) => !exclude.includes(a.id) || a.id === value);
		if (!q) return list.slice(0, 12);
		return list
			.map((a) => ({ a, s: score(a, q) }))
			.filter((x) => x.s < 9)
			.sort((x, y) => x.s - y.s)
			.slice(0, 12)
			.map((x) => x.a);
	});

	const offerCustom = $derived(query.trim().length > 1 && !results.some((a) => score(a, normName(query)) === 0));
	const options = $derived(results.length + (offerCustom ? 1 : 0));

	function pick(i: number) {
		if (i < results.length) onpick(results[i].id);
		else if (offerCustom) onpick(null, query.trim());
		open = false;
		query = '';
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') active = Math.min(options - 1, active + 1);
		else if (e.key === 'ArrowUp') active = Math.max(0, active - 1);
		else if (e.key === 'Enter' && open && options) pick(active);
		else if (e.key === 'Escape') open = false;
		else return;
		e.preventDefault();
	}
</script>

<div class="relative min-w-0">
	<input
		bind:this={input}
		value={open ? query : shown}
		oninput={(e) => {
			query = e.currentTarget.value;
			open = true;
			active = 0;
		}}
		onfocus={() => {
			query = '';
			open = true;
		}}
		onblur={() => setTimeout(() => (open = false), 150)}
		{onkeydown}
		role="combobox"
		aria-expanded={open}
		aria-controls="{uid}-list"
		aria-autocomplete="list"
		aria-invalid={invalid}
		aria-label={t.manual.analyte}
		placeholder={t.manual.pick}
		class={['h-8 w-full rounded-md bg-surface px-2 text-sm', invalid ? 'border-[var(--critical)]' : 'border-line']}
		autocomplete="off"
	/>
	{#if open && options}
		<ul id="{uid}-list" role="listbox" class="absolute top-full left-0 z-40 mt-1 max-h-80 w-full min-w-80 overflow-y-auto rounded-md border border-line bg-surface py-1 text-sm shadow-[var(--shadow)]">
			{#each results as a, i (a.id)}
				{const alt = altNameOf(a)}
				<li role="option" aria-selected={i === active}>
					<button
						type="button"
						onmousedown={(e) => e.preventDefault()}
						onclick={() => pick(i)}
						onmouseenter={() => (active = i)}
						class={['block w-full px-2.5 py-1 text-left', i === active ? 'bg-hover' : '']}
					>
						<span class="block truncate font-medium text-ink">{nameOf(a)}{#if alt}<span class="ml-1.5 font-normal text-ink-3">{alt}</span>{/if}</span>
						<span class="block text-[11px] text-ink-3">{a.unit} · {tx(groupById.get(a.group)?.label)}</span>
					</button>
				</li>
			{/each}
			{#if offerCustom}
				<li role="option" aria-selected={active === results.length}>
					<button
						type="button"
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
