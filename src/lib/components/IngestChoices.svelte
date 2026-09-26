<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '../i18n';

	/** Compact cards for pages that already hold results */
	let { compact = false }: { compact?: boolean } = $props();

	const choices = $derived([
		{ id: 'hand', href: resolve('/data/manual'), title: t.ingest.manualTitle, body: t.ingest.manualShort },
		{ id: 'ai', href: resolve('/data/agent'), title: t.ingest.agentTitle, body: t.ingest.agentShort },
		{ id: 'file', href: resolve('/data/import'), title: t.ingest.importCard, body: t.ingest.importShort }
	]);
</script>

<!-- Three ways in, each with its own colour and a small picture that comes alive on hover -->
<div class={['grid sm:grid-cols-3', compact ? 'gap-2.5' : 'gap-3']}>
	{#each choices as c, i (c.id)}
		<a href={c.href} class={['choice rise', c.id, compact ? 'items-center gap-3 p-3' : 'flex-col gap-3 p-4']} style:--i={i}>
			<span class={['tile', compact ? 'size-10' : 'size-12']} aria-hidden="true">
				{#if c.id === 'hand'}
					<svg viewBox="0 0 24 24">
						<path class="scribble" d="M4 19.5c2-1.6 3.4-1.6 4.6 0s2.6 1.6 4.4 0" pathLength="1" />
						<g class="pencil">
							<path d="M14.5 4.5l3 3L9 16l-3.8.8L6 13z" />
							<path d="M12.8 6.2l3 3" />
						</g>
					</svg>
				{:else if c.id === 'ai'}
					<svg viewBox="0 0 24 24">
						<path d="M6 3.5h7.5L18 8v12.5H6z" />
						<path d="M13.5 3.5V8H18" />
						<path class="line l1" d="M8.8 12h6.4" />
						<path class="line l2" d="M8.8 15h6.4" />
						<path class="line l3" d="M8.8 18h4" />
						<path class="spark" d="M19 1.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1L16 4.5l2.1-.9z" />
					</svg>
				{:else}
					<svg viewBox="0 0 24 24">
						<path d="M4 14v4.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V14" />
						<path d="M4 14h4l1.5 2h5l1.5-2h4" />
						<g class="arrow">
							<path d="M12 3.5v8.5" />
							<path d="M8.5 8.8 12 12.3l3.5-3.5" />
						</g>
					</svg>
				{/if}
			</span>
			<span class="grid min-w-0 flex-1 gap-0.5">
				<span class={['font-semibold text-ink', compact ? 'text-sm' : 'text-base']}>{c.title}</span>
				<span class="text-xs text-ink-2">{c.body}</span>
			</span>
			<span class={['go', !compact && 'self-end']} aria-hidden="true">→</span>
		</a>
	{/each}
</div>

<style>
	.choice {
		--accent: var(--ink-2);
		position: relative;
		display: flex;
		border-radius: 0.75rem;
		border: 1px solid var(--border);
		background: var(--surface);
		transition:
			translate 220ms cubic-bezier(0.3, 1.4, 0.5, 1),
			box-shadow 220ms,
			border-color 220ms,
			background-color 220ms;
	}
	.choice:hover,
	.choice:focus-visible {
		translate: 0 -2px;
		border-color: color-mix(in srgb, var(--accent) 55%, transparent);
		background: color-mix(in srgb, var(--accent) 5%, var(--surface));
		box-shadow: var(--shadow);
	}
	.hand {
		--accent: var(--ref-clinical);
	}
	.file {
		--accent: var(--ref-trans);
	}

	/* The AI card wears a flag gradient border, the quickest way in */
	.ai {
		--accent: var(--masc-ink);
		border: 1.5px solid transparent;
		background:
			linear-gradient(var(--surface), var(--surface)) padding-box,
			linear-gradient(120deg, var(--masc), var(--fem), var(--masc)) border-box;
		background-size: 100% 100%, 200% 100%;
		transition:
			translate 220ms cubic-bezier(0.3, 1.4, 0.5, 1),
			box-shadow 220ms,
			background-position 900ms ease;
	}
	.ai:hover,
	.ai:focus-visible {
		background:
			linear-gradient(color-mix(in srgb, var(--fem) 6%, var(--surface)), color-mix(in srgb, var(--fem) 6%, var(--surface))) padding-box,
			linear-gradient(120deg, var(--masc), var(--fem), var(--masc)) border-box;
		background-size: 100% 100%, 200% 100%;
		background-position: 0 0, 100% 0;
	}
	.ai .tile {
		background: linear-gradient(135deg, color-mix(in srgb, var(--masc) 26%, var(--surface)), color-mix(in srgb, var(--fem) 30%, var(--surface)));
	}

	.tile {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		border-radius: 0.65rem;
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 15%, var(--surface));
	}
	.tile svg {
		width: 60%;
		height: 60%;
		overflow: visible;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.ai .tile svg {
		color: var(--ink);
	}

	.go {
		color: var(--ink-3);
		transition:
			translate 220ms cubic-bezier(0.3, 1.4, 0.5, 1),
			color 220ms;
	}
	.choice:hover .go,
	.choice:focus-visible .go {
		translate: 4px 0;
		color: var(--accent);
	}

	/* By hand: the pencil wiggles and writes a line */
	.pencil {
		transform-box: fill-box;
		transform-origin: 20% 90%;
	}
	.scribble {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
	}
	.choice:hover .pencil {
		animation: wiggle 700ms ease-in-out;
	}
	.choice:hover .scribble {
		animation: write 700ms ease-out forwards;
	}
	@keyframes wiggle {
		25% {
			transform: rotate(-10deg) translateX(-1px);
		}
		60% {
			transform: rotate(6deg) translateX(1px);
		}
	}
	@keyframes write {
		to {
			stroke-dashoffset: 0;
		}
	}

	/* With AI: the sparkle turns and the lines fill in one after another */
	.spark {
		fill: var(--fem-ink);
		stroke: none;
		transform-box: fill-box;
		transform-origin: center;
	}
	.choice:hover .spark {
		animation: twinkle 900ms cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	.choice:hover .line {
		animation: fill-in 600ms ease-out both;
	}
	.choice:hover .l2 {
		animation-delay: 120ms;
	}
	.choice:hover .l3 {
		animation-delay: 240ms;
	}
	@keyframes twinkle {
		40% {
			transform: rotate(90deg) scale(1.5);
		}
		to {
			transform: rotate(180deg) scale(1);
		}
	}
	@keyframes fill-in {
		from {
			stroke-dasharray: 0 20;
		}
		to {
			stroke-dasharray: 20 0;
		}
	}

	/* Import: the arrow drops into the tray */
	.choice:hover .arrow {
		animation: drop 700ms cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	@keyframes drop {
		30% {
			transform: translateY(-3px);
		}
		60% {
			transform: translateY(3px);
		}
	}
</style>
