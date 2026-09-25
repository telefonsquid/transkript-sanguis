<script lang="ts">
	import { t } from '../i18n';
	import { identify, type Identified } from '../io';

	interface Props {
		paste?: boolean;
		onresult: (result: Identified) => void;
	}

	let { paste = true, onresult }: Props = $props();

	let text = $state('');
	let error = $state('');
	let over = $state(false);

	function check(raw: string) {
		const result = identify(raw);
		error = result.kind === 'error' ? (result.reason === 'json' ? t.agent.invalidJson : t.agent.wrongFormat) : '';
		onresult(result);
	}

	async function readFile(file: File | undefined) {
		if (!file) return;
		try {
			check(await file.text());
		} catch {
			error = t.io.readError;
		}
	}

	function ondrop(e: DragEvent) {
		e.preventDefault();
		over = false;
		readFile(e.dataTransfer?.files[0]);
	}
</script>

<div
	role="region"
	aria-label={t.agent.step3}
	ondragover={(e) => {
		e.preventDefault();
		over = true;
	}}
	ondragleave={() => (over = false)}
	{ondrop}
	class={['grid gap-2 rounded-lg border-2 border-dashed p-3', over ? 'border-[var(--ref-target)] bg-hover' : 'border-line']}
>
	{#if paste}
		<textarea bind:value={text} rows="8" placeholder={t.agent.paste} class="num w-full rounded-md border-line bg-surface p-2 font-mono text-xs"></textarea>
	{/if}
	<div class="flex flex-wrap items-center gap-3">
		{#if paste}
			<button type="button" onclick={() => check(text)} disabled={!text.trim()} class="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-surface hover:opacity-90 disabled:opacity-40">{t.agent.check}</button>
			<span class="text-xs text-ink-3">{t.agent.dropFile}</span>
		{/if}
		<input type="file" accept="application/json,.json,.txt,.md" onchange={(e) => readFile(e.currentTarget.files?.[0])} class="text-xs file:mr-2 file:rounded-md file:border file:border-line file:bg-surface-2 file:px-2 file:py-1 file:text-xs" />
	</div>
	{#if error}<p class="text-xs text-[var(--critical)]">{error}</p>{/if}
</div>
