<script lang="ts">
	import type { Profile } from '../data/types';

	let { profile, size = 20 }: { profile: Pick<Profile, 'name' | 'demo' | 'therapy'>; size?: number } = $props();

	const initial = $derived(profile.name.match(/[\p{L}\p{N}]/u)?.[0]?.toUpperCase() ?? '?');

	// Own profiles are filled, demos only outlined, HRT profiles wear the flag pink or blue
	const look = $derived(
		profile.demo
			? { feminizing: 'border-fem-ink text-fem-ink', masculinizing: 'border-masc-ink text-masc-ink', none: 'border-ink-3 text-ink-2' }[profile.therapy]
			: { feminizing: 'bg-fem text-[#1b1b1a]', masculinizing: 'bg-masc text-[#1b1b1a]', none: 'bg-ink text-surface' }[profile.therapy]
	);
</script>

<span
	aria-hidden="true"
	class={['inline-flex shrink-0 items-center justify-center rounded-full leading-none font-semibold', profile.demo && 'border border-dashed', look]}
	style:width="{size}px"
	style:height="{size}px"
	style:font-size="{Math.round(size * 0.48)}px">{initial}</span
>
