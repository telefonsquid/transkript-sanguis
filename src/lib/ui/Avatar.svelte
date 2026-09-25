<script lang="ts">
	import type { Profile } from '../data/types';

	let { profile, size = 20 }: { profile: Pick<Profile, 'name' | 'demo'>; size?: number } = $props();

	// First letter after a leading tag like [DEMO]
	const initial = $derived(profile.name.replace(/^\[[^\]]*\]\s*/, '').match(/[\p{L}\p{N}]/u)?.[0]?.toUpperCase() ?? '?');
</script>

<span
	aria-hidden="true"
	class={[
		'inline-flex shrink-0 items-center justify-center rounded-full leading-none font-semibold',
		profile.demo ? 'border border-dashed border-ink-3 text-ink-2' : 'bg-ink text-surface'
	]}
	style:width="{size}px"
	style:height="{size}px"
	style:font-size="{Math.round(size * 0.48)}px">{initial}</span
>
