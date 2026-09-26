<script lang="ts">
	import type { Lang } from '../data/types';
	import { LANGS, t } from '../i18n';
	import { repaint } from '../motion.svelte';
	import { prefs } from '../prefs.svelte';
	import Popover from '../ui/Popover.svelte';

	const uid = $props.id();

	// A second language equal to the main one adds nothing, so the two swap
	function setMain(lang: Lang) {
		repaint(() => {
			if (prefs.second === lang) prefs.second = prefs.lang;
			prefs.lang = lang;
		}, 'lang');
	}

	const setSecond = (lang: Lang | null) => repaint(() => (prefs.second = lang), 'lang');

	const row = 'flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-ink hover:bg-hover';
	const radio = 'border-line-strong bg-surface text-[var(--ref-target)] checked:bg-[var(--ref-target)]';
</script>

<Popover label={prefs.lang.toUpperCase()} title={t.nav.language} align="right" variant="quiet">
	<div class="grid w-64 gap-3 text-xs">
		<div role="radiogroup" aria-labelledby="{uid}-main">
			<div id="{uid}-main" class="label mb-1">{t.nav.languageMain}</div>
			{#each LANGS as l (l.id)}
				<label class={row}>
					<input type="radio" name="{uid}-main" checked={prefs.lang === l.id} onchange={() => setMain(l.id)} class={radio} />
					{l.label}
				</label>
			{/each}
		</div>
		<div role="radiogroup" aria-labelledby="{uid}-second" class="border-t border-line pt-3">
			<div id="{uid}-second" class="label mb-1">{t.nav.languageSecond}</div>
			<label class={row}>
				<input type="radio" name="{uid}-second" checked={!prefs.second} onchange={() => setSecond(null)} class={radio} />
				{t.nav.languageNone}
			</label>
			{#each LANGS.filter((l) => l.id !== prefs.lang) as l (l.id)}
				<label class={row}>
					<input type="radio" name="{uid}-second" checked={prefs.second === l.id} onchange={() => setSecond(l.id)} class={radio} />
					{l.label}
				</label>
			{/each}
			<p class="mt-1.5 text-[11px] text-ink-3">{t.nav.languageSecondHint}</p>
		</div>
	</div>
</Popover>
