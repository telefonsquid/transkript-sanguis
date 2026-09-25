<script lang="ts">
	import { untrack } from 'svelte';
	import type { Sex, Therapy } from '../data/types';
	import { t } from '../i18n';
	import type { NewProfile } from '../profiles.svelte';
	import { TINT } from './TherapyName.svelte';

	interface Props {
		initial?: Partial<NewProfile>;
		/** Editing an existing profile hides the HRT start, which then lives in the medication timeline */
		editing?: boolean;
		submitLabel: string;
		onsave: (values: NewProfile) => void;
		oncancel?: () => void;
	}

	let { initial = {}, editing = false, submitLabel, onsave, oncancel }: Props = $props();

	// Form fields start from the initial values and are edited locally until saved
	const init = untrack(() => initial);
	let name = $state(init.name ?? '');
	let therapy: Therapy = $state(init.therapy ?? 'none');
	let sex: Sex | '' = $state(init.sex ?? '');
	let birth = $state(init.birth ?? '');
	let height = $state(init.height ? String(init.height) : '');
	let hrtStart = $state(init.hrtStart ?? '');
	let hrtStartApprox = $state(init.hrtStartApprox ?? false);
	let tried = $state(false);

	const uid = $props.id();

	/** On HRT the sex assigned at birth follows from the therapy unless set otherwise */
	const impliedSex = $derived<Sex | ''>(therapy === 'feminizing' ? 'male' : therapy === 'masculinizing' ? 'female' : '');

	const birthOk = $derived(!birth || /^\d{4}(-\d{2}-\d{2})?$/.test(birth.trim()));
	const nameOk = $derived(name.trim().length > 0);

	function submit(e: SubmitEvent) {
		e.preventDefault();
		tried = true;
		if (!nameOk || !birthOk) return;
		onsave({
			name: name.trim(),
			therapy,
			sex: (sex || impliedSex) || undefined,
			birth: birth.trim() || undefined,
			height: Number(height) || undefined,
			hrtStart: therapy !== 'none' && hrtStart ? hrtStart : undefined,
			hrtStartApprox
		});
	}

	const input = 'h-9 w-full rounded-md border-line bg-surface px-2.5 text-sm';

	// The chosen therapy card wears its flag colour
	const picked = { none: 'border-ink bg-surface-2', feminizing: 'border-fem-ink bg-fem/15', masculinizing: 'border-masc-ink bg-masc/15' };
	const dot = { none: 'checked:bg-ink', feminizing: 'checked:bg-fem-ink', masculinizing: 'checked:bg-masc-ink' };
</script>

<form onsubmit={submit} class="grid gap-5" novalidate>
	<div class="grid gap-1">
		<label for="{uid}-name" class="text-sm font-medium">{t.profile.name}</label>
		<input id="{uid}-name" bind:value={name} class={input} autocomplete="off" maxlength="60" aria-describedby="{uid}-name-hint" />
		<span id="{uid}-name-hint" class={['text-xs', tried && !nameOk ? 'text-[var(--critical)]' : 'text-ink-3']}>{tried && !nameOk ? t.profile.nameRequired : t.profile.nameHint}</span>
	</div>

	<fieldset class="grid gap-2">
		<legend class="mb-1 text-sm font-medium">{t.profile.therapy}</legend>
		<div class="grid gap-2 sm:grid-cols-3">
			{#each ['none', 'feminizing', 'masculinizing'] as const as value (value)}
				<label class={['flex cursor-pointer flex-col gap-0.5 rounded-lg border p-3', therapy === value ? picked[value] : 'border-line hover:bg-hover']}>
					<span class={['flex items-center gap-2 text-sm font-medium', TINT[value]]}>
						<input type="radio" name="therapy" {value} bind:group={therapy} class={['border-line-strong', dot[value]]} />
						{t.profile.therapies[value]}
					</span>
					<span class="pl-6 text-xs text-ink-3">{t.profile.therapyDesc[value]}</span>
				</label>
			{/each}
		</div>
		<span class="text-xs text-ink-3">{t.profile.therapyHint}</span>
	</fieldset>

	<div class="grid gap-4 sm:grid-cols-2">
		{#if therapy !== 'none' && !editing}
			<div class="grid gap-1">
				<label for="{uid}-hrt" class="text-sm font-medium">{t.profile.hrtStart} <span class="font-normal text-ink-3">({t.common.optional})</span></label>
				<input id="{uid}-hrt" type="date" bind:value={hrtStart} class={[input, !hrtStart && 'empty']} />
				<label class="flex items-center gap-2 text-xs text-ink-2">
					<input type="checkbox" bind:checked={hrtStartApprox} class="rounded border-line-strong" />
					{t.profile.approx}
				</label>
				<span class="text-xs text-ink-3">{t.profile.hrtStartHint}</span>
			</div>
		{/if}

		<div class="grid gap-1">
			<label for="{uid}-sex" class="text-sm font-medium">{t.profile.sex}</label>
			<select id="{uid}-sex" bind:value={sex} class={[input, !sex && !impliedSex && 'empty']} aria-describedby="{uid}-sex-hint">
				<option value="">{impliedSex ? `${t.profile.sexes[impliedSex]} (${t.profile.therapyShort[therapy]})` : t.profile.sexes.unset}</option>
				<option value="female">{t.profile.sexes.female}</option>
				<option value="male">{t.profile.sexes.male}</option>
			</select>
			<span id="{uid}-sex-hint" class="text-xs text-ink-3">{t.profile.sexHint}</span>
		</div>

		<div class="grid gap-1">
			<label for="{uid}-birth" class="text-sm font-medium">{t.profile.birth} <span class="font-normal text-ink-3">({t.common.optional})</span></label>
			<input id="{uid}-birth" bind:value={birth} placeholder="1995 / 1995-06-30" class={input} inputmode="numeric" autocomplete="off" aria-describedby="{uid}-birth-hint" />
			<span id="{uid}-birth-hint" class={['text-xs', birthOk ? 'text-ink-3' : 'text-[var(--critical)]']}>{birthOk ? t.profile.birthHint : t.profile.invalidBirth}</span>
		</div>

		<div class="grid gap-1">
			<label for="{uid}-height" class="text-sm font-medium">{t.profile.height} <span class="font-normal text-ink-3">({t.common.optional})</span></label>
			<input id="{uid}-height" bind:value={height} type="number" min="100" max="230" class={input} aria-describedby="{uid}-height-hint" />
			<span id="{uid}-height-hint" class="text-xs text-ink-3">{t.profile.heightHint}</span>
		</div>
	</div>

	<div class="flex gap-2">
		<button type="submit" class="rounded-md bg-ink px-4 py-2 text-sm font-medium text-surface hover:opacity-90">{submitLabel}</button>
		{#if oncancel}
			<button type="button" onclick={oncancel} class="rounded-md border border-line px-4 py-2 text-sm hover:bg-hover">{t.common.cancel}</button>
		{/if}
	</div>
</form>
