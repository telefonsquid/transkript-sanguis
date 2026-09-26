<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, pop } from '../motion.svelte';

	interface Props {
		label: string;
		title?: string;
		align?: 'left' | 'right';
		badge?: string | number;
		/** Close as soon as a button or link inside is used, for menus */
		menu?: boolean;
		/** Quiet for small utilities, joined for the right half of a button group */
		variant?: 'default' | 'quiet' | 'joined';
		/** Shown before the label */
		icon?: Snippet;
		/** Shown after the label, stays visible on phones */
		trail?: Snippet;
		/** Hides the label on phones when the icon says enough, screen readers still get it */
		compactLabel?: boolean;
		children: Snippet;
	}

	let { label, title, align = 'left', badge, menu = false, variant = 'default', icon, trail, compactLabel = false, children }: Props = $props();

	let open = $state(false);
	let root: HTMLDivElement | undefined = $state();

	function onwindowclick(e: MouseEvent) {
		if (open && root && !root.contains(e.target as Node)) open = false;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}

	// Shape, then open and closed colours
	const looks = {
		default: ['h-7 rounded-md border px-2 text-xs font-medium', 'border-line-strong bg-surface-3 text-ink', 'border-line bg-surface text-ink-2 hover:bg-hover hover:text-ink'],
		quiet: ['h-8 rounded-md px-2 text-xs font-medium', 'bg-surface-3 text-ink', 'text-ink-2 hover:bg-hover hover:text-ink'],
		joined: ['h-full rounded-r-[5px] px-2.5 text-[13px] font-semibold', 'bg-surface-3 text-ink', 'text-ink hover:bg-hover']
	};
	const look = $derived(looks[variant]);
</script>

<svelte:window onclick={onwindowclick} {onkeydown} />

<div class={['relative min-w-0', variant === 'joined' && 'h-full']} bind:this={root}>
	<button
		type="button"
		{title}
		aria-expanded={open}
		onclick={() => (open = !open)}
		class={['inline-flex max-w-full items-center gap-1.5 transition-colors', look[0], open ? look[1] : look[2]]}
	>
		{@render icon?.()}
		<span class={['truncate', compactLabel && 'max-sm:sr-only']}>{label}</span>
		{@render trail?.()}
		{#if badge !== undefined && badge !== 0}<span class="num rounded bg-ink px-1 text-[10px] text-surface">{badge}</span>{/if}
		<svg width="10" height="10" viewBox="0 0 10 10" class={['shrink-0 transition-transform', open && 'rotate-180']} aria-hidden="true">
			<path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.4" />
		</svg>
	</button>
	{#if open}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div
			class={[
				'absolute top-full z-40 mt-1.5 min-w-64 rounded-lg border border-line bg-surface p-3 shadow-[var(--shadow)]',
				align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
			]}
			onclick={(e) => menu && (e.target as HTMLElement).closest('button, a') && (open = false)}
			in:pop
			out:fade={{ duration: 90 }}
		>
			{@render children()}
		</div>
	{/if}
</div>
