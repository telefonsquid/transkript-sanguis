<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '../i18n';

	/** Compact cards for pages that already hold results */
	let { compact = false }: { compact?: boolean } = $props();

	const choices = $derived([
		{ href: resolve('/data/manual'), icon: '⌨', title: t.ingest.manualTitle, body: compact ? t.ingest.manualShort : t.ingest.manualBody },
		{ href: resolve('/data/agent'), icon: '✦', title: t.ingest.agentTitle, body: compact ? t.ingest.agentShort : t.ingest.agentBody },
		{ href: resolve('/data/import'), icon: '⇪', title: t.ingest.importTitle, body: compact ? t.ingest.importShort : t.ingest.importBody }
	]);
</script>

<div class={['grid sm:grid-cols-3', compact ? 'gap-2' : 'gap-3']}>
	{#each choices as c (c.href)}
		<a
			href={c.href}
			class={[
				'rounded-lg border border-line bg-surface text-left hover:border-line-strong hover:bg-hover',
				compact ? 'flex items-start gap-3 p-3' : 'flex flex-col gap-1.5 p-4'
			]}
		>
			<span class={compact ? 'flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-3 text-base' : 'text-xl'} aria-hidden="true">{c.icon}</span>
			<span class="grid min-w-0 gap-0.5">
				<span class="text-sm font-semibold text-ink">{c.title}</span>
				<span class="text-xs text-ink-2">{c.body}</span>
			</span>
		</a>
	{/each}
</div>
