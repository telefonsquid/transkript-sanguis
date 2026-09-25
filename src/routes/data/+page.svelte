<script lang="ts">
	import { resolve } from '$app/paths';
	import { fmtDate, fmtIso, fmtNum } from '#lib/analysis.js';
	import { runChecks } from '#lib/checks.js';
	import { toTime } from '#lib/data/index.js';
	import type { Draw } from '#lib/data/types.js';
	import { deleteFile, fileKey, openFile, putFile } from '#lib/files.js';
	import { nameOf, t } from '#lib/i18n/index.js';
	import { buildExport, download } from '#lib/io.js';
	import { current, db, deleteDraw, newId } from '#lib/profiles.svelte.js';

	const profile = $derived(current.profile);
	const draws = $derived([...(profile?.draws ?? [])].reverse());
	const counts = $derived(Map.groupBy(current.built.measurements, (m) => m.drawId));
	const issues = $derived(current.built.issues);
	const checks = $derived(runChecks(profile, current.built.measurements));
	const failed = $derived(checks.filter((c) => !c.ok));

	let withPdfs = $state(false);
	let exporting = $state(false);

	const storageKb = $derived(Math.round(JSON.stringify(db).length / 1024));

	async function exportProfiles(all: boolean) {
		if (!profile || exporting) return;
		exporting = true;
		const list = all ? db.profiles : [profile];
		const file = await buildExport($state.snapshot(list), withPdfs);
		const stamp = new Date().toISOString().slice(0, 10);
		download(`laborwerte-${all ? 'backup' : profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${stamp}.json`, JSON.stringify(file, null, 1));
		db.lastExport = new Date().toISOString();
		exporting = false;
	}

	async function attach(draw: Draw, input: HTMLInputElement) {
		const file = input.files?.[0];
		if (!file || !profile) return;
		const id = draw.report ?? newId('report');
		profile.reports = [...profile.reports.filter((r) => r.id !== id), { id, lab: draw.lab, issued: draw.date, file: { name: file.name, type: file.type, size: file.size } }];
		await putFile(fileKey(profile.id, id), file);
		draw.report = id;
		input.value = '';
	}

	async function detach(draw: Draw) {
		if (!profile || !draw.report) return;
		const id = draw.report;
		await deleteFile(fileKey(profile.id, id)).catch(() => undefined);
		profile.reports = profile.reports.map((r) => (r.id === id ? { ...r, file: undefined } : r));
	}

	function removeDraw(draw: Draw) {
		if (profile && confirm(t.common.confirmDelete)) deleteDraw(profile, draw.id);
	}

	function addPhase() {
		profile?.phases.push({ id: newId('phase'), label: '', start: new Date().toISOString().slice(0, 10) });
	}

	function removePhase(id: string) {
		if (profile && confirm(t.common.confirmDelete)) profile.phases = profile.phases.filter((p) => p.id !== id);
	}

	const reportOf = (draw: Draw) => profile?.reports.find((r) => r.id === draw.report);
	const input = 'h-8 w-full rounded-md border-line bg-surface px-2 text-sm';
</script>

<svelte:head><title>{t.data.title} · {t.app.name}</title></svelte:head>

