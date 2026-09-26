<script lang="ts" module>
	export const DROP = 'M5 0C6.3 2.7 10 5.3 10 8.5A5 5 0 0 1 0 8.5C0 5.3 3.7 2.7 5 0Z';
</script>

<script lang="ts">
	import { t } from '#lib/i18n/index.js';

	let {
		flagged = false,
		glint = false,
		flourish = false,
		class: klass = ''
	}: { flagged?: boolean; glint?: boolean; flourish?: boolean; class?: string } = $props();
	const uid = $props.id();

	// Every "i" loses its dot to a blood drop, the flag colours the first five letters
	const name = $derived(t.app.name);
	const flag = $derived(flagged ? [...name.slice(0, 5)] : []);
	const rest = $derived([...name.slice(flag.length)]);

	// Flag stripes as a highlight inside the drop, only drawn where it is big enough to read
	const STRIPES = ['#5bcefa', '#f5a9b8', '#ffffff', '#f5a9b8', '#5bcefa'];
	function arc(r: number) {
		const p = (deg: number) => `${(5 + r * Math.cos((deg * Math.PI) / 180)).toFixed(2)} ${(8.5 + r * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`;
		return `M${p(200)}A${r} ${r} 0 0 1 ${p(246)}`;
	}

	// Pen stroke under the wordmark, in hundredths of an em: a curl, a swelling sweep and a hairline tip that lets a drop fall
	type Pt = [number, number];
	const PEN: Pt[] = [[112, 18], [80, 4], [22, 28], [72, 31], [260, 42], [560, 34], [836, 8]];
	const TIP = PEN[PEN.length - 1];

	// Thin upstroke through the curl, a swell early in the sweep, then a hairline to the tip
	const weight = (part: number, t: number) => (part ? (1 - t) ** 1.4 * (0.5 + 2.4 * t) : 0.5 * t ** 1.5);

	// Outline of the stroke, its width following the pen pressure
	function brush(pen: Pt[], widest: number, steps = 60) {
		const spine: { p: Pt; n: Pt; w: number }[] = [];
		const parts = (pen.length - 1) / 3;
		for (let s = 0; s < parts; s++) {
			const [a, b, c, d] = pen.slice(s * 3, s * 3 + 4);
			for (let k = s ? 1 : 0; k <= steps; k++) {
				const t = k / steps, u = 1 - t;
				const p: Pt = [0, 1].map((i) => u ** 3 * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t ** 3 * d[i]) as Pt;
				const v = [0, 1].map((i) => 3 * u * u * (b[i] - a[i]) + 6 * u * t * (c[i] - b[i]) + 3 * t * t * (d[i] - c[i]));
				const len = Math.hypot(v[0], v[1]) || 1;
				spine.push({ p, n: [-v[1] / len, v[0] / len], w: widest * weight(s, t) + 0.25 });
			}
		}
		const side = (sign: number) => spine.map(({ p, n, w }) => `${(p[0] + sign * n[0] * w).toFixed(1)} ${(p[1] + sign * n[1] * w).toFixed(1)}`);
		return `M${side(1).join('L')}L${side(-1).reverse().join('L')}Z`;
	}
	const SWASH = brush(PEN, 4.4);
	const MIDDLE = `M${PEN[0]}C${PEN.slice(1, 4).join(' ')}C${PEN.slice(4).join(' ')}`;
</script>

{#snippet letter(c: string)}{#if c === 'i'}<span class="tittle"
			>ı<svg viewBox="0 0 10 13.5"
				><path d={DROP} />{#if glint}{#each STRIPES as stroke, i (i)}<path d={arc(3.75 - i * 0.19)} {stroke} class="glint" />{/each}{/if}</svg
			></span
		>{:else}{c}{/if}{/snippet}

<span class={['logo', flagged && 'flag-name', klass]}>
	<span class="sr-only">{name}</span>
	<span aria-hidden="true" class={[flourish && 'flourished']}
		>{#if flag.length}<span class="trans-flag">{#each flag as c, i (i)}<span>{@render letter(c)}</span>{/each}</span>{/if}{#each rest as c, i (i)}{@render letter(c)}{/each}{#if flourish}<svg
				class="flourish"
				viewBox="0 0 860 50"
				><mask id="{uid}-pen"><path class="draw" d={MIDDLE} pathLength="1" stroke="white" stroke-width="12" fill="none" stroke-linecap="round" /></mask><path
					class="swash"
					d={SWASH}
					mask="url(#{uid}-pen)"
				/><path class="dot" d={DROP} transform="translate({TIP[0] - 3.5} {TIP[1] + 5}) scale(0.9)" style:--delay="800ms" /></svg
			>{/if}</span
	>
</span>
