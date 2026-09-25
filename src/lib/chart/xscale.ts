import { bisectRight } from 'd3-array';
import { scaleUtc } from 'd3-scale';
import { fmtHrt, fmtMonth, hrtStartTime } from '../analysis';
import type { XMode } from '../state.svelte';

export interface Tick {
	t: number;
	x: number;
	label: string;
	major?: boolean;
}

export interface XScale {
	x: (t: number) => number;
	ticks: Tick[];
	/** Nearest data time for a pixel position */
	nearest: (px: number, times: number[]) => number | undefined;
}

const MONTH = 30.4375 * 86_400_000;

function timeTicks(domain: [number, number], range: [number, number], labelMode: 'date' | 'hrt', maxTicks: number, x: (t: number) => number): Tick[] {
	const start = hrtStartTime();
	if (labelMode === 'hrt' && start !== undefined) {
		const [m0, m1] = [(domain[0] - start) / MONTH, (domain[1] - start) / MONTH];
		const span = Math.max(1, m1 - m0);
		const step = [1, 3, 6, 12, 24].find((s) => span / s <= maxTicks) ?? 24;
		const ticks: Tick[] = [];
		for (let k = Math.ceil(m0 / step) * step; k <= m1; k += step) {
			const t = start + k * MONTH;
			ticks.push({ t, x: x(t), label: fmtHrt(t), major: k % 12 === 0 });
		}
		return ticks;
	}

	const scale = scaleUtc().domain(domain).range(range);
	return scale.ticks(Math.max(2, maxTicks)).map((d) => {
		const t = d.getTime();
		const jan = d.getUTCMonth() === 0;
		return { t, x: x(t), label: jan ? String(d.getUTCFullYear()) : fmtMonth(t), major: jan };
	});
}

/**
 * Builds the horizontal mapping. "time" is proportional to calendar time, "draws" and
 * "points" put every sample one step apart and interpolate anything in between.
 */
export function makeX(
	mode: XMode,
	positions: number[],
	domain: [number, number],
	range: [number, number],
	labelMode: 'date' | 'hrt',
	compact: boolean
): XScale {
	const [r0, r1] = range;
	const width = r1 - r0;
	const maxTicks = Math.max(2, Math.floor(width / (compact ? 90 : 72)));

	if (mode === 'time' || positions.length < 2) {
		const [d0, d1] = domain[0] === domain[1] ? [domain[0] - 30 * 86_400_000, domain[1] + 30 * 86_400_000] : domain;
		const x = (t: number) => r0 + ((t - d0) / (d1 - d0)) * width;
		const nearest = (px: number, times: number[]) => {
			let best: number | undefined;
			let dist = Infinity;
			for (const t of times) {
				const d = Math.abs(x(t) - px);
				if (d < dist) [best, dist] = [t, d];
			}
			return best;
		};
		return { x, ticks: timeTicks([d0, d1], range, labelMode, maxTicks, x), nearest };
	}

	const n = positions.length;
	const step = width / (n - 1);
	const xi = (i: number) => r0 + i * step;

	// Dates between samples land proportionally between their neighbours
	const x = (t: number) => {
		const i = bisectRight(positions, t) - 1;
		if (i < 0) return r0 - Math.min(step / 2, ((positions[0] - t) / MONTH) * (step / 6));
		if (i >= n - 1) return r1 + Math.min(step / 2, ((t - positions[n - 1]) / MONTH) * (step / 6));
		const f = (t - positions[i]) / (positions[i + 1] - positions[i]);
		return xi(i) + f * step;
	};

	const every = Math.max(1, Math.ceil(n / maxTicks));
	const ticks: Tick[] = positions
		.map((t, i) => ({ t, x: xi(i), label: labelMode === 'hrt' ? fmtHrt(t) : fmtMonth(t), major: i === 0 || i === n - 1 }))
		.filter((_, i) => i % every === 0 || (compact && i === n - 1));

	const nearest = (px: number, times: number[]) => {
		let best: number | undefined;
		let dist = Infinity;
		for (const t of times) {
			const d = Math.abs(x(t) - px);
			if (d < dist) [best, dist] = [t, d];
		}
		return best;
	};

	return { x, ticks, nearest };
}
