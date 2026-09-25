<script lang="ts" generics="T extends string">
	interface Option {
		value: T;
		label: string;
		title?: string;
	}

	interface Props {
		options: Option[];
		value: T;
		label?: string;
		size?: 'sm' | 'md';
	}

	let { options, value = $bindable(), label, size = 'md' }: Props = $props();
</script>

<div class="inline-flex items-center gap-1.5">
	{#if label}<span class="label">{label}</span>{/if}
	<div role="radiogroup" aria-label={label} class="inline-flex rounded-md border border-line bg-surface p-0.5">
		{#each options as o (o.value)}
			<button
				type="button"
				role="radio"
				aria-checked={value === o.value}
				title={o.title}
				onclick={() => (value = o.value)}
				class={[
					'rounded-[5px] font-medium whitespace-nowrap transition-colors',
					size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs',
					value === o.value ? 'bg-ink text-surface' : 'text-ink-2 hover:bg-hover hover:text-ink'
				]}
			>
				{o.label}
			</button>
		{/each}
	</div>
</div>
