<script lang="ts">
	import { resolve } from '$app/paths';
	import { fmtDate } from '../../analysis';
	import { SLUG } from '../../app';
	import type { Profile } from '../../data/types';
	import { t } from '../../i18n';
	import { buildExport, download } from '../../io';
	import { db } from '../../profiles.svelte';

	let { profile }: { profile: Profile } = $props();

	let withPdfs = $state(false);
	let exporting = $state(false);

	// Demo profiles ship with the app and need no backup
	const own = $derived(db.profiles.filter((p) => !p.demo));

	async function exportProfiles(list: Profile[], name: string) {
		if (exporting) return;
		exporting = true;
		try {
			const file = await buildExport($state.snapshot(list), withPdfs);
			const stamp = new Date().toISOString().slice(0, 10);
			const slug = name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');
			if (await download(`${SLUG}-${slug || 'profile'}-${stamp}.json`, JSON.stringify(file, null, 1))) db.lastExport = new Date().toISOString();
		} finally {
			exporting = false;
		}
	}

	const secondary = 'rounded-md border border-line-strong px-3 py-1.5 text-xs font-medium hover:bg-hover disabled:opacity-50';
</script>

<section class="rounded-xl border border-line bg-surface p-4" aria-labelledby="backup-title">
	<h2 id="backup-title" class="text-sm font-semibold">{t.io.title}</h2>
	<p class="mt-1 text-xs text-ink-3">{t.io.exportBody}</p>

	<p class="mt-3 flex items-center gap-2 text-xs font-medium">
		{#if db.lastExport}
			<span class="text-ink-2">{t.io.lastExport(fmtDate(Date.parse(db.lastExport)))}</span>
		{:else}
			<span style:color="var(--serious)" aria-hidden="true">⚠</span><span class="text-ink">{t.io.neverExported}</span>
		{/if}
	</p>

	<label class="mt-3 flex items-start gap-2 text-xs text-ink-2">
		<input type="checkbox" bind:checked={withPdfs} class="mt-0.5 rounded" />
		<span>{t.io.includePdfs} <span class="text-ink-3">· {t.io.includePdfsHint}</span></span>
	</label>

	<div class="mt-3 flex flex-wrap gap-2">
		<button type="button" disabled={exporting} onclick={() => exportProfiles([profile], profile.name)} class="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-surface hover:opacity-90 disabled:opacity-50">
			{t.io.exportCurrent}
		</button>
		{#if own.length > (profile.demo ? 0 : 1)}
			<button type="button" disabled={exporting} onclick={() => exportProfiles(own, 'backup')} class={secondary}>{t.io.exportAll}</button>
		{/if}
	</div>

	<div class="mt-4 border-t border-line pt-4">
		<h3 class="text-xs font-semibold">{t.io.importTitle}</h3>
		<p class="mt-1 text-xs text-ink-3">{t.io.importShort}</p>
		<a href={resolve('/data/import')} class="{secondary} mt-2 inline-block">{t.io.chooseFile}</a>
	</div>
</section>
