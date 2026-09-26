<script lang="ts">
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jetbrains-mono';
	import './layout.css';
	import { afterNavigate, beforeNavigate, goto, onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import AppearanceMenu from '#lib/components/AppearanceMenu.svelte';
	import FilterBar from '#lib/components/FilterBar.svelte';
	import LanguageMenu from '#lib/components/LanguageMenu.svelte';
	import ProfileMenu from '#lib/components/ProfileMenu.svelte';
	import Sidebar from '#lib/components/Sidebar.svelte';
	import Timeline from '#lib/components/Timeline.svelte';
	import { fmtDate } from '#lib/analysis.js';
	import { t } from '#lib/i18n/index.js';
	import { fade, fly, glide, morph, motion, navigate, pop, repaint } from '#lib/motion.svelte.js';
	import { persistPrefs, prefs } from '#lib/prefs.svelte.js';
	import { current, db, persistDb, storage } from '#lib/profiles.svelte.js';
	import { persist, resetProfileFilters, settings, type View } from '#lib/state.svelte.js';

	let { children } = $props();

	let drawer = $state(false);
	let help = $state(false);
	let filters = $state(false);
	let scroller: HTMLElement | undefined = $state();

	onNavigate(navigate);

	// Content scrolls inside main, so each page starts at the top and back returns to where it was
	const scrolls: Record<string, number> = {};
	beforeNavigate(({ from }) => {
		if (from && scroller) scrolls[from.url.pathname] = scroller.scrollTop;
	});
	afterNavigate(({ type, to }) => {
		drawer = false;
		if (scroller && to && type !== 'enter') scroller.scrollTop = type === 'popstate' ? (scrolls[to.url.pathname] ?? 0) : 0;
	});

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

	// First visit, or the last own profile deleted: back to the start
	$effect(() => {
		const open = route === '/welcome' || route === '/about';
		if (!open && (!db.consent || !current.profile)) goto(resolve('/welcome'), { replace: true });
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
		root.dataset.motion = motion.reduced ? 'reduce' : 'full';
	});

	function show(view: View) {
		if (onHome) return morph(() => (settings.view = view));
		settings.view = view;
		goto(resolve('/'));
	}

	function cycleTheme() {
		repaint(() => (prefs.theme = prefs.theme === 'system' ? 'dark' : prefs.theme === 'dark' ? 'light' : 'system'), 'theme');
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

	// "Trans" in the name wears the flag colours on HRT profiles
	const flagged = $derived(current.therapy !== 'none' && t.app.name.startsWith('Trans'));

	const utility = 'h-8 rounded-md px-2 text-xs font-medium text-ink-2 hover:bg-hover hover:text-ink';
</script>

<svelte:head>
	<title>{t.app.name}</title>
</svelte:head>

<svelte:window {onkeydown} />

<div class="flex h-dvh flex-col">
	<!-- View tabs sit exactly in the middle once both sides fit, before that in the space between them -->
	<header
		class="vt-header relative z-30 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-surface px-4 py-2 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
	>
		<div class="flex min-w-0 items-center gap-3">
			<a href={resolve('/')} onclick={() => (settings.view = 'grid')} class="flex shrink-0 items-center gap-2.5">
				<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
					<rect x="1" y="1" width="20" height="20" rx="5" fill="#1b1b1a" stroke="var(--border-strong)" />
					<rect x="5" y="5" width="12" height="12" rx="2" fill="#5bcefa" />
					<rect x="5" y="7.4" width="12" height="7.2" fill="#f5a9b8" />
					<rect x="5" y="9.8" width="12" height="2.4" fill="#ffffff" />
					<polyline points="7,14.5 9.5,11 12,12.5 15,8" fill="none" stroke="#1b1b1a" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" />
				</svg>
				<span class={['text-[15px] font-semibold tracking-tight', flagged && 'flag-name']}>
					{#if flagged}<span class="trans-flag">{#each [...t.app.name.slice(0, 5)] as letter, i (i)}<span>{letter}</span>{/each}</span>{t.app.name.slice(5)}{:else}{t.app.name}{/if}
				</span>
			</a>
			{#if chrome}
				<button type="button" onclick={() => (drawer = true)} class="h-8 shrink-0 rounded-md border border-line px-2 text-xs text-ink-2 hover:bg-hover lg:hidden">{t.nav.analytes}</button>
				<button type="button" onclick={() => (filters = !filters)} aria-expanded={filters} class="h-8 shrink-0 rounded-md border border-line px-2 text-xs text-ink-2 hover:bg-hover md:hidden">{t.nav.filters} {filters ? '▴' : '▾'}</button>
				<span class="num hidden truncate text-xs text-ink-3 2xl:inline">{t.nav.summary(current.profile?.draws.length ?? 0, current.built.measurements.length, span)}</span>
			{/if}
		</div>

		{#if hasData}
			<nav class="order-last flex w-full justify-center lg:order-none lg:col-start-2 lg:w-auto" aria-label={t.nav.views}>
				<div class="relative flex h-8 rounded-[9px] bg-surface-3 p-[3px]" {@attach glide('[aria-current="page"]')}>
					<span data-pill class="inset-y-[3px] rounded-md bg-raised shadow-sm"></span>
					{#each tabs as tab (tab.view)}
						{const active = $derived(onHome && settings.view === tab.view)}
						<button
							type="button"
							onclick={() => show(tab.view)}
							title={t.nav.shortcut(tab.key)}
							aria-current={active ? 'page' : undefined}
							class={['relative rounded-md px-3 text-[13px] font-medium transition-colors', active ? 'text-ink' : 'text-ink-2 hover:text-ink']}
						>
							{tab.label}
						</button>
					{/each}
				</div>
			</nav>
		{/if}

		<div class="ml-auto flex min-w-0 items-center justify-end gap-2 lg:col-start-3 lg:ml-0">
			{#if current.profile}
				<!-- My data and the profile it belongs to read as one control with two buttons -->
				<div class="flex h-8 min-w-0 rounded-md border border-line-strong bg-surface">
					<a
						href={resolve('/data')}
						aria-current={route.startsWith('/data') ? 'page' : undefined}
						class={[
							'inline-flex shrink-0 items-center gap-1.5 rounded-l-[5px] px-2.5 text-[13px] font-semibold transition-colors',
							route.startsWith('/data') ? 'bg-ink text-surface' : 'text-ink hover:bg-hover'
						]}
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M6 1.5h4M6.5 1.5v4.2L2.6 12.4A1.4 1.4 0 0 0 3.8 14.5h8.4a1.4 1.4 0 0 0 1.2-2.1L9.5 5.7V1.5" />
							<path d="M4.3 10h7.4" />
						</svg>
						{t.nav.myData}
					</a>
					<span class="w-px shrink-0 bg-line-strong" aria-hidden="true"></span>
					<div class="max-w-56 min-w-0"><ProfileMenu /></div>
				</div>
			{/if}
			<span class="mx-1 h-5 w-px shrink-0 bg-line" aria-hidden="true"></span>
			<div class="flex shrink-0 items-center">
				<LanguageMenu />
				<AppearanceMenu />
				<button type="button" onclick={() => (help = !help)} title={t.nav.help} aria-label={t.nav.help} class={utility}>?</button>
			</div>
		</div>
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
		<main bind:this={scroller} class="vt-main min-w-0 flex-1 overflow-y-auto">
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
		<button type="button" class="absolute inset-0 bg-black/30" aria-label={t.nav.closeList} onclick={() => (drawer = false)} transition:fade></button>
		<aside class="relative h-full w-80 max-w-[85vw] border-r border-line bg-surface shadow-[var(--shadow)]" transition:fly={{ x: -320, opacity: 1 }}>
			<Sidebar active={focusId} />
		</aside>
	</div>
{/if}

{#if help}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button type="button" class="absolute inset-0 cursor-default bg-black/30" aria-label={t.common.close} onclick={() => (help = false)} transition:fade></button>
		<section class="relative w-full max-w-md rounded-lg border border-line bg-surface p-5 shadow-[var(--shadow)]" aria-label={t.help.title} in:pop={{ y: 10 }} out:fade={{ duration: 100 }}>
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
