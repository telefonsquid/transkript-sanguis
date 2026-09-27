<script lang="ts">
	import { fmtIso, fmtMonth } from '../../analysis';
	import { toTime } from '../../data';
	import type { Profile } from '../../data/types';
	import { t } from '../../i18n';
	import { slide } from '../../motion.svelte';
	import { current, deleteProfile, resetDemo, type NewProfile } from '../../profiles.svelte';
	import Avatar from '../../ui/Avatar.svelte';
	import DemoBadge from '../DemoBadge.svelte';
	import ProfileForm from '../ProfileForm.svelte';
	import { TINT } from '../TherapyName.svelte';

	let { profile }: { profile: Profile } = $props();

	let editing = $state(false);

	const measured = $derived(current.built.measurements.filter((m) => !m.derived).length);
	const span = $derived.by(() => {
		const d = profile.draws;
		if (!d.length) return '';
		const [first, last] = [fmtMonth(toTime(d[0].date)), fmtMonth(toTime(d.at(-1)!.date))];
		return first === last ? first : `${first} – ${last}`;
	});
	const storageKb = $derived(Math.round(JSON.stringify(profile).length / 1024));

	const facts = $derived<{ label: string; value?: string | number; hint?: string; tint?: string }[]>([
		...(profile.therapy === 'none' ? [] : [{ label: t.profile.therapy, value: t.profile.therapies[profile.therapy], tint: TINT[profile.therapy] }]),
		{ label: t.profile.sex, value: profile.sex && t.profile.sexes[profile.sex] },
		{ label: t.profile.born, value: profile.birth && (current.age === undefined ? profile.birth : `${profile.birth} · ${t.profile.age(Math.floor(current.age))}`) },
		{ label: t.profile.heightShort, value: profile.height && `${profile.height} cm` },
		...(profile.therapy === 'none' ? [] : [{ label: t.profile.hrtStart, value: current.built.hrtStart && fmtIso(current.built.hrtStart), hint: t.profile.hrtStartWhere }])
	]);

	function save(values: NewProfile) {
		Object.assign(profile, { name: values.name, therapy: values.therapy, sex: values.sex, birth: values.birth, height: values.height });
		editing = false;
	}

	async function remove() {
		if (confirm(t.profile.deleteBody(profile.name))) await deleteProfile(profile.id);
	}

	async function reset() {
		if (!confirm(t.profile.resetBody(profile.name))) return;
		await resetDemo(profile.id);
		editing = false;
	}
</script>

<section id="profile" class="rounded-xl border border-line bg-surface" aria-labelledby="profile-name">
	<div class="flex flex-wrap items-center gap-4 p-5">
		<Avatar {profile} size={52} />
		<div class="min-w-0 flex-1 basis-48">
			<div class="label">{t.data.title}</div>
			<div class="flex min-w-0 items-center gap-2">
				<h1 id="profile-name" class="truncate text-2xl font-semibold tracking-tight">{profile.name}</h1>
				{#if profile.demo}<DemoBadge />{/if}
			</div>
			<p class="num mt-0.5 text-xs text-ink-3">
				{t.profile.draws(profile.draws.length)} · {t.data.values(measured)}{span ? ` · ${span}` : ''} · {t.data.storage(storageKb)}
			</p>
		</div>
		{#if !editing}
			<button type="button" onclick={() => (editing = true)} class="rounded-md border border-line-strong px-3 py-1.5 text-xs font-medium hover:bg-hover">{t.profile.edit}</button>
		{/if}
	</div>

	{#if editing}
		<div class="border-t border-line p-5" transition:slide>
			<ProfileForm
				editing
				initial={{ name: profile.name, therapy: profile.therapy, sex: profile.sex, birth: profile.birth, height: profile.height }}
				submitLabel={t.profile.save}
				onsave={save}
				oncancel={() => (editing = false)}
			/>
			<div class="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-[color-mix(in_srgb,var(--critical)_35%,transparent)] p-3 text-xs">
				<p class="min-w-0 flex-1 text-ink-2">{profile.demo ? t.profile.resetHint : t.profile.deleteHint}</p>
				{#if profile.demo}
					<button type="button" onclick={reset} class="rounded-md border border-line-strong px-3 py-1.5 font-medium hover:bg-hover">{t.profile.resetDemo}</button>
				{:else}
					<button type="button" onclick={remove} class="rounded-md border border-line-strong px-3 py-1.5 font-medium text-[var(--critical)] hover:bg-hover">{t.profile.deleteTitle}</button>
				{/if}
			</div>
		</div>
	{:else}
		<dl class="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line px-5 py-4 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]" transition:slide>
			{#each facts as f (f.label)}
				<div class="min-w-0">
					<dt class="text-[11px] text-ink-3">{f.label}</dt>
					<dd class={['mt-0.5 truncate text-sm', f.value ? ['font-medium', f.tint || 'text-ink'] : 'text-ink-3']} title={!f.value && f.hint ? f.hint : undefined}>{f.value || t.common.notSet}</dd>
				</div>
			{/each}
		</dl>
	{/if}
</section>
