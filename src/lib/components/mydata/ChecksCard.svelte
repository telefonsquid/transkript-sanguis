<script lang="ts">
	import { fmtIso, fmtNum } from '../../analysis';
	import type { Check } from '../../checks';
	import { t } from '../../i18n';

	let { checks }: { checks: Check[] } = $props();

	const failed = $derived(checks.filter((c) => !c.ok));
	const sorted = $derived([...failed, ...checks.filter((c) => c.ok)]);
</script>

<section id="checks" class="rounded-xl border border-line bg-surface p-4" aria-labelledby="checks-title">
	<h2 id="checks-title" class="text-sm font-semibold">{t.data.checks}</h2>
	<p class="mt-1 text-xs text-ink-3">{t.data.checksIntro}</p>

	{#if !checks.length}
		<p class="mt-3 text-xs text-ink-3">{t.data.noChecks}</p>
	{:else}
		<p class={['mt-3 flex items-center gap-2 text-sm font-medium', failed.length ? 'text-ink' : 'text-ink-2']}>
			<span style:color={failed.length ? 'var(--serious)' : 'var(--good)'} aria-hidden="true">{failed.length ? '⚠' : '✓'}</span>
			{failed.length ? t.data.checksOff(failed.length, checks.length) : t.data.allChecksOk(checks.length)}
		</p>
		<details class="mt-2" open={failed.length > 0}>
			<summary class="cursor-pointer text-xs text-ink-3 hover:text-ink">{t.data.showChecks}</summary>
			<div class="mt-2 flex gap-3 border-b border-line pb-1 text-[11px] text-ink-3">
				<span class="flex-1">{t.data.colCheck}</span>
				<span>{t.data.colPrinted} / {t.data.colExpected}</span>
			</div>
			<ul class="divide-y divide-line text-xs">
				{#each sorted as c, i (i)}
					<li class="flex items-center gap-3 py-1.5">
						<div class="min-w-0 flex-1">
							<div class="truncate text-ink">{t.data.checkNames[c.id]}</div>
							<div class="num text-[11px] text-ink-3">{fmtIso(c.date)}</div>
						</div>
						<span class="num text-ink-2">{fmtNum(c.printed, 2)} / {fmtNum(c.expected, 2)}</span>
						<span class="w-3 text-center" style:color={c.ok ? 'var(--ink-3)' : 'var(--serious)'} title={c.ok ? t.data.checkOk : t.data.checkOff}>{c.ok ? '✓' : '⚠'}</span>
					</li>
				{/each}
			</ul>
		</details>
	{/if}
</section>
