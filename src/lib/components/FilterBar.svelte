<script lang="ts">
	import { page } from '$app/state';
	import { BASES, KIND_ORDER } from '../analysis';
	import { t } from '../i18n';
	import { current } from '../profiles.svelte';
	import { applyDatePreset, resetSettings, settings, toggle } from '../state.svelte';
	import Popover from '../ui/Popover.svelte';
	import Segmented from '../ui/Segmented.svelte';

	const CHECK = 'rounded border-line-strong bg-surface text-[var(--ref-target)] checked:bg-[var(--ref-target)] indeterminate:bg-[var(--ref-target)]';

	// Axis, reference and display options only matter where charts are drawn
	const view = $derived(page.route.id === '/analyte/[id]' ? 'focus' : settings.view);
	const charts = $derived(view !== 'matrix' && view !== 'table');

	const hasHrt = $derived(!!current.built.hrtStart);
	const phases = $derived(current.built.phases);
	const labs = $derived(current.built.labs);

	const datePresets = $derived(
		(['all', 'pre', 'hrt', 'latest', 'year'] as const)
			.filter((p) => hasHrt || (p !== 'pre' && p !== 'hrt'))
			.filter((p) => p !== 'latest' || phases.length > 2)
			.map((value) => ({ value, label: t.filters.datePresets[value], title: t.filters.datePresetTitles[value] }))
	);

	const hiddenKinds = $derived(KIND_ORDER.length - settings.kinds.length);
	const extraFilters = $derived(
		settings.hiddenLabs.filter((l) => labs.includes(l)).length +
			settings.hiddenPhases.filter((p) => phases.some((x) => x.id === p)).length +
			Number(!settings.derived) +
			Number(settings.suspect === 'hide')
	);

	const baseline = $derived(current.therapy === 'none' ? t.data.baseline.none : t.data.baseline.hrt);

	function setDate(which: 'from' | 'to', value: string) {
		settings[which] = value || null;
		settings.datePreset = 'custom';
	}
</script>

