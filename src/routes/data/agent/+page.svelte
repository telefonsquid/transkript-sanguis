<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { agentInstructions, importSchema } from '#lib/agent.js';
	import { SLUG } from '#lib/app.js';
	import ImportPreview from '#lib/components/ImportPreview.svelte';
	import JsonInput from '#lib/components/JsonInput.svelte';
	import { t } from '#lib/i18n/index.js';
	import { download, toPreview, type Identified, type PreviewDraw } from '#lib/io.js';
	import { current } from '#lib/profiles.svelte.js';

	let copied = $state(false);
	let preview: PreviewDraw[] = $state([]);
	let notes: string[] = $state([]);
	let isBackup = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(agentInstructions());
		} catch {
			alert(t.agent.copyFailed);
			return;
		}
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function onresult(result: Identified) {
		isBackup = result.kind === 'export';
		if (result.kind !== 'draws') return;
		preview = toPreview(result.file, current.profile, current.lookup);
		notes = result.file.notes ?? [];
	}

	const step = 'grid gap-2 rounded-lg border border-line bg-surface p-4';
	const num = 'flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-surface';
</script>

<svelte:head><title>{t.agent.title} · {t.app.name}</title></svelte:head>

<div class="mx-auto max-w-5xl space-y-4 p-6">
	<header>
		<a href={resolve('/data')} class="text-xs text-ink-3 hover:text-ink">← {t.data.title}</a>
		<h1 class="text-2xl font-semibold tracking-tight">{t.agent.title}</h1>
		<p class="mt-1 max-w-3xl text-sm text-ink-2">{t.agent.intro}</p>
	</header>

	<p class="rounded-lg border border-line bg-surface-2 p-3 text-xs text-ink-2">🔒 {t.disclaimer.agentPrivacy}</p>

	{#if !preview.length}
		<section class={step}>
			<h2 class="flex items-center gap-2 text-sm font-semibold"><span class={num}>1</span>{t.agent.step1}</h2>
			<p class="text-sm text-ink-2">{t.agent.step1Body}</p>
			<div class="flex flex-wrap gap-2">
				<button type="button" onclick={copy} class="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-surface hover:opacity-90">{copied ? `✓ ${t.common.copied}` : t.agent.copyPrompt}</button>
				<button type="button" onclick={() => download(`${SLUG}-agent-instructions.md`, agentInstructions(), 'text/markdown')} class="rounded-md border border-line px-3 py-1.5 text-sm hover:bg-hover">{t.agent.downloadPrompt}</button>
				<button type="button" onclick={() => download(`${SLUG}-import-schema.json`, JSON.stringify(importSchema(), null, 2))} class="rounded-md border border-line px-3 py-1.5 text-sm hover:bg-hover">{t.agent.downloadSchema}</button>
			</div>
		</section>

		<section class={step}>
			<h2 class="flex items-center gap-2 text-sm font-semibold"><span class={num}>2</span>{t.agent.step2}</h2>
			<p class="text-sm text-ink-2">{t.agent.step2Body}</p>
		</section>

		<section class={step}>
			<h2 class="flex items-center gap-2 text-sm font-semibold"><span class={num}>3</span>{t.agent.step3}</h2>
			<p class="text-sm text-ink-2">{t.agent.step3Body}</p>
			<JsonInput {onresult} />
			{#if isBackup}
				<p class="text-xs text-ink-2">{t.agent.isBackup} <a href={resolve('/data/import')} class="underline">{t.ingest.importTitle}</a></p>
			{/if}
		</section>
	{:else}
		<section class="space-y-3">
			<div class="flex items-baseline justify-between">
				<div>
					<h2 class="text-base font-semibold">{t.agent.preview}</h2>
					<p class="text-sm text-ink-2">{t.agent.previewIntro}</p>
				</div>
				<button type="button" onclick={() => (preview = [])} class="text-xs text-ink-3 hover:text-ink">← {t.common.back}</button>
			</div>
			<ImportPreview bind:draws={preview} {notes} ondone={() => goto(resolve('/'))} />
		</section>
	{/if}
</div>
