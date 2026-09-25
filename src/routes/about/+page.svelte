<script lang="ts">
	import { resolve } from '$app/paths';
	import { fmtNum } from '#lib/analysis.js';
	import { analytes, groups, sources } from '#lib/data/index.js';
	import { altNameOf, nameOf, t, tx } from '#lib/i18n/index.js';

	const byGroup = $derived(groups.map((g) => ({ g, items: analytes.filter((a) => a.group === g.id) })).filter((r) => r.items.length));
	const unitRows = analytes.filter((a) => a.si);
	const factor = (f: number) => fmtNum(f, f >= 100 ? 1 : f >= 1 ? 3 : 5).replace(/[.,]?0+$/, '');
</script>

<svelte:head><title>{t.about.title} · {t.app.name}</title></svelte:head>

<div class="mx-auto max-w-5xl space-y-8 p-6 text-sm">
	<section>
		<h1 class="text-2xl font-semibold tracking-tight">{t.about.title}</h1>
		<p class="mt-2 max-w-3xl text-ink-2">{t.about.intro}</p>
	</section>

	<section class="grid gap-3 md:grid-cols-2">
		<div class="rounded-lg border border-line bg-surface p-4">
			<h2 class="font-semibold">🔒 {t.disclaimer.localTitle}</h2>
			<p class="mt-1 text-ink-2">{t.disclaimer.localBody}</p>
			<p class="mt-2 text-xs text-ink-3">{t.disclaimer.agentPrivacy}</p>
		</div>
		<div class="rounded-lg border border-line bg-surface p-4">
			<h2 class="font-semibold">⚕ {t.disclaimer.medicalTitle}</h2>
			<p class="mt-1 text-ink-2">{t.disclaimer.medicalBody}</p>
		</div>
	</section>

	<section>
		<h2 class="mb-1 text-base font-semibold">{t.about.howTitle}</h2>
		<p class="max-w-3xl text-ink-2">{t.about.how}</p>
		<ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
			{#each ['lab', 'target', 'context', 'trans', 'clinical', 'female', 'male', 'adult'] as const as kind (kind)}
				<li class="flex items-center gap-1.5"><span class="inline-block h-3 w-1 rounded-full" style:background="var(--ref-{kind})"></span>{t.kind[kind]}</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2 class="mb-1 text-base font-semibold">{t.about.catalogue}</h2>
		<p class="mb-3 text-ink-2">{t.about.catalogueIntro(analytes.length)}</p>
		<div class="columns-1 gap-6 sm:columns-2 lg:columns-3">
			{#each byGroup as { g, items } (g.id)}
				<div class="mb-4 break-inside-avoid">
					<h3 class="label mb-1">{tx(g.label)}</h3>
					<ul class="space-y-0.5 text-xs">
						{#each items as a (a.id)}
							<li>
								<a href={resolve('/analyte/[id]', { id: a.id })} class="text-ink hover:underline">{nameOf(a)}</a>
								{#if altNameOf(a)}<span class="text-ink-3">· {altNameOf(a)}</span>{/if}
								<span class="text-ink-3">· {a.refs.length}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="mb-2 text-base font-semibold">{t.agent.title}</h2>
		<p class="max-w-3xl text-ink-2">{t.ingest.agentBody}</p>
		<div class="mt-2 flex flex-wrap gap-3 text-xs">
			<a href={resolve('/add/agent')} class="underline">{t.agent.step1}</a>
			<a href={resolve('/agent-instructions.md')} class="underline" target="_blank">agent-instructions.md</a>
			<a href={resolve('/laborwerte-import.schema.json')} class="underline" target="_blank">laborwerte-import.schema.json</a>
		</div>
	</section>

	<section>
		<h2 class="mb-2 text-base font-semibold">{t.about.literature}</h2>
		<ul class="space-y-1.5 text-xs">
			{#each sources as s (s.id)}
				<li class="grid gap-x-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
					<span class="font-medium text-ink">{s.short}</span>
					<span class="text-ink-2">
						{#if s.url}<a href={s.url} target="_blank" rel="noreferrer" class="underline decoration-line-strong underline-offset-2 hover:text-ink">{s.title}</a>{:else}{s.title}{/if}
					</span>
				</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2 class="mb-2 text-base font-semibold">{t.about.conversions}</h2>
		<div class="overflow-x-auto rounded-lg border border-line bg-surface">
			<table class="num w-full text-xs">
				<tbody>
					{#each unitRows as a (a.id)}
						<tr class="border-b border-line last:border-0">
							<td class="px-3 py-1.5 font-sans text-ink">{nameOf(a)}</td>
							<td class="px-2 py-1.5 whitespace-nowrap text-ink-2">1 {a.unit} = {factor(a.si!.factor)} {a.si!.unit}</td>
							<td class="px-3 py-1.5 whitespace-nowrap text-ink-3">1 {a.si!.unit} = {factor(1 / a.si!.factor)} {a.unit}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>
