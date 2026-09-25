<script lang="ts">
	import { fmtIso } from '../../analysis';
	import { todayIso } from '../../data';
	import type { Profile } from '../../data/types';
	import { t } from '../../i18n';
	import { newId } from '../../profiles.svelte';

	let { profile }: { profile: Profile } = $props();

	let editing: string | null = $state(null);

	const phases = $derived([...profile.phases].sort((a, b) => a.start.localeCompare(b.start)));
	const baseline = $derived(profile.therapy === 'none' ? t.data.baseline.none : t.data.baseline.hrt);

	function add() {
		const id = newId('phase');
		profile.phases.push({ id, label: '', start: todayIso() });
		editing = id;
	}

	function remove(id: string) {
		if (!confirm(t.common.confirmDelete)) return;
		profile.phases = profile.phases.filter((p) => p.id !== id);
		editing = null;
	}

	const input = 'h-8 w-full rounded-md border-line bg-surface px-2 text-sm';
</script>

<section class="rounded-xl border border-line bg-surface p-4" aria-labelledby="phases-title">
	<div class="flex items-baseline justify-between gap-2">
		<h2 id="phases-title" class="text-sm font-semibold">{t.data.phases}</h2>
		<button type="button" onclick={add} class="rounded-md border border-line px-2 py-0.5 text-xs font-medium hover:bg-hover">+ {t.data.addPhase}</button>
	</div>
	<p class="mt-1 text-xs text-ink-3">{t.data.phasesIntro}</p>

	<ol class="mt-4 space-y-4 border-l border-line-strong pl-4">
		<li class="relative">
			<span class="absolute top-1 -left-[21px] size-2.5 rounded-full border border-line-strong bg-surface"></span>
			<div class="text-[11px] text-ink-3">{phases.length ? t.data.until(fmtIso(phases[0].start)) : t.data.noPhases}</div>
			<div class="text-sm text-ink-2">{baseline}</div>
		</li>
		{#each phases as p (p.id)}
			<li class="relative">
				<span class="absolute top-1 -left-[21px] size-2.5 rounded-full bg-ink"></span>
				{#if editing === p.id}
					<div class="grid gap-2 rounded-lg bg-surface-2 p-3">
						<label class="grid gap-1 text-xs">
							<span class="text-ink-3">{t.data.phaseStart}</span>
							<input type="date" bind:value={p.start} class={[input, !p.start && 'empty']} />
						</label>
						<label class="grid gap-1 text-xs">
							<span class="text-ink-3">{t.data.phaseLabel}</span>
							<!-- svelte-ignore a11y_autofocus -->
							<input bind:value={p.label} placeholder={t.data.phaseLabelHint} class={input} autofocus />
						</label>
						<label class="grid gap-1 text-xs">
							<span class="text-ink-3">{t.data.phaseRegimen}</span>
							<input bind:value={p.regimen} placeholder={t.data.phaseRegimenHint} class={input} />
						</label>
						<label class="flex items-center gap-1.5 text-xs text-ink-2"><input type="checkbox" bind:checked={p.approx} class="rounded" /> {t.profile.approx}</label>
						<label class="flex items-center gap-1.5 text-xs text-ink-2"><input type="checkbox" bind:checked={p.afterDraw} class="rounded" /> {t.data.afterDraw}</label>
						<div class="mt-1 flex items-center gap-2">
							<button type="button" onclick={() => (editing = null)} class="rounded-md bg-ink px-3 py-1 text-xs font-medium text-surface hover:opacity-90">{t.common.done}</button>
							<button type="button" onclick={() => remove(p.id)} class="ml-auto rounded-md px-2 py-1 text-xs text-[var(--critical)] hover:bg-hover">{t.data.deletePhase}</button>
						</div>
					</div>
				{:else}
					<button type="button" onclick={() => (editing = p.id)} class="group block w-full rounded-md text-left" title={t.common.edit}>
						<div class="num flex items-baseline gap-2 text-[11px] text-ink-3">
							{p.approx ? '≈ ' : ''}{p.start ? fmtIso(p.start) : t.common.notSet}{p.afterDraw ? ` · ${t.data.afterDrawShort}` : ''}
							<span class="ml-auto opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">{t.common.edit}</span>
						</div>
						<div class={['text-sm', p.label ? 'font-medium text-ink' : 'text-ink-3']}>{p.label || t.data.phaseUnnamed}</div>
						{#if p.regimen}<div class="text-xs text-ink-2">{p.regimen}</div>{/if}
					</button>
				{/if}
			</li>
		{/each}
	</ol>
</section>
