<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import IngestChoices from '#lib/components/IngestChoices.svelte';
	import ProfileForm from '#lib/components/ProfileForm.svelte';
	import TherapyName from '#lib/components/TherapyName.svelte';
	import { fmtIso } from '#lib/analysis.js';
	import type { Profile } from '#lib/data/types.js';
	import { t } from '#lib/i18n/index.js';
	import { fly, slide } from '#lib/motion.svelte.js';
	import { createProfile, db, lists, setActive } from '#lib/profiles.svelte.js';
	import Avatar from '#lib/ui/Avatar.svelte';
	import Logo from '#lib/ui/Logo.svelte';

	type Step = 'home' | 'medical' | 'local' | 'demo' | 'profile' | 'ingest';

	let step = $state<Step>('home');
	let about = $state(false);
	let next: () => void = () => {};

	// The own profile used last leads, the others follow in a line
	const mine = $derived(lists.own.find((p) => p.id === db.active) ?? lists.own[0]);
	const others = $derived(lists.own.filter((p) => p !== mine));

	// Both disclaimers come first, but only once a choice is made
	function start(then: () => void) {
		if (db.consent) return then();
		next = then;
		step = 'medical';
	}

	function consent() {
		db.consent = new Date().toISOString();
		next();
	}

	function open(p: Profile, path: '/' | '/data' = '/') {
		setActive(p.id);
		goto(resolve(path));
	}

	function summary(p: Profile) {
		const values = p.draws.reduce((n, d) => n + d.results.length, 0);
		if (!p.draws.length) return t.welcome.empty;
		return t.nav.summary(p.draws.length, values, `${fmtIso(p.draws[0].date)} – ${fmtIso(p.draws.at(-1)!.date)}`);
	}

	const quiet =
		'inline-flex h-9 items-center justify-center rounded-lg border border-line bg-surface px-3.5 text-sm font-medium text-ink-2 transition-colors hover:border-line-strong hover:bg-hover hover:text-ink';
</script>

