<script lang="ts" module>
	export const DROP = 'M5 0C6.3 2.7 10 5.3 10 8.5A5 5 0 0 1 0 8.5C0 5.3 3.7 2.7 5 0Z';

	type Pt = [number, number];

	// Points along a chain of cubic curves
	function curve(pen: Pt[], steps = 80): Pt[] {
		const out: Pt[] = [];
		for (let s = 0; s < (pen.length - 1) / 3; s++) {
			const [a, b, c, d] = pen.slice(s * 3, s * 3 + 4);
			for (let k = s ? 1 : 0; k <= steps; k++) {
				const t = k / steps, u = 1 - t;
				out.push([0, 1].map((i) => u ** 3 * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t ** 3 * d[i]) as Pt);
			}
		}
		return out;
	}

	// Outline of a pen stroke along the spine, its width following the pressure from start to end
	function brush(spine: Pt[], widest: number, pressure: (g: number) => number) {
		const n = spine.length - 1;
		const at = spine.map((p, k) => {
			const [a, b] = [spine[Math.max(k - 1, 0)], spine[Math.min(k + 1, n)]];
			const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
			return { p, n: [(a[1] - b[1]) / len, (b[0] - a[0]) / len], w: widest * pressure(k / n) + 0.25 };
		});
		const side = (sign: number) => at.map(({ p, n, w }) => `${(p[0] + sign * n[0] * w).toFixed(1)} ${(p[1] + sign * n[1] * w).toFixed(1)}`);
		return `M${side(1).join('L')}L${side(-1).reverse().join('L')}Z`;
	}

	// Pen swash under the wordmark in hundredths of an em, baseline at 86, swelling early and ending in a hairline
	const SPINE = curve([[18, 100], [160, 112], [420, 106], [560, 100], [650, 96], [720, 97], [758, 92]]);
	const SWASH = brush(SPINE, 3.6, (g) => Math.sin(Math.PI * g) ** 0.8 * (1.3 - g));
	const MIDDLE = `M${SPINE.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}`;
</script>

<script lang="ts">
	import { t } from '#lib/i18n/index.js';

	let {
		flagged = false,
		glint = false,
		flourish = false,
		replay = false,
		class: klass = ''
	}: { flagged?: boolean; glint?: boolean; flourish?: boolean; replay?: boolean; class?: string } = $props();
	const uid = $props.id();

	// A blood drop dots the i of "Sanguis", the flag colours the first five letters
	const name = $derived(t.app.name);
	const drop = $derived(name.lastIndexOf('i'));
	const flag = $derived(flagged ? [...name.slice(0, 5)] : []);
	const rest = $derived([...name.slice(flag.length)]);

	// With replay the swash draws itself again once per hover, never cut off while still drawing
	let runs = $state(0);
	let drawing = true;
	function redraw() {
		if (!flourish || !replay || drawing) return;
		drawing = true;
		runs++;
	}

	// Flag stripes as a highlight inside the drop, only drawn where it is big enough to read
	const STRIPES = ['#5bcefa', '#f5a9b8', '#ffffff', '#f5a9b8', '#5bcefa'];
	function arc(r: number) {
		const p = (deg: number) => `${(5 + r * Math.cos((deg * Math.PI) / 180)).toFixed(2)} ${(8.5 + r * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`;
		return `M${p(200)}A${r} ${r} 0 0 1 ${p(246)}`;
	}
</script>

{#snippet letter(c: string, i: number)}{#if i === drop}<span class="tittle"
			>ı<svg viewBox="0 0 10 13.5"
				><path d={DROP} />{#if glint}{#each STRIPES as stroke, i (i)}<path d={arc(3.75 - i * 0.19)} {stroke} class="glint" />{/each}{/if}</svg
			></span
		>{:else}{c}{/if}{/snippet}

{#snippet swash()}{#key runs}<svg class="flourish" viewBox="0 0 761 100" preserveAspectRatio="none"
			><mask id="{uid}-swash"
				><path
					class="draw"
					d={MIDDLE}
					pathLength="1"
					stroke="white"
					stroke-width="14"
					fill="none"
					stroke-linecap="round"
					onanimationend={() => (drawing = false)}
				/></mask
			><path d={SWASH} mask="url(#{uid}-swash)" /></svg
		>{/key}{/snippet}

<span class={['logo', klass]}>
	<span class="sr-only">{name}</span>
	<span aria-hidden="true" class={[flourish && 'flourished']} onpointerenter={redraw}
		>{#if flourish}{@render swash()}{/if}{#if flag.length}<span class="trans-flag"
				>{#each flag as c, i (i)}<span>{@render letter(c, i)}</span>{/each}</span
			>{/if}{#each rest as c, i (i)}{@render letter(c, flag.length + i)}{/each}</span
	>
</span>
