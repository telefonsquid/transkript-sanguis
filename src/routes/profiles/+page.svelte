<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import ProfileForm from '#lib/components/ProfileForm.svelte';
	import TherapyName from '#lib/components/TherapyName.svelte';
	import type { Profile } from '#lib/data/types.js';
	import { t } from '#lib/i18n/index.js';
	import { createProfile, db, deleteProfile, lists, resetDemo, setActive } from '#lib/profiles.svelte.js';
	import Avatar from '#lib/ui/Avatar.svelte';

	const adding = $derived(page.url.searchParams.has('new'));

	function openData(p: Profile) {
		setActive(p.id);
		goto(resolve('/data'));
	}

	async function remove(p: Profile) {
		if (confirm(t.profile.deleteBody(p.name))) await deleteProfile(p.id);
	}

	function reset(p: Profile) {
		if (confirm(t.profile.resetBody(p.name))) resetDemo(p.id);
	}

	const button = 'rounded-md border border-line px-2.5 py-1 hover:bg-hover';
</script>

<svelte:head><title>{t.nav.profiles} · {t.app.name}</title></svelte:head>

<div class="mx-auto max-w-3xl space-y-8 p-6">
	<header class="flex items-baseline justify-between gap-3">
		<h1 class="text-2xl font-semibold tracking-tight">{t.nav.profiles}</h1>
		{#if !adding}
			<a href="{resolve('/profiles')}?new" class="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-surface hover:opacity-90">+ {t.profile.new}</a>
		{/if}
	</header>

	{#if adding}
		<section class="rounded-xl border border-line bg-surface p-5">
			<h2 class="mb-4 text-base font-semibold">{t.profile.new}</h2>
			<ProfileForm
				submitLabel={t.profile.create}
				onsave={(values) => {
					createProfile(values);
					goto(resolve('/data'));
				}}
				oncancel={() => goto(resolve('/profiles'))}
			/>
		</section>
	{/if}

	<section class="space-y-3">
		<h2 class="label">{t.profile.own}</h2>
		{#if lists.own.length}
			<ul class="divide-y divide-line rounded-xl border border-line bg-surface">
				{#each lists.own as p (p.id)}
					{@render row(p)}
				{/each}
			</ul>
		{:else}
			<p class="rounded-xl border border-dashed border-line-strong p-4 text-sm text-ink-3">{t.profile.noOwn}</p>
		{/if}
	</section>

	<section class="space-y-3">
		<div>
			<h2 class="label">{t.profile.demos}</h2>
			<p class="mt-1 text-xs text-ink-3">{t.profile.demosHint}</p>
		</div>
		<ul class="divide-y divide-dashed divide-line-strong rounded-xl border border-dashed border-line-strong">
			{#each lists.demos as p (p.id)}
				{@render row(p)}
			{/each}
		</ul>
	</section>
</div>

{#snippet row(p: Profile)}
	<li class="flex flex-wrap items-center gap-3 px-4 py-3">
		<Avatar profile={p} size={32} />
		<div class="min-w-0 flex-1">
			<div class="truncate font-semibold">{p.name}</div>
			<div class="text-xs text-ink-3"><TherapyName therapy={p.therapy} short />{` · ${t.profile.draws(p.draws.length)}`}</div>
		</div>
		<div class="flex flex-wrap items-center gap-2 text-xs">
			{#if p.id === db.active}
				<span class="px-2.5 py-1 font-medium text-ink-2">✓ {t.profile.active}</span>
			{:else}
				<button type="button" onclick={() => setActive(p.id)} class={button}>{t.profile.switch}</button>
			{/if}
			<button type="button" onclick={() => openData(p)} class={button}>{t.nav.myData}</button>
			{#if p.demo}
				<button type="button" onclick={() => reset(p)} class={button}>{t.common.reset}</button>
			{:else}
				<button type="button" onclick={() => remove(p)} class="{button} text-[var(--critical)]">{t.common.delete}</button>
			{/if}
		</div>
	</li>
{/snippet}
