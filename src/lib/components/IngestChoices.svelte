<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '../i18n';

	const card = 'flex flex-col gap-1.5 rounded-lg border border-line bg-surface p-4 text-left hover:border-line-strong hover:bg-hover';
</script>

<div class="grid gap-3 sm:grid-cols-3">
	<a href={resolve('/data/manual')} class={card}>
		<span class="text-xl" aria-hidden="true">⌨</span>
		<span class="text-sm font-semibold text-ink">{t.ingest.manualTitle}</span>
		<span class="text-xs text-ink-2">{t.ingest.manualBody}</span>
	</a>
	<a href={resolve('/data/agent')} class={card}>
		<span class="text-xl" aria-hidden="true">✦</span>
		<span class="text-sm font-semibold text-ink">{t.ingest.agentTitle}</span>
		<span class="text-xs text-ink-2">{t.ingest.agentBody}</span>
	</a>
	<a href={resolve('/data/import')} class={card}>
		<span class="text-xl" aria-hidden="true">⇪</span>
		<span class="text-sm font-semibold text-ink">{t.ingest.importTitle}</span>
		<span class="text-xs text-ink-2">{t.ingest.importBody}</span>
	</a>
</div>
