<script lang="ts">
	import { t } from '#lib/i18n/index.js';
	import { motion } from '#lib/motion.svelte.js';

	let { active }: { active: boolean } = $props();

	let bar: HTMLElement;
	let shown = $state(false);

	// Rushes ahead, then crawls and never quite arrives: a third after 0.3 s, 60 % after 1.5 s, 90 % after 15 s
	const CRAWL: Keyframe[] = [
		{ offset: 0, transform: 'translateX(-100%)', easing: 'ease-out' },
		{ offset: 0.02, transform: 'translateX(-65%)', easing: 'ease-out' },
		{ offset: 0.1, transform: 'translateX(-40%)', easing: 'ease-out' },
		{ offset: 0.33, transform: 'translateX(-20%)', easing: 'ease-out' },
		{ offset: 1, transform: 'translateX(-10%)' }
	];

	$effect(() => {
		if (!active) return;

		// Fast pages never show the bar
		let crawl: Animation | undefined;
		const timer = setTimeout(() => {
			shown = true;
			bar.getAnimations().forEach((a) => a.cancel());
			if (motion.reduced) return Object.assign(bar.style, { transform: 'none', opacity: '1' });

			bar.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, fill: 'forwards' });
			crawl = bar.animate(CRAWL, { duration: 15000, fill: 'forwards' });
		}, 120);

		return () => {
			clearTimeout(timer);
			if (!shown) return;
			shown = false;
			if (motion.reduced) return Object.assign(bar.style, { transform: '', opacity: '' });

			// Run to the end from wherever the crawl got to, then fade
			crawl?.commitStyles();
			crawl?.cancel();
			bar.animate([{ transform: 'translateX(0)' }], { duration: 240, easing: 'cubic-bezier(0.3, 0.7, 0.2, 1)', fill: 'forwards' });
			bar.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, delay: 180, fill: 'forwards' });
		};
	});
</script>

<div class="progress" aria-hidden="true"><div bind:this={bar}></div></div>
{#if shown}<span class="sr-only" role="status">{t.common.loading}</span>{/if}

<style>
	.progress {
		position: fixed;
		inset: 0 0 auto;
		z-index: 70;
		height: 3px;
		pointer-events: none;
		view-transition-name: progress;
	}
	.progress > div {
		position: relative;
		height: 100%;
		opacity: 0;
		transform: translateX(-100%);
		border-radius: 0 3px 3px 0;
		background: linear-gradient(to right, transparent, var(--blood) 30%);
	}

	/* Glowing head so the edge reads as moving */
	.progress > div::after {
		content: '';
		position: absolute;
		right: 0;
		width: 90px;
		height: 100%;
		border-radius: inherit;
		box-shadow:
			0 0 10px var(--blood),
			0 0 4px var(--blood);
		opacity: 0.8;
	}
</style>
