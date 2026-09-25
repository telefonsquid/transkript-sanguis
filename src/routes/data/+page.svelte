<script lang="ts">
	import { resolve } from '$app/paths';
	import { fmtIso } from '#lib/analysis.js';
	import IngestChoices from '#lib/components/IngestChoices.svelte';
	import BackupCard from '#lib/components/mydata/BackupCard.svelte';
	import ChecksCard from '#lib/components/mydata/ChecksCard.svelte';
	import DrawList from '#lib/components/mydata/DrawList.svelte';
	import PhaseTimeline from '#lib/components/mydata/PhaseTimeline.svelte';
	import ProfileCard from '#lib/components/mydata/ProfileCard.svelte';
	import { runChecks } from '#lib/checks.js';
	import { nameOf, t } from '#lib/i18n/index.js';
	import { current } from '#lib/profiles.svelte.js';

	const profile = $derived(current.profile);
	const issues = $derived(current.built.issues);
	const checks = $derived(runChecks(profile, current.built.measurements));
</script>

<svelte:head><title>{t.data.title} · {t.app.name}</title></svelte:head>

{#if profile}
	<!-- Open editors close when the profile changes -->
	{#key profile.id}
		<div class="mx-auto max-w-6xl space-y-6 p-4 text-sm sm:p-6">
			<ProfileCard {profile} />

			<div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div class="min-w-0 space-y-6">
					<section aria-labelledby="add-title">
						<h2 id="add-title" class="mb-2 text-base font-semibold">{t.ingest.title}</h2>
						{#if !profile.draws.length}<p class="mb-3 text-xs text-ink-2">{t.ingest.intro}</p>{/if}
						<IngestChoices compact={profile.draws.length > 0} />
					</section>

					{#if issues.length}
						<section id="issues" class="rounded-xl border border-[color-mix(in_srgb,var(--critical)_40%,transparent)] bg-[color-mix(in_srgb,var(--critical)_5%,var(--surface))] p-4" aria-labelledby="issues-title">
							<h2 id="issues-title" class="flex items-center gap-2 text-sm font-semibold">
								<span style:color="var(--critical)" aria-hidden="true">⚠</span>{t.data.issuesCount(issues.length)}
							</h2>
							<p class="mt-1 text-xs text-ink-2">{t.data.issuesIntro}</p>
							<ul class="mt-2 divide-y divide-line text-xs">
								{#each issues as i, n (n)}
									{const a = $derived(current.lookup(i.analyte))}
									<li class="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-1.5">
										<span class="num text-ink-3">{fmtIso(i.date)}</span>
										<span class="font-medium">{a ? nameOf(a) : i.analyte}</span>
										<span class="num text-ink-2">"{i.value}"{i.detail ? ` ${i.detail}` : ''}</span>
										<span class="text-[var(--critical)]">{t.data.issueKind[i.kind]}</span>
										<a href="{resolve('/data/manual')}?draw={i.drawId}" class="ml-auto font-medium underline decoration-line-strong underline-offset-2 hover:text-ink">{t.data.editDraw}</a>
									</li>
								{/each}
							</ul>
						</section>
					{/if}

					{#if profile.draws.length}
						<section aria-labelledby="draws-title">
							<h2 id="draws-title" class="mb-2 text-base font-semibold">{t.data.draws}</h2>
							<DrawList {profile} />
						</section>
					{/if}
				</div>

				<aside class="space-y-6">
					<PhaseTimeline {profile} />
					<ChecksCard {checks} />
					<BackupCard {profile} />
				</aside>
			</div>
		</div>
	{/key}
{/if}
