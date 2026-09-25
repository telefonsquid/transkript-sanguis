import { boundsFor, convert, fallbackRef, fmtBounds, fmtValue, primaryRef, refsFor, statusOf, unitOf } from './analysis';
import type { ChartBand, ChartPoint, ChartSeries } from './chart/types';
import type { Analyte, Measurement } from './data/types';
import { nameOf, tx } from './i18n';
import { lookup } from './profiles.svelte';
import { filtered, settings } from './state.svelte';

/** Chart points in the current display units, judged against the current basis */
export function toPoints(a: Analyte, ms: Measurement[]): ChartPoint[] {
	return ms.map((m) => ({
		t: m.t,
		v: convert(a, m.value, settings.units),
		m,
		text: fmtValue(m, settings.units),
		status: statusOf(m, boundsFor(a, m, settings.basis)),
		lab: m.labRef
			? {
					low: m.labRef.low === undefined ? undefined : convert(a, m.labRef.low, settings.units),
					high: m.labRef.high === undefined ? undefined : convert(a, m.labRef.high, settings.units)
				}
			: undefined
	}));
}

export function seriesFor(id: string, color = 'var(--line)'): ChartSeries {
	const a = lookup(id)!;
	return {
		id,
		name: nameOf(a),
		color,
		unit: unitOf(a, settings.units),
		points: toPoints(a, filtered.byAnalyte.get(id) ?? [])
	};
}

/**
 * Curated references as chart bands. The one the status is judged against is filled,
 * the rest stay available as rails and legend rows.
 */
export function bandsFor(a: Analyte, fill: 'primary' | 'all' | 'none' = settings.bandFill): ChartBand[] {
	const refs = refsFor(a);
	const hasLab = (filtered.byAnalyte.get(a.id) ?? []).some((m) => m.labRef?.low !== undefined || m.labRef?.high !== undefined);
	const basisRef =
		settings.basis === 'primary'
			? (primaryRef(a) ?? (hasLab ? undefined : fallbackRef(a)))
			: settings.basis === 'lab'
				? undefined
				: refs.find((r) => r.kind === settings.basis);

	return refs
		.filter((r) => settings.kinds.includes(r.kind))
		.map((r) => ({
			id: r.id,
			kind: r.kind,
			label: tx(r.label),
			low: r.low === undefined ? undefined : convert(a, r.low, settings.units),
			high: r.high === undefined ? undefined : convert(a, r.high, settings.units),
			range: `${fmtBounds(a, r, settings.units)} ${unitOf(a, settings.units)}`,
			filled: fill === 'all' || (fill === 'primary' && r === basisRef)
		}));
}

export function useLog(a: Analyte): boolean {
	return settings.yScale === 'log' || (settings.yScale === 'auto' && a.scale === 'log');
}

export function positionsFor(series: ChartSeries[]): number[] {
	if (settings.xMode === 'draws') return filtered.drawTimes;
	return [...new Set(series.flatMap((s) => s.points.map((p) => p.t)))].sort((x, y) => x - y);
}