<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
	<div class="flex flex-wrap items-center gap-1.5">
		<span class="label">{t.filters.dates}</span>
		<div class="inline-flex h-7 rounded-md border border-line bg-surface p-0.5" role="radiogroup" aria-label={t.filters.dates}>
			{#each datePresets as p (p.value)}
				<button
					type="button"
					role="radio"
					aria-checked={settings.datePreset === p.value}
					title={p.title}
					onclick={() => applyDatePreset(p.value)}
					class={[
						'rounded-[5px] px-2 text-xs font-medium whitespace-nowrap',
						settings.datePreset === p.value ? 'bg-ink text-surface' : 'text-ink-2 hover:bg-hover hover:text-ink'
					]}>{p.label}</button
				>
			{/each}
		</div>
		<input
			type="date"
			aria-label={t.filters.from}
			value={settings.from ?? ''}
			onchange={(e) => setDate('from', e.currentTarget.value)}
			class={['num h-7 rounded-md border-line bg-surface px-1.5 py-0 text-xs text-ink-2', !settings.from && 'empty']}
		/>
		<span class="text-ink-3">–</span>
		<input
			type="date"
			aria-label={t.filters.to}
			value={settings.to ?? ''}
			onchange={(e) => setDate('to', e.currentTarget.value)}
			class={['num h-7 rounded-md border-line bg-surface px-1.5 py-0 text-xs text-ink-2', !settings.to && 'empty']}
		/>
	</div>

	{#if charts}
		<Segmented
			label={t.filters.x}
			bind:value={settings.xMode}
			options={(['time', 'draws', 'points'] as const).map((value) => ({ value, label: t.filters.xModes[value], title: t.filters.xModeTitles[value] }))}
		/>
		{#if hasHrt}
			<Segmented
				bind:value={settings.xLabel}
				options={[
					{ value: 'date', label: t.filters.xLabels.date },
					{ value: 'hrt', label: t.filters.xLabels.hrt, title: t.filters.xLabelHrtTitle }
				]}
			/>
		{/if}

		<Segmented
			label={t.filters.y}
			bind:value={settings.yScale}
			options={[
				{ value: 'auto', label: t.filters.yScales.auto, title: t.filters.yAutoTitle },
				{ value: 'linear', label: t.filters.yScales.linear },
				{ value: 'log', label: t.filters.yScales.log }
			]}
		/>
		<Segmented
			bind:value={settings.yFit}
			options={(['refs', 'data'] as const).map((value) => ({ value, label: t.filters.yFit[value], title: t.filters.yFitTitles[value] }))}
		/>
	{/if}

	<Segmented
		label={t.filters.units}
		bind:value={settings.units}
		options={(['conv', 'si'] as const).map((value) => ({ value, label: t.filters.unitModes[value], title: t.filters.unitTitles[value] }))}
	/>

	<label class="flex items-center gap-1.5">
		<span class="label">{t.filters.judge}</span>
		<select bind:value={settings.basis} class="h-7 field-sizing-content rounded-md border-line bg-surface py-0 pr-7 pl-2 text-xs font-medium text-ink">
			{#each BASES as value (value)}
				<option {value}>{t.basis[value]}</option>
			{/each}
		</select>
	</label>

	{#if charts}
		<Popover label={t.filters.references} badge={hiddenKinds ? `−${hiddenKinds}` : undefined} title={t.filters.referencesTitle}>
			<div class="space-y-1">
				{#each KIND_ORDER as kind (kind)}
					<label class="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs hover:bg-hover">
						<input type="checkbox" checked={settings.kinds.includes(kind)} onchange={() => (settings.kinds = toggle(settings.kinds, kind))} class={CHECK} />
						<span class="inline-block h-3 w-1 rounded-full" style:background="var(--ref-{kind})"></span>
						<span class="text-ink">{t.kind[kind]}</span>
					</label>
				{/each}
			</div>
			<div class="mt-3 border-t border-line pt-3">
				<Segmented
					label={t.filters.fill}
					size="sm"
					bind:value={settings.bandFill}
					options={[
						{ value: 'primary', label: t.filters.fills.primary, title: t.filters.fillTitle },
						{ value: 'all', label: t.filters.fills.all },
						{ value: 'none', label: t.filters.fills.none }
					]}
				/>
			</div>
		</Popover>
	{/if}

	{#if view !== 'table'}
		<Popover label={t.filters.display} title={t.filters.displayTitle}>
			<div class="grid gap-2.5">
				{#if charts}
					<Segmented
						label={t.filters.labels}
						size="sm"
						bind:value={settings.labels}
						options={(['none', 'last', 'extremes', 'all'] as const).map((value) => ({ value, label: t.filters.labelModes[value] }))}
					/>
					<Segmented
						label={t.filters.line}
						size="sm"
						bind:value={settings.curve}
						options={(['linear', 'step', 'monotone'] as const).map((value) => ({ value, label: t.filters.curves[value] }))}
					/>
				{/if}
				{#if view === 'grid'}
					<Segmented
						label={t.filters.cards}
						size="sm"
						bind:value={settings.cardSize}
						options={[
							{ value: 's', label: 'S' },
							{ value: 'm', label: 'M' },
							{ value: 'l', label: 'L' }
						]}
					/>
				{/if}
				{#if view === 'grid' || view === 'matrix'}
					<Segmented
						label={t.filters.sort}
						size="sm"
						bind:value={settings.sort}
						options={(['group', 'name', 'count', 'status', 'recent'] as const).map((value) => ({ value, label: t.filters.sorts[value] }))}
					/>
				{/if}
				{#if charts}
					<label class="flex items-center gap-2 text-xs text-ink">
						<input type="checkbox" bind:checked={settings.showPhases} class={CHECK} />
						{t.filters.shadePhases}
					</label>
					<label class="flex items-center gap-2 text-xs text-ink">
						<input type="checkbox" bind:checked={settings.showEvents} class={CHECK} />
						{t.filters.phaseLines}
					</label>
				{/if}
			</div>
		</Popover>
	{/if}

	<Popover label={t.filters.data} badge={extraFilters} title={t.filters.dataTitle}>
		<div class="grid gap-3 text-xs">
			{#if labs.length > 1}
				<div>
					<div class="label mb-1">{t.filters.labs}</div>
					{#each labs as l (l)}
						<label class="flex items-center gap-2 py-0.5 text-ink">
							<input type="checkbox" checked={!settings.hiddenLabs.includes(l)} onchange={() => (settings.hiddenLabs = toggle(settings.hiddenLabs, l))} class={CHECK} />
							{l || t.common.noLab}
						</label>
					{/each}
				</div>
			{/if}
			{#if phases.length > 1}
				<div>
					<div class="label mb-1">{t.filters.phases}</div>
					{#each phases as p (p.id)}
						<label class="flex items-center gap-2 py-0.5 text-ink">
							<input type="checkbox" checked={!settings.hiddenPhases.includes(p.id)} onchange={() => (settings.hiddenPhases = toggle(settings.hiddenPhases, p.id))} class={CHECK} />
							{p.implicit ? baseline : p.label}
						</label>
					{/each}
				</div>
			{/if}
			<div class="grid gap-1.5">
				<label class="flex items-center gap-2 text-ink">
					<input type="checkbox" bind:checked={settings.derived} class={CHECK} />
					{t.filters.derived}
				</label>
				<Segmented
					label={t.filters.suspect}
					size="sm"
					bind:value={settings.suspect}
					options={(['flag', 'hide'] as const).map((value) => ({ value, label: t.filters.suspectModes[value] }))}
				/>
			</div>
			<button type="button" onclick={resetSettings} class="justify-self-start rounded-md border border-line px-2 py-1 text-ink-2 hover:bg-hover hover:text-ink">
				{t.filters.resetAll}
			</button>
		</div>
	</Popover>
</div>
