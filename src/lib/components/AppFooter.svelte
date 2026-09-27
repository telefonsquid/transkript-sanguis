<script lang="ts">
	import { resolve } from '$app/paths';
	import { REPO_URL, SITE_URL } from '../app';
	import { desktop } from '../desktop';
	import { t } from '../i18n';
	import { prefs } from '../prefs.svelte';
	import { appVersion, checkForUpdate, type Update } from '../update';

	let { onhelp }: { onhelp: () => void } = $props();

	let update = $state<Update | null>(null);

	// Looks once per start and again whenever the check gets switched on
	$effect(() => {
		update = null;
		if (!prefs.updates) return;
		let live = true;
		checkForUpdate().then((found) => {
			if (live) update = found;
		});
		return () => {
			live = false;
		};
	});

	const link = 'underline decoration-line-strong underline-offset-2 hover:text-ink';
</script>

<footer class="flex flex-wrap items-center gap-x-3 border-t border-line bg-surface px-4 py-1 text-[11px] text-ink-3">
	<span>{desktop ? t.disclaimer.footerDesktop : t.disclaimer.footer}</span>
	<a href={resolve('/about')} class={link}>{t.nav.about}</a>
	<a href={resolve('/about')} class={link}>{t.nav.sources}</a>
	<a href={resolve('/changelog')} class={link}>{t.nav.changelog}</a>
	<a href={REPO_URL} target="_blank" rel="noreferrer" class={link}>{t.nav.code}</a>
	<!-- Each build points at the other one -->
	{#if desktop}
		<a href={SITE_URL} target="_blank" rel="noreferrer" class={link}>{t.nav.webVersion}</a>
	{:else}
		<a href="{REPO_URL}/releases/latest" target="_blank" rel="noreferrer" class={link}>{t.nav.desktopApp}</a>
	{/if}

	<span class="ml-auto flex flex-wrap items-center gap-x-3">
		{#if update}
			<a href={update.url} target="_blank" rel="noreferrer" class="font-medium text-ink underline decoration-[var(--blood)] underline-offset-2">{t.nav.update(update.version)}</a>
		{/if}
		{#if desktop}
			<label class="inline-flex cursor-pointer items-center gap-1.5 hover:text-ink" title={t.nav.updatesHint}>
				<input type="checkbox" bind:checked={prefs.updates} class="size-3 rounded-sm" />
				{t.nav.updates}
			</label>
		{/if}
		<span class="num">v{appVersion}</span>
		<button type="button" onclick={onhelp} aria-haspopup="dialog" class="inline-flex items-center gap-1.5 hover:text-ink">
			<kbd class="num rounded border border-line bg-surface-2 px-1 font-mono text-[10px] leading-4">?</kbd>{t.nav.help}
		</button>
	</span>
</footer>
