import { convert, fmtBounds, fmtValue, unitOf, type Status, type Units } from './analysis';
import type { ChartBand, ChartPoint } from './chart/types';
import type { Analyte, Measurement, Reference } from './data/types';
import { t, tx } from './i18n';

const inUnits = (a: Analyte, v: number | undefined, units: Units) => (v === undefined ? undefined : convert(a, v, units));

/** Chart points in display units, each with the status it was judged to */
export function toPoints(a: Analyte, ms: Measurement[], units: Units, statusOf: (m: Measurement) => Status): ChartPoint[] {
	return ms.map((m) => ({ t: m.t, v: convert(a, m.value, units), m, text: fmtValue(a, m, units), status: statusOf(m) }));
}

/** Curated references as chart bands, `filled` decides which are drawn and which stay rails */
export function refBands(a: Analyte, refs: Reference[], units: Units, filled: (r: Reference) => boolean): ChartBand[] {
	return refs.map((r) => ({
		id: r.id,
		kind: r.kind,
		label: tx(r.label),
		low: inUnits(a, r.low, units),
		high: inUnits(a, r.high, units),
		range: `${fmtBounds(a, r, units)} ${unitOf(a, units)}`,
		filled: filled(r)
	}));
}

/** Printed lab ranges as one band that steps where the lab changed them */
export function labBand(a: Analyte, ms: Measurement[], units: Units, filled: boolean): ChartBand | undefined {
	const printed = ms.filter((m) => m.labRef && (m.labRef.low !== undefined || m.labRef.high !== undefined));
	const last = printed.at(-1)?.labRef;
	if (!last) return undefined;
	return {
		id: 'lab',
		kind: 'lab',
		label: t.kind.lab,
		steps: printed.map((m) => ({ t: m.t, low: inUnits(a, m.labRef!.low, units), high: inUnits(a, m.labRef!.high, units) })),
		range: `${fmtBounds(a, last, units)} ${unitOf(a, units)}`,
		filled
	};
}
