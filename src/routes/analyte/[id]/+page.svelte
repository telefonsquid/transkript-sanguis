<script lang="ts">
	import { resolve } from '$app/paths';
	import Focus from '#lib/components/Focus.svelte';
	import { nameOf, t } from '#lib/i18n/index.js';
	import { lookup } from '#lib/profiles.svelte.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const analyte = $derived(lookup(data.id));
</script>

<svelte:head>
	<title>{analyte ? nameOf(analyte) : data.id} · {t.app.name}</title>
</svelte:head>

{#if analyte}
	{#key data.id}
		<Focus id={data.id} />
	{/key}
{:else}
	<div class="p-10 text-center text-sm text-ink-2">
		<p class="mb-3">{t.focus.notFound}</p>
		<a href={resolve('/')} class="underline">{t.focus.back}</a>
	</div>
{/if}
