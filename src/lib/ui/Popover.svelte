<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		title?: string;
		align?: 'left' | 'right';
		badge?: string | number;
		/** Close as soon as a button or link inside is used, for menus */
		menu?: boolean;
		/** Strong for main navigation, quiet for small utilities */
		variant?: 'default' | 'strong' | 'quiet';
		/** Shown before the label */
		icon?: Snippet;
		/** Hides the label on phones when the icon says enough, screen readers still get it */
		compactLabel?: boolean;
		children: Snippet;
	}

	let { label, title, align = 'left', badge, menu = false, variant = 'default', icon, compactLabel = false, children }: Props = $props();

	let open = $state(false);
	let root: HTMLDivElement | undefined = $state();

	function onwindowclick(e: MouseEvent) {
		if (open && root && !root.contains(e.target as Node)) open = false;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}

	const looks = {
		default: ['px-2 py-1 text-xs font-medium', 'border-line-strong bg-surface-3 text-ink', 'border-line bg-surface text-ink-2 hover:bg-hover hover:text-ink'],
		strong: ['px-2 py-1 text-[13px] font-semibold', 'border-line-strong bg-surface-3 text-ink', 'border-line-strong bg-surface text-ink hover:bg-hover'],
		quiet: ['px-2 py-1 text-xs font-medium', 'border-transparent bg-surface-3 text-ink', 'border-transparent text-ink-2 hover:bg-hover hover:text-ink']
	};
	const look = $derived(looks[variant]);
</script>

<svelte:window onclick={onwindowclick} {onkeydown} />

<div class="relative min-w-0" bind:this={root}>
	<button
		type="button"
		{title}
		aria-expanded={open}
		onclick={() => (open = !open)}
		class={['inline-flex max-w-full items-center gap-1.5 rounded-md border transition-colors', look[0], open ? look[1] : look[2]]}
	>
		{@render icon?.()}
		<span class={['truncate', compactLabel && 'max-sm:sr-only']}>{label}</span>
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
				align === 'right' ? 'right-0' : 'left-0'
			]}
			onclick={(e) => menu && (e.target as HTMLElement).closest('button, a') && (open = false)}
		>
			{@render children()}
		</div>
	{/if}
</div>
