<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		title?: string;
		align?: 'left' | 'right';
		badge?: string | number;
		/** Close as soon as a button or link inside is used, for menus */
		menu?: boolean;
		children: Snippet;
	}

	let { label, title, align = 'left', badge, menu = false, children }: Props = $props();

	let open = $state(false);
	let root: HTMLDivElement | undefined = $state();

	function onwindowclick(e: MouseEvent) {
		if (open && root && !root.contains(e.target as Node)) open = false;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window onclick={onwindowclick} {onkeydown} />

<div class="relative" bind:this={root}>
	<button
		type="button"
		{title}
		aria-expanded={open}
		onclick={() => (open = !open)}
		class={[
			'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors',
			open ? 'border-line-strong bg-surface-3 text-ink' : 'border-line bg-surface text-ink-2 hover:bg-hover hover:text-ink'
		]}
	>
		{label}
		{#if badge !== undefined && badge !== 0}<span class="num rounded bg-ink px-1 text-[10px] text-surface">{badge}</span>{/if}
		<svg width="10" height="10" viewBox="0 0 10 10" class={['transition-transform', open && 'rotate-180']} aria-hidden="true">
			<path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.4" />
		</svg>
	</button>
	{#if open}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div
			class={[
				'absolute top-full z-40 mt-1.5 min-w-64 rounded-lg border border-line bg-surface p-3 shadow-[var(--shadow)]',
				align === 'right' ? 'right-0' : 'left-0'
			]}
			onclick={(e) => menu && (e.target as HTMLElement).closest('button, a') && (open = false)}
		>
			{@render children()}
		</div>
	{/if}
</div>
