<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ProfileForm from '#lib/components/ProfileForm.svelte';
	import type { Profile } from '#lib/data/types.js';
	import { t } from '#lib/i18n/index.js';
	import { createProfile, db, deleteProfile, loadDemos, setActive } from '#lib/profiles.svelte.js';

	let editing: string | null = $state(null);
	let renaming: string | null = $state(null);
	let adding = $state(false);

	function update(p: Profile, values: { name: string; therapy: Profile['therapy']; sex?: Profile['sex']; birth?: string; height?: number }) {
		Object.assign(p, { name: values.name, therapy: values.therapy, sex: values.sex, birth: values.birth, height: values.height });
		editing = null;
	}

	function rename(p: Profile, e: SubmitEvent) {
		e.preventDefault();
		const name = new FormData(e.currentTarget as HTMLFormElement).get('name')?.toString().trim();
		if (name) p.name = name;
		renaming = null;
	}

	async function remove(p: Profile) {
		if (!confirm(t.profile.deleteBody(p.name))) return;
		await deleteProfile(p.id);
		if (!db.profiles.length) goto(resolve('/welcome'));
	}

	const button = 'rounded-md border border-line px-2.5 py-1 hover:bg-hover';
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
					goto(resolve('/data'));
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
							{#if renaming === p.id}
								<form onsubmit={(e) => rename(p, e)} class="flex items-center gap-2">
									<!-- svelte-ignore a11y_autofocus -->
									<input
										name="name"
										value={p.name}
										maxlength="60"
										aria-label={t.profile.name}
										autofocus
										onkeydown={(e) => e.key === 'Escape' && (renaming = null)}
										class="h-8 w-56 rounded-md border-line bg-surface px-2 text-sm font-semibold"
									/>
									<button type="submit" class="{button} text-xs">{t.common.save}</button>
									<button type="button" onclick={() => (renaming = null)} class="{button} text-xs">{t.common.cancel}</button>
								</form>
							{:else}
								<span class="text-base font-semibold">{p.name}</span>
							{/if}
							<div class="text-xs text-ink-3">
								{t.profile.therapies[p.therapy]} · {t.profile.draws(p.draws.length)}{p.birth ? ` · ${p.birth}` : ''}{p.height ? ` · ${p.height} cm` : ''}
							</div>
						</div>
						<div class="ml-auto flex flex-wrap gap-2 text-xs">
							{#if p.id !== db.active}
								<button type="button" onclick={() => setActive(p.id)} class={button}>{t.profile.switch}</button>
							{/if}
							{#if renaming !== p.id}
								<button type="button" onclick={() => (renaming = p.id)} class={button}>{t.profile.rename}</button>
							{/if}
							<button type="button" onclick={() => (editing = p.id)} class={button}>{t.common.edit}</button>
							<button type="button" onclick={() => remove(p)} class="{button} text-[var(--critical)]">{t.common.delete}</button>
						</div>
					</div>
				{/if}
			</li>
		{/each}
	</ul>

	<section class="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-line-strong p-4 text-xs">
		<p class="min-w-0 flex-1 text-ink-2">{t.profile.loadDemosHint}</p>
		<button type="button" onclick={() => loadDemos(false)} class={button}>{t.profile.loadDemos}</button>
	</section>
</div>
