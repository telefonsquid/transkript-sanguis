import { basisRef, fmtHrt, fmtValue, phaseName, refsFor, unitOf, type Units } from './analysis';
import type { ChartBand, ChartSeries } from './chart/types';
import type { Measurement } from './data/types';
import { nameOf } from './i18n';
import { current, lookup } from './profiles.svelte';
import { labBand, refBands, toPoints } from './series';
import { filtered, settings } from './state.svelte';

/*
 * Chart inputs for the active profile under the current settings.
 * The pure helpers in `analysis` and `series` get the profile and settings from here.
 */

export const judge = (m: Measurement) => filtered.judge(m);

export const fmtMeasured = (m: Measurement, units: Units = settings.units) => fmtValue(lookup(m.analyte), m, units);

export const phaseLabel = (id: string) => phaseName(current.phase(id), current.therapy);

export const hrtLabel = (time: number) => fmtHrt(time, current.hrtStart);

export function seriesFor(id: string, color = 'var(--line)'): ChartSeries {
	const a = lookup(id)!;
	return {
		id,
		name: nameOf(a),
		color,
		unit: unitOf(a, settings.units),
		points: toPoints(a, filtered.byAnalyte.get(id) ?? [], settings.units, (m) => judge(m).status)
	};
}

/**
 * Reference bands of a value: the printed lab range first, then the curated ones the settings show.
 * The one the status is judged against is filled, the rest stay available as rails and legend rows.
 */
export function bandsFor(id: string, fill: 'primary' | 'all' | 'none' = settings.bandFill): ChartBand[] {
	const a = lookup(id)!;
	const judgedBy = basisRef(a, settings.basis, current.subject);
	const refs = refsFor(a, current.subject).filter((r) => settings.kinds.includes(r.kind));
	const lab = labBand(a, filtered.byAnalyte.get(id) ?? [], settings.units, settings.kinds.includes('lab'));
	const curated = refBands(a, refs, settings.units, (r) => fill === 'all' || (fill === 'primary' && r === judgedBy));
	return lab ? [lab, ...curated] : curated;
}

export function useLog(id: string): boolean {
	return settings.yScale === 'log' || (settings.yScale === 'auto' && lookup(id)?.scale === 'log');
}

/** Everything a chart takes from the profile and the display settings */
export function chartProps(series: ChartSeries[]) {
	const times = series.flatMap((s) => s.points.map((p) => p.t)).sort((x, y) => x - y);
	const positions = settings.xMode === 'draws' ? filtered.drawTimes : times.filter((t, i) => t !== times[i - 1]);
	return {
		xMode: settings.xMode,
		positions,
		domain: filtered.domain,
		xLabel: settings.xLabel,
		showPhases: settings.showPhases,
		showEvents: settings.showEvents,
		labels: settings.labels,
		curve: settings.curve,
		fitBands: settings.yFit === 'refs',
		units: settings.units,
		phases: current.built.phases,
		hrtStart: current.hrtStart,
		therapy: current.therapy
	};
}
