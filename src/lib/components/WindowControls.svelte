<script lang="ts">
	import { t } from '../i18n';

	let { class: klass = '' }: { class?: string } = $props();

	let maximized = $state(false);

	// Loaded on first use so the web build never carries the desktop API
	const win = () => import('@tauri-apps/api/window').then((m) => m.getCurrentWindow());

	// Follows every size change, snapping and F11 included
	$effect(() => {
		let live = true;
		let stop: (() => void) | undefined;
		win().then(async (w) => {
			const read = async () => {
				const [max, full] = await Promise.all([w.isMaximized(), w.isFullscreen()]);
				if (live) maximized = max || full;
			};
			const unlisten = await w.onResized(read);
			if (live) stop = unlisten;
			else unlisten();
			await read();
		});
		return () => {
			live = false;
			stop?.();
		};
	});

	// Fullscreen has nothing to restore to, the button leaves it instead
	async function toggle() {
		const w = await win();
		if (await w.isFullscreen()) await w.setFullscreen(false);
		else await w.toggleMaximize();
	}

	const button = 'inline-flex w-[46px] items-center justify-center text-ink-2 transition-colors';
	const plain = [button, 'hover:bg-hover hover:text-ink'];
</script>

<!-- Glyphs follow the Windows 11 caption buttons -->
<div class={['flex', klass]}>
	<button type="button" onclick={async () => (await win()).minimize()} title={t.nav.minimize} aria-label={t.nav.minimize} class={plain}>
		<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" aria-hidden="true"><path d="M0 5.5h10" /></svg>
	</button>
	<button type="button" onclick={toggle} title={maximized ? t.nav.restore : t.nav.maximize} aria-label={maximized ? t.nav.restore : t.nav.maximize} class={plain}>
		<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" aria-hidden="true">
			{#if maximized}
				<path d="M2.5 2.5v-1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-1" />
				<rect x="0.5" y="2.5" width="7" height="7" rx="1" />
			{:else}
				<rect x="0.5" y="0.5" width="9" height="9" rx="1" />
			{/if}
		</svg>
	</button>
	<button type="button" onclick={async () => (await win()).close()} title={t.nav.close} aria-label={t.nav.close} class={[button, 'hover:bg-[#c42b1c] hover:text-white']}>
		<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" aria-hidden="true"><path d="M.5.5l9 9m0-9-9 9" /></svg>
	</button>
</div>
