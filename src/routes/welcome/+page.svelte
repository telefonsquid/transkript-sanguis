<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import IngestChoices from '#lib/components/IngestChoices.svelte';
	import ProfileForm from '#lib/components/ProfileForm.svelte';
	import { t } from '#lib/i18n/index.js';
	import { createProfile, db, loadDemo } from '#lib/profiles.svelte.js';

	let local = $state(false);
	let medical = $state(false);
	let tried = $state(false);

	const step = $derived(!db.consent ? 1 : !db.profiles.length ? 2 : 3);

	function accept() {
		tried = true;
		if (local && medical) db.consent = new Date().toISOString();
	}

	function demo(kind: 'feminizing' | 'masculinizing') {
		if (!db.consent) db.consent = new Date().toISOString();
		loadDemo(kind);
		goto(resolve('/'));
	}
</script>

<svelte:head><title>{t.welcome.title} · {t.app.name}</title></svelte:head>

<div class="mx-auto max-w-3xl space-y-6 p-6">
	<header>
		<p class="label mb-1">{t.welcome.step(step, 3)}</p>
		<h1 class="text-2xl font-semibold tracking-tight">{t.welcome.title}</h1>
		<p class="mt-2 max-w-2xl text-sm text-ink-2">{t.welcome.intro}</p>
	</header>

	{#if step === 1}
		<section class="space-y-3">
			<h2 class="text-base font-semibold">{t.welcome.stepDisclaimers}</h2>
			{@render disclaimer('🔒', t.disclaimer.localTitle, t.disclaimer.localBody)}
			<label class="flex items-center gap-2 pl-1 text-sm">
				<input type="checkbox" bind:checked={local} class="rounded border-line-strong" />
				{t.disclaimer.accept}
			</label>
			{@render disclaimer('⚕', t.disclaimer.medicalTitle, t.disclaimer.medicalBody)}
			<label class="flex items-center gap-2 pl-1 text-sm">
				<input type="checkbox" bind:checked={medical} class="rounded border-line-strong" />
				{t.disclaimer.accept}
			</label>
			<div class="flex items-center gap-3 pt-2">
				<button type="button" onclick={accept} class="rounded-md bg-ink px-4 py-2 text-sm font-medium text-surface hover:opacity-90 disabled:opacity-40">
					{t.welcome.continue}
				</button>
				{#if tried && !(local && medical)}<span class="text-xs text-[var(--critical)]">{t.welcome.acceptBoth}</span>{/if}
			</div>
		</section>
	{:else if step === 2}
		<section class="space-y-4 rounded-lg border border-line bg-surface p-5">
			<h2 class="text-base font-semibold">{t.welcome.stepProfile}</h2>
			<ProfileForm submitLabel={t.profile.create} onsave={(values) => createProfile(values)} />
		</section>
	{:else}
		<section class="space-y-4">
			<h2 class="text-base font-semibold">{t.welcome.stepIngest}</h2>
			<IngestChoices />
			<a href={resolve('/')} class="inline-block text-sm text-ink-2 underline decoration-line-strong underline-offset-2 hover:text-ink">{t.welcome.later}</a>
		</section>
	{/if}

	{#if step < 3}
		<section class="rounded-lg border border-dashed border-line-strong p-4 text-sm">
			<h2 class="font-medium">{t.welcome.demoTitle}</h2>
			<p class="mt-1 text-ink-2">{t.welcome.demoBody}</p>
			<div class="mt-3 flex flex-wrap gap-2">
				<button type="button" disabled={step === 1 && !(local && medical)} onclick={() => demo('feminizing')} class="rounded-md border border-line px-3 py-1.5 text-xs font-medium hover:bg-hover disabled:opacity-40">{t.welcome.demoFem}</button>
				<button type="button" disabled={step === 1 && !(local && medical)} onclick={() => demo('masculinizing')} class="rounded-md border border-line px-3 py-1.5 text-xs font-medium hover:bg-hover disabled:opacity-40">{t.welcome.demoMasc}</button>
			</div>
			{#if step === 1}<p class="mt-2 text-xs text-ink-3">{t.welcome.acceptBoth}</p>{/if}
		</section>
	{/if}
</div>

{#snippet disclaimer(icon: string, title: string, body: string)}
	<div class="flex gap-3 rounded-lg border border-line bg-surface p-4">
		<span class="text-xl leading-none" aria-hidden="true">{icon}</span>
		<div>
			<h3 class="text-sm font-semibold">{title}</h3>
			<p class="mt-1 text-sm text-ink-2">{body}</p>
		</div>
	</div>
{/snippet}
