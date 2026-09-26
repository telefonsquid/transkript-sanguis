<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ImportPreview from '#lib/components/ImportPreview.svelte';
	import JsonInput from '#lib/components/JsonInput.svelte';
	import { TINT } from '#lib/components/TherapyName.svelte';
	import type { Profile } from '#lib/data/types.js';
	import { deleteProfileFiles } from '#lib/files.js';
	import { t } from '#lib/i18n/index.js';
	import { restoreFiles, toPreview, type ExportFile, type Identified, type PreviewDraw } from '#lib/io.js';
	import { addProfile, current, db, newId, normalizeProfile, profileById } from '#lib/profiles.svelte.js';

	let backup: ExportFile | null = $state(null);
	let replace: Record<string, boolean> = $state({});
	let preview: PreviewDraw[] = $state([]);
	let notes: string[] = $state([]);
	let busy = $state(false);

	function onresult(result: Identified) {
		backup = null;
		preview = [];
		if (result.kind === 'export') {
			backup = result.file;
			replace = Object.fromEntries(result.file.profiles.map((p) => [p.id, false]));
		} else if (result.kind === 'draws') {
			preview = toPreview(result.file, current.profile, current.lookup);
			notes = result.file.notes ?? [];
		}
	}

	async function importBackup() {
		if (!backup || busy) return;
		busy = true;
		const ids: Record<string, string> = {};

		for (const raw of backup.profiles) {
			const exists = !!profileById(raw.id);
			let id = raw.id;
			if (exists && replace[raw.id]) {
				db.profiles = db.profiles.filter((p) => p.id !== raw.id);
				await deleteProfileFiles(raw.id).catch(() => undefined);
			} else if (exists) {
				id = newId('profile');
			}
			ids[raw.id] = id;

			// Report links only survive when the backup actually carries the PDF
			const carried = new Set((backup.files ?? []).filter((f) => f.profile === raw.id).map((f) => f.report));
			const reports = (raw.reports ?? []).map((r) => (carried.has(r.id) ? r : { ...r, file: undefined }));
			addProfile(normalizeProfile({ ...raw, id, reports } as Profile));
		}
		if (backup.files?.length) await restoreFiles(backup.files, ids);

		db.active = ids[backup.profiles[0]?.id] ?? db.active;
		busy = false;
		goto(resolve('/'));
	}
</script>

<svelte:head><title>{t.ingest.importTitle} · {t.app.name}</title></svelte:head>

<div class="mx-auto max-w-5xl space-y-4 p-6">
	<header>
		<a href={resolve('/data')} class="text-xs text-ink-3 hover:text-ink">← {t.data.title}</a>
		<h1 class="text-2xl font-semibold tracking-tight">{t.ingest.importTitle}</h1>
		<p class="mt-1 max-w-3xl text-sm text-ink-2">{t.ingest.importBody}</p>
	</header>

	{#if preview.length}
		<ImportPreview bind:draws={preview} {notes} ondone={() => goto(resolve('/'))} />
	{:else if backup}
		<section class="space-y-3 rounded-lg border border-line bg-surface p-4">
			<h2 class="text-sm font-semibold">{t.io.found(backup.profiles.length, backup.profiles.reduce((n, p) => n + (p.draws?.length ?? 0), 0))}</h2>
			<ul class="divide-y divide-line text-sm">
				{#each backup.profiles as p (p.id)}
					<li class="flex flex-wrap items-center gap-3 py-2">
						<span class="font-medium">{p.name}</span>
						<span class="text-xs text-ink-3">{#if p.therapy && p.therapy !== 'none'}<span class={TINT[p.therapy]}>{t.profile.therapyShort[p.therapy] ?? ''}</span> ·&nbsp;{/if}{t.profile.draws(p.draws?.length ?? 0)}</span>
						{#if profileById(p.id)}
							<select bind:value={replace[p.id]} class="ml-auto h-8 rounded-md border-line bg-surface py-0 pr-7 pl-2 text-xs">
								<option value={false}>{t.io.existsKeep}</option>
								<option value={true}>{t.io.existsReplace}</option>
							</select>
						{/if}
					</li>
				{/each}
			</ul>
			<button type="button" onclick={importBackup} disabled={busy} class="rounded-md bg-ink px-4 py-2 text-sm font-medium text-surface hover:opacity-90 disabled:opacity-50">{t.io.importNow}</button>
		</section>
	{:else}
		<JsonInput paste={false} {onresult} />
	{/if}
</div>