<div class="mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-10 px-4 py-16 sm:px-6">
	{#if step === 'home'}
		<header class="flex flex-col items-center text-center" in:fly={{ y: 16 }}>
			<h1><Logo glint flourish class="block text-[min(3.5rem,10.5vw)] sm:text-7xl" /></h1>
			<button type="button" onclick={() => (about = !about)} aria-expanded={about} class="mt-8 inline-flex items-center gap-1 text-xs font-medium text-ink-3 hover:text-ink">
				{t.welcome.about}<span class={['inline-block transition-transform duration-200', about && 'rotate-180']} aria-hidden="true">▾</span>
			</button>
			{#if about}
				<p class="mt-2 max-w-md text-sm text-balance text-ink-2" transition:slide>{t.welcome.aboutText}</p>
			{/if}
		</header>

		<section class="mx-auto flex w-full max-w-md flex-col items-center gap-3" in:fly={{ y: 16, delay: 80 }}>
			{#if mine}
				<button
					type="button"
					onclick={() => start(() => open(mine))}
					class="group flex w-full items-center gap-4 rounded-xl border border-line-strong bg-surface p-4 text-left shadow-[var(--shadow)] transition-[border-color,background-color] duration-200 hover:bg-hover"
				>
					<Avatar profile={mine} size={44} />
					<span class="min-w-0 flex-1">
						<span class="block truncate text-lg font-semibold">{mine.name}</span>
						<span class="block truncate text-xs text-ink-2">
							{#if mine.therapy !== 'none'}<TherapyName therapy={mine.therapy} /> ·&nbsp;{/if}<span class="num">{summary(mine)}</span>
						</span>
					</span>
					<span class="shrink-0 text-sm font-semibold">{t.welcome.open} <span class="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span></span>
				</button>
				{#if others.length}
					<div class="flex flex-wrap justify-center gap-2">
						{#each others as p (p.id)}
							<button type="button" onclick={() => start(() => open(p))} class="inline-flex items-center gap-2 rounded-full border border-line py-1 pr-3 pl-1 text-xs text-ink-2 hover:bg-hover hover:text-ink">
								<Avatar profile={p} size={20} />{p.name}
							</button>
						{/each}
					</div>
				{/if}
				<div class="mt-2 flex flex-wrap justify-center gap-2">
					<button type="button" onclick={() => start(() => open(mine, '/data'))} class={quiet}>{t.welcome.manage}</button>
					<button type="button" onclick={() => start(() => (step = 'demo'))} class={quiet}>{t.welcome.demo}</button>
					<button type="button" onclick={() => start(() => (step = 'profile'))} class={quiet}>{t.profile.new}</button>
				</div>
			{:else}
				<div class="grid w-full grid-cols-2 gap-3">
					<button type="button" onclick={() => start(() => (step = 'demo'))} class={[quiet, 'h-11 text-base']}>{t.welcome.demo}</button>
					<button type="button" onclick={() => start(() => (step = 'profile'))} class="h-11 rounded-lg bg-ink px-4 text-base font-semibold text-surface transition-opacity hover:opacity-90">
						{t.welcome.create}
					</button>
				</div>
			{/if}
		</section>
	{:else if step === 'medical'}
		{@render disclaimer(1, 'var(--warning)', warn, t.disclaimer.medicalTitle, t.disclaimer.medicalPoints, () => (step = 'local'))}
	{:else if step === 'local'}
		{@render disclaimer(2, 'var(--ref-target)', lock, t.disclaimer.localTitle, t.disclaimer.localPoints, consent)}
	{:else if step === 'demo'}
		<section class="space-y-4" in:fly={{ y: 16 }}>
			{@render back()}
			<h1 class="text-2xl font-semibold tracking-tight">{t.welcome.pickDemo}</h1>
			<ul class="grid gap-3 sm:grid-cols-2">
				{#each lists.demos as p, i (p.id)}
					<li class="rise" style:--i={i}>
						<button
							type="button"
							onclick={() => open(p)}
							class="group flex w-full items-center gap-4 rounded-xl border border-line bg-surface p-4 text-left transition-[border-color,background-color] duration-200 hover:border-line-strong hover:bg-hover"
						>
							<Avatar profile={p} size={40} />
							<span class="min-w-0 flex-1">
								<span class="block text-base font-semibold">{p.name} <span class="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span></span>
								<span class="block text-xs text-ink-2">
									{#if p.therapy === 'none'}{t.welcome.cis[p.sex ?? 'female']} ·&nbsp;{:else}<TherapyName therapy={p.therapy} />{/if}{t.welcome.demoSpan(p.draws.length, p.draws[0]?.date.slice(0, 4) ?? '')}
								</span>
							</span>
						</button>
					</li>
				{/each}
			</ul>
		</section>
	{:else if step === 'profile'}
		<section class="space-y-4 rounded-xl border border-line bg-surface p-6" in:fly={{ y: 16 }}>
			{@render back()}
			<h1 class="text-2xl font-semibold tracking-tight">{t.welcome.stepProfile}</h1>
			<ProfileForm
				submitLabel={t.profile.create}
				onsave={(values) => {
					createProfile(values);
					step = 'ingest';
				}}
			/>
		</section>
	{:else}
		<section class="space-y-4" in:fly={{ y: 16 }}>
			<h1 class="text-2xl font-semibold tracking-tight">{t.welcome.stepIngest}</h1>
			<IngestChoices />
			<a href={resolve('/')} class="inline-block text-sm text-ink-2 underline decoration-line-strong underline-offset-2 hover:text-ink">{t.welcome.later}</a>
		</section>
	{/if}
</div>

{#snippet back()}
	<button type="button" onclick={() => (step = 'home')} class="text-xs text-ink-3 hover:text-ink">← {t.common.back}</button>
{/snippet}

{#snippet disclaimer(n: number, accent: string, icon: Snippet, title: string, points: string[], onaccept: () => void)}
	<div class="space-y-4">
		{@render back()}
		<section
			class="rounded-2xl border-2 p-7 sm:p-10"
			style:border-color={accent}
			style:background="color-mix(in srgb, {accent} 8%, var(--surface))"
			aria-labelledby="disclaimer-title"
			in:fly={{ x: n === 1 ? 0 : 40, y: n === 1 ? 16 : 0, duration: 420 }}
		>
			<div class="flex items-center justify-between">
				<span class="flex size-14 items-center justify-center rounded-full text-ink" style:background="color-mix(in srgb, {accent} 28%, var(--surface))">
					{@render icon()}
				</span>
				<span class="num text-xs font-medium text-ink-3">{t.welcome.step(n, 2)}</span>
			</div>
			<h1 id="disclaimer-title" class="mt-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h1>
			<ul class="mt-5 space-y-3 text-base text-ink">
				{#each points as point, i (point)}
					<li class="rise flex gap-3" style:--i={i + 2}>
						<span class="mt-2 size-2 shrink-0 rounded-full" style:background={accent}></span>
						{point}
					</li>
				{/each}
			</ul>
			<button type="button" onclick={onaccept} class="mt-8 w-full rounded-lg bg-ink px-6 py-3 text-base font-semibold text-surface hover:opacity-90 sm:w-auto">
				{t.disclaimer.accept}
			</button>
		</section>
	</div>
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
