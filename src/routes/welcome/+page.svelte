<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import IngestChoices from '#lib/components/IngestChoices.svelte';
	import ProfileForm from '#lib/components/ProfileForm.svelte';
	import { t } from '#lib/i18n/index.js';
	import { createProfile, current, db, setActive } from '#lib/profiles.svelte.js';

	let medicalOk = $state(false);
	let creating = $state(false);

	const step = $derived(!db.consent ? (medicalOk ? 'local' : 'medical') : !current.profile ? (creating ? 'profile' : 'choose') : 'ingest');

	// The feminizing demo shows the most of what the app does
	function demo() {
		setActive('demo-fem');
		goto(resolve('/'));
	}
</script>

<div class="mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-6 p-6">
	{#if step === 'medical'}
		{@render disclaimer(1, 'var(--warning)', warn, t.disclaimer.medicalTitle, t.disclaimer.medicalPoints, () => (medicalOk = true))}
	{:else if step === 'local'}
		{@render disclaimer(2, 'var(--ref-target)', lock, t.disclaimer.localTitle, t.disclaimer.localPoints, () => (db.consent = new Date().toISOString()))}
	{:else if step === 'choose'}
		<header>
			<h1 class="text-3xl font-bold tracking-tight">{t.welcome.title}</h1>
			<p class="mt-2 max-w-2xl text-ink-2">{t.welcome.intro}</p>
		</header>
		<section class="space-y-3" aria-label={t.welcome.choose}>
			<h2 class="label">{t.welcome.choose}</h2>
			<div class="grid gap-3 sm:grid-cols-2">
				{@render choice(t.welcome.demoTitle, t.welcome.demoBody, demo)}
				{@render choice(t.welcome.createTitle, t.welcome.createBody, () => (creating = true))}
			</div>
		</section>
	{:else if step === 'profile'}
		<section class="space-y-4 rounded-xl border border-line bg-surface p-6">
			<button type="button" onclick={() => (creating = false)} class="text-xs text-ink-3 hover:text-ink">← {t.common.back}</button>
			<h1 class="text-2xl font-semibold tracking-tight">{t.welcome.stepProfile}</h1>
			<ProfileForm submitLabel={t.profile.create} onsave={(values) => createProfile(values)} />
		</section>
	{:else}
		<section class="space-y-4">
			<h1 class="text-2xl font-semibold tracking-tight">{t.welcome.stepIngest}</h1>
			<IngestChoices />
			<a href={resolve('/')} class="inline-block text-sm text-ink-2 underline decoration-line-strong underline-offset-2 hover:text-ink">{t.welcome.later}</a>
		</section>
	{/if}
</div>

{#snippet disclaimer(n: number, accent: string, icon: Snippet, title: string, points: string[], onaccept: () => void)}
	<section
		class="rounded-2xl border-2 p-7 sm:p-10"
		style:border-color={accent}
		style:background="color-mix(in srgb, {accent} 8%, var(--surface))"
		aria-labelledby="disclaimer-title"
	>
		<div class="flex items-center justify-between">
			<span class="flex size-14 items-center justify-center rounded-full text-ink" style:background="color-mix(in srgb, {accent} 28%, var(--surface))">
				{@render icon()}
			</span>
			<span class="num text-xs font-medium text-ink-3">{t.welcome.step(n, 2)}</span>
		</div>
		<h1 id="disclaimer-title" class="mt-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h1>
		<ul class="mt-5 space-y-3 text-base text-ink">
			{#each points as point (point)}
				<li class="flex gap-3">
					<span class="mt-2 size-2 shrink-0 rounded-full" style:background={accent}></span>
					{point}
				</li>
			{/each}
		</ul>
		<button type="button" onclick={onaccept} class="mt-8 w-full rounded-lg bg-ink px-6 py-3 text-base font-semibold text-surface hover:opacity-90 sm:w-auto">
			{t.disclaimer.accept}
		</button>
	</section>
{/snippet}

{#snippet choice(title: string, body: string, onclick: () => void)}
	<button type="button" {onclick} class="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5 text-left hover:border-line-strong hover:bg-hover">
		<span class="text-lg font-semibold text-ink">{title} →</span>
		<span class="text-sm text-ink-2">{body}</span>
	</button>
{/snippet}

{#snippet warn()}
	<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
		<path d="M12 9.5v4.5M12 17.2v.1" />
	</svg>
{/snippet}

{#snippet lock()}
	<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<rect x="4.5" y="10.5" width="15" height="10" rx="2" />
		<path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
	</svg>
{/snippet}
