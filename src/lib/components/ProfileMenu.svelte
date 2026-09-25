<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '../i18n';
	import { current, db, setActive } from '../profiles.svelte';
	import Popover from '../ui/Popover.svelte';

	const label = $derived(current.profile ? current.profile.name : t.profile.empty);
</script>

<Popover {label} title={t.profile.switch} align="right" menu>
	<div class="grid gap-0.5 text-xs">
		{#each db.profiles as p (p.id)}
			<button
				type="button"
				onclick={() => setActive(p.id)}
				class={['flex items-baseline gap-2 rounded px-2 py-1.5 text-left', p.id === db.active ? 'bg-surface-3 text-ink' : 'text-ink-2 hover:bg-hover hover:text-ink']}
			>
				<span class="font-medium">{p.name}</span>
				<span class="ml-auto text-[11px] text-ink-3">{t.profile.therapyShort[p.therapy]} · {t.profile.draws(p.draws.length)}</span>
			</button>
		{/each}
		<div class="mt-1 border-t border-line pt-1.5">
			<a href={resolve('/profiles')} class="block rounded px-2 py-1.5 text-ink-2 hover:bg-hover hover:text-ink">{t.profile.manage}</a>
		</div>
	</div>
</Popover>
