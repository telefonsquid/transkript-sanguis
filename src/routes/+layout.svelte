<script lang="ts">
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jetbrains-mono';
	import './layout.css';
	import { afterNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import FilterBar from '#lib/components/FilterBar.svelte';
	import ProfileMenu from '#lib/components/ProfileMenu.svelte';
	import Sidebar from '#lib/components/Sidebar.svelte';
	import Timeline from '#lib/components/Timeline.svelte';
	import { fmtDate } from '#lib/analysis.js';
	import { LANGS, t } from '#lib/i18n/index.js';
	import { persistPrefs, prefs } from '#lib/prefs.svelte.js';
	import { current, db, persistDb, storage } from '#lib/profiles.svelte.js';
	import { persist, resetProfileFilters, settings, type View } from '#lib/state.svelte.js';

	let { children } = $props();

	let drawer = $state(false);
	let help = $state(false);
	let filters = $state(false);

	afterNavigate(() => (drawer = false));

	const tabs = $derived<{ view: View; label: string; key: string }[]>([
		{ view: 'grid', label: t.nav.overview, key: '1' },
		{ view: 'compare', label: t.nav.compare, key: '2' },
		{ view: 'matrix', label: t.nav.matrix, key: '3' },
		{ view: 'table', label: t.nav.table, key: '4' }
	]);

	const route = $derived(page.route.id ?? '');
	const onHome = $derived(route === '/');
	const focusId = $derived(page.params.id);
	const hasData = $derived(current.built.measurements.length > 0);

	/** Charts and their filters only belong to the dashboard and the focus pages */
	const chrome = $derived((onHome || route === '/analyte/[id]') && hasData);

	// First visit, or every profile deleted: back to the start
	$effect(() => {
		const open = route === '/welcome' || route === '/about';
		if (!open && (!db.consent || !db.profiles.length)) goto(resolve('/welcome'), { replace: true });
	});

	// Everything survives reloads, every field read here becomes a dependency
	$effect(() => {
		$state.snapshot(settings);
		persist();
	});
	$effect(() => {
		$state.snapshot(prefs);
		persistPrefs();
	});
	$effect(() => {
		$state.snapshot(db);
		persistDb();
	});

	// Date and lab filters of one profile mean nothing for the next
	let lastProfile: string | null | undefined;
	$effect(() => {
		const active = db.active;
		if (lastProfile !== undefined && lastProfile !== active) resetProfileFilters();
		lastProfile = active;
	});

	$effect(() => {
		const root = document.documentElement;
		root.lang = prefs.lang;
		if (prefs.theme === 'system') root.removeAttribute('data-theme');
		else root.dataset.theme = prefs.theme;
	});

	function show(view: View) {
		settings.view = view;
		if (!onHome) goto(resolve('/'));
	}

	function cycleTheme() {
		prefs.theme = prefs.theme === 'system' ? 'dark' : prefs.theme === 'dark' ? 'light' : 'system';
	}

	function onkeydown(e: KeyboardEvent) {
		const el = e.target as HTMLElement;
		if (el.closest('input, textarea, select, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
		const tab = tabs.find((x) => x.key === e.key);
		if (tab && hasData) show(tab.view);
		else if (e.key === 'x') settings.xMode = settings.xMode === 'time' ? 'draws' : settings.xMode === 'draws' ? 'points' : 'time';
		else if (e.key === 'l') settings.yScale = settings.yScale === 'log' ? 'linear' : settings.yScale === 'linear' ? 'auto' : 'log';
		else if (e.key === 'u') settings.units = settings.units === 'conv' ? 'si' : 'conv';
		else if (e.key === 'h') settings.xLabel = settings.xLabel === 'date' ? 'hrt' : 'date';
		else if (e.key === 'd') cycleTheme();
		else if (e.key === '?') help = !help;
		else if (e.key === 'Escape' && (help || drawer)) [help, drawer] = [false, false];
		else if (e.key === 'Escape' && focusId) goto(resolve('/'));
		else return;
		e.preventDefault();
	}

	const span = $derived.by(() => {
		const draws = current.profile?.draws ?? [];
		if (!draws.length) return '';
		return `${fmtDate(Date.parse(draws[0].date))} – ${fmtDate(Date.parse(draws.at(-1)!.date))}`;
	});

	const navLink = (active: boolean) => ['rounded-md px-2.5 py-1 text-[13px] font-medium', active ? 'bg-ink text-surface' : 'text-ink-2 hover:bg-hover hover:text-ink'];
</script>

<svelte:head>
	<title>{t.app.name}</title>
</svelte:head>

<svelte:window {onkeydown} />

<div class="flex h-dvh flex-col">
	<header class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-surface px-4 py-2">
		<a href={resolve('/')} onclick={() => (settings.view = 'grid')} class="flex items-center gap-2.5">
			<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
				<rect x="1" y="1" width="20" height="20" rx="5" fill="#1b1b1a" stroke="var(--border-strong)" />
				<rect x="5" y="5" width="12" height="12" rx="2" fill="#5bcefa" />
				<rect x="5" y="7.4" width="12" height="7.2" fill="#f5a9b8" />
				<rect x="5" y="9.8" width="12" height="2.4" fill="#ffffff" />
				<polyline points="7,14.5 9.5,11 12,12.5 15,8" fill="none" stroke="#1b1b1a" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" />
			</svg>
			<span class="text-[15px] font-semibold tracking-tight">{t.app.name}</span>
		</a>
		{#if chrome}
			<button type="button" onclick={() => (drawer = true)} class="rounded-md border border-line px-2 py-1 text-xs text-ink-2 hover:bg-hover lg:hidden">{t.nav.analytes}</button>
			<button type="button" onclick={() => (filters = !filters)} aria-expanded={filters} class="rounded-md border border-line px-2 py-1 text-xs text-ink-2 hover:bg-hover md:hidden">{t.nav.filters} {filters ? '▴' : '▾'}</button>
			<span class="num hidden text-xs text-ink-3 xl:inline">{t.nav.summary(current.profile?.draws.length ?? 0, current.built.measurements.length, span)}</span>
		{/if}

		<nav class="ml-auto flex flex-wrap items-center gap-0.5" aria-label={t.nav.views}>
			{#if hasData}
				{#each tabs as tab (tab.view)}
					<button type="button" onclick={() => show(tab.view)} title={t.nav.shortcut(tab.key)} class={navLink(onHome && settings.view === tab.view)}>{tab.label}</button>
				{/each}
				<span class="mx-1.5 h-5 w-px bg-line"></span>
			{/if}
			{#if db.profiles.length}
				<a href={resolve('/add')} class={navLink(route.startsWith('/add'))}>{t.nav.addData}</a>
				<a href={resolve('/data')} class={navLink(route === '/data')}>{t.nav.data}</a>
			{/if}
			<a href={resolve('/about')} class={navLink(route === '/about')}>{t.nav.about}</a>
			{#if db.profiles.length}
				<div class="ml-2"><ProfileMenu /></div>
			{/if}
			<div class="ml-2 inline-flex rounded-md border border-line bg-surface p-0.5" role="radiogroup" aria-label={t.nav.language}>
				{#each LANGS as l (l.id)}
					<button
						type="button"
						role="radio"
						aria-checked={prefs.lang === l.id}
						title={l.label}
						aria-label={l.label}
						onclick={() => (prefs.lang = l.id)}
						class={['rounded-[5px] px-1.5 py-0.5 text-[11px] font-semibold uppercase', prefs.lang === l.id ? 'bg-ink text-surface' : 'text-ink-2 hover:bg-hover']}>{l.id}</button
					>
				{/each}
			</div>
			<label class="ml-1 flex items-center gap-1 text-[11px] text-ink-2" title={t.nav.altNamesTitle}>
				<input type="checkbox" bind:checked={prefs.altNames} class="size-3.5 rounded border-line-strong bg-surface text-[var(--ref-target)] checked:bg-[var(--ref-target)]" />
				{t.nav.altNames}
			</label>
			<button type="button" onclick={cycleTheme} title={t.nav.themeTitle} class="ml-2 rounded-md border border-line px-2 py-1 text-xs text-ink-2 hover:bg-hover hover:text-ink">
				{t.nav.theme[prefs.theme]}
			</button>
			<button type="button" onclick={() => (help = !help)} title={t.nav.help} class="rounded-md border border-line px-2 py-1 text-xs text-ink-2 hover:bg-hover hover:text-ink">?</button>
		</nav>
	</header>

	{#if storage.error}
		<div class="border-b border-line bg-[color-mix(in_srgb,var(--critical)_12%,var(--surface))] px-4 py-2 text-xs text-ink">⚠ {t.nav.storageError}</div>
	{/if}

	{#if chrome}
		<div class={['space-y-1 border-b border-line bg-surface px-4 pt-2 pb-1', filters ? 'block' : 'hidden md:block']}>
			<FilterBar />
			<Timeline />
		</div>
	{/if}

	<div class="flex min-h-0 flex-1">
		{#if chrome}
			<aside class="hidden w-72 shrink-0 border-r border-line bg-surface lg:block">
				<Sidebar active={focusId} />
			</aside>
		{/if}
		<main class="min-w-0 flex-1 overflow-y-auto">
			{@render children()}
		</main>
	</div>

	<footer class="flex flex-wrap items-center gap-x-3 border-t border-line bg-surface px-4 py-1 text-[11px] text-ink-3">
		<span>🔒 {t.disclaimer.footer}</span>
		<a href={resolve('/about')} class="underline decoration-line-strong underline-offset-2 hover:text-ink">{t.nav.about}</a>
	</footer>
</div>

{#if drawer && chrome}
	<div class="fixed inset-0 z-50 flex lg:hidden">
		<aside class="h-full w-80 max-w-[85vw] border-r border-line bg-surface shadow-[var(--shadow)]">
			<Sidebar active={focusId} />
		</aside>
		<button type="button" class="flex-1 bg-black/30" aria-label={t.nav.closeList} onclick={() => (drawer = false)}></button>
	</div>
{/if}

{#if help}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
		<button type="button" class="absolute inset-0 cursor-default" aria-label={t.common.close} onclick={() => (help = false)}></button>
		<section class="relative w-full max-w-md rounded-lg border border-line bg-surface p-5 shadow-[var(--shadow)]" aria-label={t.help.title}>
			<h2 class="mb-3 text-sm font-semibold">{t.help.title}</h2>
			<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
				{#each t.help.keys as [k, v] (k)}
					<dt><kbd class="num rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[11px]">{k}</kbd></dt>
					<dd class="text-ink-2">{v}</dd>
				{/each}
			</dl>
		</section>
	</div>
{/if}