<div class="mx-auto max-w-6xl space-y-8 p-6 text-sm">
	<header class="flex flex-wrap items-baseline justify-between gap-2">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">{t.data.title}</h1>
			{#if profile}<p class="text-xs text-ink-3">{t.profile.title}: <strong class="text-ink-2">{profile.name}</strong> · {t.data.storage(storageKb)}</p>{/if}
		</div>
		<a href={resolve('/add')} class="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-surface hover:opacity-90">+ {t.nav.addData}</a>
	</header>

	<section>
		<h2 class="mb-2 text-base font-semibold">{t.data.draws}</h2>
		{#if !draws.length}
			<p class="text-ink-3">{t.data.noDraws}</p>
		{:else}
			<div class="overflow-x-auto rounded-lg border border-line bg-surface">
				<table class="w-full text-xs">
					<thead class="text-left text-ink-3">
						<tr class="border-b border-line">
							<th class="px-3 py-2 font-medium">{t.data.colDraw}</th>
							<th class="px-2 py-2 font-medium">{t.focus.cols.lab}</th>
							<th class="px-2 py-2 font-medium">{t.data.colValues}</th>
							<th class="px-2 py-2 font-medium">{t.data.colNotes}</th>
							<th class="px-2 py-2 font-medium">{t.data.pdf}</th>
							<th class="px-3 py-2"></th>
						</tr>
					</thead>
					<tbody>
						{#each draws as d (d.id)}
							{const ms = $derived(counts.get(d.id) ?? [])}
							{const computed = $derived(ms.filter((m) => m.derived).length)}
							{const report = $derived(reportOf(d))}
							<tr class="border-b border-line align-top last:border-0 hover:bg-hover">
								<td class="num px-3 py-2 whitespace-nowrap text-ink">{fmtDate(toTime(d.date, d.time))}{d.time ? ` ${d.time}` : ''}</td>
								<td class="px-2 py-2 whitespace-nowrap text-ink-2">{d.lab || '—'}{d.rangesFor ? ` · ${t.profile.sexes[d.rangesFor]}` : ''}</td>
								<td class="px-2 py-2 whitespace-nowrap text-ink-2">{t.data.values(ms.length - computed)}{computed ? ` + ${t.data.computed(computed)}` : ''}</td>
								<td class="max-w-sm px-2 py-2 text-ink-2">{d.notes?.join(' · ') ?? ''}</td>
								<td class="px-2 py-2 whitespace-nowrap">
									{#if report?.file && profile}
										<button type="button" onclick={() => openFile(fileKey(profile.id, report.id))} class="underline decoration-line-strong underline-offset-2 hover:text-ink" title={report.file.name}>{t.data.openPdf}</button>
										<button type="button" onclick={() => detach(d)} class="ml-1 text-ink-3 hover:text-ink" aria-label={t.data.removePdf} title={t.data.removePdf}>×</button>
									{:else}
										<label class="cursor-pointer text-ink-3 underline decoration-line-strong underline-offset-2 hover:text-ink">
											{t.data.attachPdf}
											<input type="file" accept="application/pdf,image/*" class="sr-only" onchange={(e) => attach(d, e.currentTarget)} />
										</label>
									{/if}
								</td>
								<td class="px-3 py-2 text-right whitespace-nowrap">
									<a href="{resolve('/add/manual')}?draw={d.id}" class="rounded-md border border-line px-2 py-0.5 hover:bg-surface-3">{t.data.editDraw}</a>
									<button type="button" onclick={() => removeDraw(d)} class="ml-1 rounded-md border border-line px-2 py-0.5 text-[var(--critical)] hover:bg-surface-3">{t.common.delete}</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>

	{#if issues.length}
		<section>
			<h2 class="text-base font-semibold">{t.data.issues}</h2>
			<p class="mb-2 text-xs text-ink-2">{t.data.issuesIntro}</p>
			<ul class="rounded-lg border border-line bg-surface text-xs">
				{#each issues as i, n (n)}
					{const a = $derived(current.lookup(i.analyte))}
					<li class="flex flex-wrap gap-2 border-b border-line px-3 py-1.5 last:border-0">
						<span class="num text-ink-3">{fmtIso(i.date)}</span>
						<span class="font-medium">{a ? nameOf(a) : i.analyte}</span>
						<span class="num">"{i.value}"{i.detail ? ` ${i.detail}` : ''}</span>
						<span class="text-[var(--critical)]">{t.data.issueKind[i.kind]}</span>
						<a href="{resolve('/add/manual')}?draw={i.drawId}" class="ml-auto underline">{t.data.editDraw}</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section>
		<div class="mb-2 flex items-baseline justify-between">
			<h2 class="text-base font-semibold">{t.data.phases}</h2>
			<button type="button" onclick={addPhase} class="rounded-md border border-line px-2.5 py-1 text-xs hover:bg-hover">+ {t.data.addPhase}</button>
		</div>
		<p class="mb-2 max-w-3xl text-xs text-ink-2">{t.data.phasesIntro}</p>
		{#if profile?.phases.length}
			<ul class="space-y-2">
				{#each [...profile.phases].sort((a, b) => a.start.localeCompare(b.start)) as p (p.id)}
					<li class="grid gap-2 rounded-lg border border-line bg-surface p-3 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1.4fr)_auto]">
						<label class="grid gap-1 text-xs">
							<span class="text-ink-3">{t.data.phaseStart}</span>
							<input type="date" bind:value={p.start} class={input} />
						</label>
						<label class="grid gap-1 text-xs">
							<span class="text-ink-3">{t.data.phaseLabel}</span>
							<input bind:value={p.label} class={input} />
						</label>
						<label class="grid gap-1 text-xs">
							<span class="text-ink-3">{t.data.phaseRegimen}</span>
							<input bind:value={p.regimen} placeholder={t.data.phaseRegimenHint} class={input} />
						</label>
						<div class="flex items-end">
							<button type="button" onclick={() => removePhase(p.id)} class="h-8 rounded-md px-2 text-ink-3 hover:bg-hover hover:text-[var(--critical)]" aria-label={t.data.deletePhase} title={t.data.deletePhase}>×</button>
						</div>
						<div class="flex flex-wrap gap-4 text-xs text-ink-2 sm:col-span-4">
							<label class="flex items-center gap-1.5"><input type="checkbox" bind:checked={p.approx} class="rounded border-line-strong" /> {t.profile.approx}</label>
							<label class="flex items-center gap-1.5"><input type="checkbox" bind:checked={p.afterDraw} class="rounded border-line-strong" /> {t.data.afterDraw}</label>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section>
		<h2 class="text-base font-semibold">{t.data.checks}</h2>
		<p class="mb-2 max-w-3xl text-xs text-ink-2">{t.data.checksIntro}</p>
		{#if !checks.length}
			<p class="text-xs text-ink-3">{t.data.noChecks}</p>
		{:else}
			<p class="mb-2 text-xs {failed.length ? 'text-[var(--serious)]' : 'text-ink-2'}">
				{failed.length ? `⚠ ${failed.length} / ${checks.length} ${t.data.checkOff}` : `✓ ${t.data.allChecksOk(checks.length)}`}
			</p>
			<details class="rounded-lg border border-line bg-surface" open={failed.length > 0}>
				<summary class="cursor-pointer px-3 py-2 text-xs text-ink-2">{t.data.checks} ({checks.length})</summary>
				<table class="num w-full text-xs">
					<thead class="text-left text-ink-3">
						<tr class="border-y border-line">
							<th class="px-3 py-1.5 font-medium">{t.data.colDraw}</th>
							<th class="px-2 py-1.5 font-medium">{t.data.colCheck}</th>
							<th class="px-2 py-1.5 text-right font-medium">{t.data.colPrinted}</th>
							<th class="px-2 py-1.5 text-right font-medium">{t.data.colExpected}</th>
							<th class="px-3 py-1.5 font-medium"></th>
						</tr>
					</thead>
					<tbody>
						{#each [...failed, ...checks.filter((c) => c.ok)] as c, i (i)}
							<tr class="border-b border-line last:border-0">
								<td class="px-3 py-1 whitespace-nowrap">{fmtIso(c.date)}</td>
								<td class="px-2 py-1 whitespace-nowrap">{t.data.checkNames[c.id]}</td>
								<td class="px-2 py-1 text-right">{fmtNum(c.printed, 2)}</td>
								<td class="px-2 py-1 text-right">{fmtNum(c.expected, 2)}</td>
								<td class="px-3 py-1" style:color={c.ok ? 'var(--ink-3)' : 'var(--serious)'}>{c.ok ? `✓ ${t.data.checkOk}` : `⚠ ${t.data.checkOff}`}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</details>
		{/if}
	</section>

	<section class="grid gap-4 md:grid-cols-2">
		<div class="rounded-lg border border-line bg-surface p-4">
			<h2 class="text-base font-semibold">{t.io.exportTitle}</h2>
			<p class="mt-1 text-xs text-ink-2">{t.io.exportBody}</p>
			<label class="mt-3 flex items-center gap-2 text-xs">
				<input type="checkbox" bind:checked={withPdfs} class="rounded border-line-strong" />
				{t.io.includePdfs} <span class="text-ink-3">· {t.io.includePdfsHint}</span>
			</label>
			<div class="mt-3 flex flex-wrap gap-2">
				<button type="button" disabled={exporting} onclick={() => exportProfiles(false)} class="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-surface hover:opacity-90 disabled:opacity-50">{t.io.exportCurrent}</button>
				{#if db.profiles.length > 1}
					<button type="button" disabled={exporting} onclick={() => exportProfiles(true)} class="rounded-md border border-line px-3 py-1.5 text-xs font-medium hover:bg-hover disabled:opacity-50">{t.io.exportAll}</button>
				{/if}
			</div>
			<p class="mt-2 text-[11px] text-ink-3">{db.lastExport ? t.io.lastExport(fmtDate(Date.parse(db.lastExport))) : t.io.neverExported}</p>
		</div>
		<div class="rounded-lg border border-line bg-surface p-4">
			<h2 class="text-base font-semibold">{t.io.importTitle}</h2>
			<p class="mt-1 text-xs text-ink-2">{t.io.importBody}</p>
			<a href={resolve('/add/import')} class="mt-3 inline-block rounded-md border border-line px-3 py-1.5 text-xs font-medium hover:bg-hover">{t.io.chooseFile}</a>
		</div>
	</section>
</div>
