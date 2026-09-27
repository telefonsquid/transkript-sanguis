<script lang="ts">
	import changelog from '../../../CHANGELOG.md?raw';
	import { fmtIso } from '#lib/analysis.js';
	import { t } from '#lib/i18n/index.js';
	import { parseChangelog, type Inline } from '#lib/release.js';
	import { appVersion } from '#lib/update.js';

	// Same text as the GitHub releases, written once in CHANGELOG.md
	const releases = parseChangelog(changelog);
</script>

<svelte:head><title>{t.changelog.title} · {t.app.name}</title></svelte:head>

<div class="mx-auto max-w-3xl space-y-8 p-6 text-sm">
	<section>
		<h1 class="text-2xl font-semibold tracking-tight">{t.changelog.title}</h1>
		<p class="mt-2 text-ink-2">{t.changelog.intro}</p>
	</section>

	{#each releases as release (release.version)}
		<section aria-labelledby="v{release.version}">
			<h2 id="v{release.version}" class="flex flex-wrap items-baseline gap-x-3 text-base font-semibold">
				<span class="num">{release.version}</span>
				{#if release.date}<span class="num text-xs font-normal text-ink-3">{fmtIso(release.date)}</span>{/if}
				{#if release.version === appVersion}<span class="rounded-full border border-line-strong px-2 text-[11px] font-medium text-ink-2">{t.changelog.current}</span>{/if}
			</h2>
			<div lang="en">
				{#each release.intro as paragraph, i (i)}
					<p class="mt-2 max-w-prose text-ink-2">{@render inline(paragraph)}</p>
				{/each}
				{#each release.groups as group, i (i)}
					{#if group.title}<h3 class="label mt-4 mb-1.5">{group.title}</h3>{/if}
					<ul class="list-disc space-y-1 pl-5 text-ink-2 marker:text-ink-3">
						{#each group.items as item, j (j)}<li>{@render inline(item)}</li>{/each}
					</ul>
				{/each}
			</div>
		</section>
	{/each}
</div>

{#snippet inline(parts: Inline[])}
	{#each parts as part, i (i)}{#if part.code}<code class="rounded bg-surface-3 px-1 font-mono text-[12px]">{part.text}</code>{:else}{part.text}{/if}{/each}
{/snippet}
