<script lang="ts" module>
	export const DROP = 'M5 0C6.3 2.7 10 5.3 10 8.5A5 5 0 0 1 0 8.5C0 5.3 3.7 2.7 5 0Z';
</script>

<script lang="ts">
	import { t } from '#lib/i18n/index.js';

	let { flagged = false, glint = false, class: klass = '' }: { flagged?: boolean; glint?: boolean; class?: string } = $props();

	// The last "i" loses its dot to a blood drop
	const name = $derived(t.app.name);
	const at = $derived(name.lastIndexOf('i'));
	const head = $derived(at < 0 ? name : name.slice(0, at));
	const tail = $derived(at < 0 ? '' : name.slice(at + 1));

	// Flag stripes as a highlight inside the drop, only drawn where it is big enough to read
	const STRIPES = ['#5bcefa', '#f5a9b8', '#ffffff', '#f5a9b8', '#5bcefa'];
	function arc(r: number) {
		const p = (deg: number) => `${(5 + r * Math.cos((deg * Math.PI) / 180)).toFixed(2)} ${(8.5 + r * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`;
		return `M${p(200)}A${r} ${r} 0 0 1 ${p(246)}`;
	}
</script>

<span class={['logo', flagged && 'flag-name', klass]}>
	<span class="sr-only">{name}</span>
	<span aria-hidden="true"
		>{#if flagged}<span class="trans-flag">{#each [...head.slice(0, 5)] as letter, i (i)}<span>{letter}</span>{/each}</span>{head.slice(5)}{:else}{head}{/if}{#if at >= 0}<span class="tittle"
				>ı<svg viewBox="0 0 10 13.5"
					><path d={DROP} />{#if glint}{#each STRIPES as stroke, i (i)}<path d={arc(3.75 - i * 0.19)} {stroke} class="glint" />{/each}{/if}</svg
				></span
			>{/if}{tail}</span
	>
</span>
