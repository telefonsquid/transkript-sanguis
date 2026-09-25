<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ProfileForm from '#lib/components/ProfileForm.svelte';
	import type { Profile } from '#lib/data/types.js';
	import { t } from '#lib/i18n/index.js';
	import { createProfile, db, deleteProfile, setActive } from '#lib/profiles.svelte.js';

	let editing: string | null = $state(null);
	let adding = $state(false);

	function update(p: Profile, values: { name: string; therapy: Profile['therapy']; sex?: Profile['sex']; birth?: string; height?: number }) {
		Object.assign(p, { name: values.name, therapy: values.therapy, sex: values.sex, birth: values.birth, height: values.height });
		editing = null;
	}

	async function remove(p: Profile) {
		if (!confirm(t.profile.deleteBody(p.name))) return;
		await deleteProfile(p.id);
		if (!db.profiles.length) goto(resolve('/welcome'));
	}
</script>

<svelte:head><title>{t.nav.profiles} · {t.app.name}</title></svelte:head>

<div class="mx-auto max-w-3xl space-y-4 p-6">
	<header class="flex items-baseline justify-between">
		<h1 class="text-2xl font-semibold tracking-tight">{t.nav.profiles}</h1>
		{#if !adding}
			<button type="button" onclick={() => (adding = true)} class="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-surface hover:opacity-90">+ {t.profile.new}</button>
		{/if}
	</header>

	{#if adding}
		<section class="rounded-lg border border-line bg-surface p-5">
			<h2 class="mb-4 text-base font-semibold">{t.profile.new}</h2>
			<ProfileForm
				submitLabel={t.profile.create}
				onsave={(values) => {
					createProfile(values);
					adding = false;
					goto(resolve('/add'));
				}}
				oncancel={() => (adding = false)}
			/>
		</section>
	{/if}

	<ul class="space-y-3">
		{#each db.profiles as p (p.id)}
			<li class={['rounded-lg border bg-surface p-4', p.id === db.active ? 'border-ink' : 'border-line']}>
				{#if editing === p.id}
					<ProfileForm
						editing
						initial={{ name: p.name, therapy: p.therapy, sex: p.sex, birth: p.birth, height: p.height }}
						submitLabel={t.profile.save}
						onsave={(values) => update(p, values)}
						oncancel={() => (editing = null)}
					/>
				{:else}
					<div class="flex flex-wrap items-center gap-3">
						<div class="min-w-0">
							<div class="flex items-center gap-2">
								<span class="text-base font-semibold">{p.name}</span>
								{#if p.demo}<span class="rounded bg-surface-3 px-1.5 text-[11px] text-ink-2">{t.profile.demo}</span>{/if}
							</div>
							<div class="text-xs text-ink-3">
								{t.profile.therapies[p.therapy]} · {t.profile.draws(p.draws.length)}{p.birth ? ` · ${p.birth}` : ''}{p.height ? ` · ${p.height} cm` : ''}
							</div>
						</div>
						<div class="ml-auto flex gap-2 text-xs">
							{#if p.id !== db.active}
								<button type="button" onclick={() => setActive(p.id)} class="rounded-md border border-line px-2.5 py-1 hover:bg-hover">{t.profile.switch}</button>
							{/if}
							<button type="button" onclick={() => (editing = p.id)} class="rounded-md border border-line px-2.5 py-1 hover:bg-hover">{t.common.edit}</button>
							<button type="button" onclick={() => remove(p)} class="rounded-md border border-line px-2.5 py-1 text-[var(--critical)] hover:bg-hover">{t.common.delete}</button>
						</div>
					</div>
				{/if}
			</li>
		{/each}
	</ul>
</div>
