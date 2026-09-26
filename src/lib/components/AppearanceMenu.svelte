<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { t } from '../i18n';
	import { glide, motion, repaint } from '../motion.svelte';
	import { prefs, type Theme } from '../prefs.svelte';
	import Popover from '../ui/Popover.svelte';

	const uid = $props.id();

	// The new theme spreads out from the button that picked it
	function pick(theme: Theme, e: MouseEvent) {
		repaint(() => (prefs.theme = theme), 'theme', { x: e.clientX, y: e.clientY });
	}
</script>

<Popover label={t.nav.theme[prefs.theme]} title={t.nav.themeTitle} align="right" variant="quiet">
	<div class="grid w-64 gap-3 text-xs">
		<div>
			<div id="{uid}-theme" class="label mb-1.5">{t.nav.themeLabel}</div>
			<div role="radiogroup" aria-labelledby="{uid}-theme" class="relative grid h-8 grid-cols-3 rounded-md border border-line bg-surface p-0.5" {@attach glide('[aria-checked="true"]')}>
				<span data-pill class="inset-y-0.5 rounded-[5px] bg-ink"></span>
				{#each ['system', 'light', 'dark'] as const as theme (theme)}
					<button
						type="button"
						role="radio"
						aria-checked={prefs.theme === theme}
						onclick={(e) => pick(theme, e)}
						class={['relative rounded-[5px] font-medium transition-colors', prefs.theme === theme ? 'text-surface' : 'text-ink-2 hover:text-ink']}
					>
						{t.nav.themes[theme]}
					</button>
				{/each}
			</div>
		</div>
		<label class="flex cursor-pointer items-start gap-2 border-t border-line pt-3">
			<input
				type="checkbox"
				checked={motion.reduced}
				disabled={prefersReducedMotion.current}
				onchange={(e) => (prefs.reduceMotion = e.currentTarget.checked)}
				class="mt-px rounded border-line-strong disabled:opacity-60"
			/>
			<span>
				<span class="block font-medium text-ink">{t.nav.reduceMotion}</span>
				<span class="block text-ink-3">{prefersReducedMotion.current ? t.nav.reduceMotionSystem : t.nav.reduceMotionHint}</span>
			</span>
		</label>
	</div>
</Popover>
