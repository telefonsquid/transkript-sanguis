<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { t } from '../i18n';
	import { loadDemo } from '../profiles.svelte';

	const card = 'flex flex-col gap-1.5 rounded-lg border border-line bg-surface p-4 text-left hover:border-line-strong hover:bg-hover';

	function demo(kind: 'feminizing' | 'masculinizing') {
		loadDemo(kind);
		goto(resolve('/'));
	}
</script>

<div class="grid gap-3 sm:grid-cols-2">
	<a href={resolve('/add/manual')} class={card}>
		<span class="text-xl" aria-hidden="true">⌨</span>
		<span class="text-sm font-semibold text-ink">{t.ingest.manualTitle}</span>
		<span class="text-xs text-ink-2">{t.ingest.manualBody}</span>
	</a>
	<a href={resolve('/add/agent')} class={card}>
		<span class="text-xl" aria-hidden="true">✦</span>
		<span class="text-sm font-semibold text-ink">{t.ingest.agentTitle}</span>
		<span class="text-xs text-ink-2">{t.ingest.agentBody}</span>
	</a>
	<a href={resolve('/add/import')} class={card}>
		<span class="text-xl" aria-hidden="true">⇪</span>
		<span class="text-sm font-semibold text-ink">{t.ingest.importTitle}</span>
		<span class="text-xs text-ink-2">{t.ingest.importBody}</span>
	</a>
	<div class={['cursor-default', card]}>
		<span class="text-xl" aria-hidden="true">◌</span>
		<span class="text-sm font-semibold text-ink">{t.ingest.demoTitle}</span>
		<span class="text-xs text-ink-2">{t.ingest.demoBody}</span>
		<span class="mt-1 flex flex-wrap gap-2">
			<button type="button" onclick={() => demo('feminizing')} class="rounded-md border border-line bg-surface px-2 py-1 text-xs font-medium hover:bg-surface-3">{t.welcome.demoFem}</button>
			<button type="button" onclick={() => demo('masculinizing')} class="rounded-md border border-line bg-surface px-2 py-1 text-xs font-medium hover:bg-surface-3">{t.welcome.demoMasc}</button>
		</span>
	</div>
</div>
