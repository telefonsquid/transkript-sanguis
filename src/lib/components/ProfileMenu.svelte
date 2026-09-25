<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Profile } from '../data/types';
	import { t } from '../i18n';
	import { current, db, setActive } from '../profiles.svelte';
	import Avatar from '../ui/Avatar.svelte';
	import Popover from '../ui/Popover.svelte';

	const own = $derived(db.profiles.filter((p) => !p.demo));
	const demos = $derived(db.profiles.filter((p) => p.demo));

	const link = 'block rounded px-2 py-1.5 text-ink-2 hover:bg-hover hover:text-ink';
</script>

<Popover label={current.profile?.name ?? t.profile.empty} title={t.profile.switch} align="right" variant="strong" compactLabel={!!current.profile} menu>
	{#snippet icon()}
		{#if current.profile}<Avatar profile={current.profile} size={20} />{/if}
	{/snippet}
	<div class="grid w-80 gap-0.5 text-xs">
		{#if own.length}
			<div class="label px-2 pt-0.5 pb-1">{t.profile.own}</div>
		{/if}
		{#each own as p (p.id)}
			{@render item(p)}
		{/each}
		<div class={['label px-2 pb-1', own.length ? 'mt-2 border-t border-line pt-2.5' : 'pt-0.5']}>{t.profile.demos}</div>
		{#each demos as p (p.id)}
			{@render item(p)}
		{/each}
		<div class="mt-1 border-t border-line pt-1.5">
			<a href="{resolve('/profiles')}?new" class={link}>+ {t.profile.new}</a>
			<a href={resolve('/profiles')} class={link}>{t.profile.manage}</a>
		</div>
	</div>
</Popover>

{#snippet item(p: Profile)}
	<button
		type="button"
		onclick={() => setActive(p.id)}
		aria-current={p.id === db.active}
		class={['flex items-center gap-2.5 rounded px-2 py-1.5 text-left', p.id === db.active ? 'bg-surface-3 text-ink' : 'text-ink-2 hover:bg-hover hover:text-ink']}
	>
		<Avatar profile={p} size={20} />
		<span class="min-w-0 flex-1 truncate font-medium" title={p.name}>{p.name}</span>
		<span class="shrink-0 text-right text-[11px] whitespace-nowrap text-ink-3">{t.profile.therapyShort[p.therapy]} · {t.profile.draws(p.draws.length)}</span>
	</button>
{/snippet}
