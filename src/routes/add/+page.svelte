<script lang="ts">
	import IngestChoices from '#lib/components/IngestChoices.svelte';
	import { t } from '#lib/i18n/index.js';
	import { current } from '#lib/profiles.svelte.js';
</script>

<svelte:head><title>{t.ingest.title} · {t.app.name}</title></svelte:head>

<div class="mx-auto max-w-3xl space-y-4 p-6">
	<header>
		<h1 class="text-2xl font-semibold tracking-tight">{t.ingest.title}</h1>
		<p class="mt-1 text-sm text-ink-2">{t.ingest.intro}</p>
		{#if current.profile}<p class="mt-1 text-xs text-ink-3">{t.profile.title}: <strong class="text-ink-2">{current.profile.name}</strong></p>{/if}
	</header>
	<IngestChoices />
</div>
