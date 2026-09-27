import { BASELINE, MONTH, YEAR, analyteById, printedDecimals, toTime, type Bounds, type ResolvedPhase } from './data';
import type { Analyte, Input, Measurement, Range, Therapy } from './data/types';
import { locale, nameOf, t, tx } from './i18n';

export * from './data/judge';

export type Units = 'conv' | 'si';

/** Name of the reference behind some limits, the lab range has none of its own */
export const boundsLabel = (b: Bounds): string => (b.ref ? tx(b.ref.label) : t.kind.lab);

export function convert(a: Analyte, v: number, units: Units): number {
	return units === 'si' && a.si ? v * a.si.factor : v;
}

export function unitOf(a: Analyte, units: Units): string {
	return units === 'si' && a.si ? a.si.unit : a.unit;
}

export function decimalsOf(a: Analyte, units: Units): number {
	return units === 'si' && a.si ? (a.si.decimals ?? a.decimals) : a.decimals;
}

export function fmtNum(v: number, decimals: number): string {
	return v.toLocaleString(locale(), { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: false });
}

/** Printed values keep their printed precision, anything converted or computed uses the analyte's */
export function fmtValue(a: Analyte | undefined, m: Measurement, units: Units): string {
	const prefix = m.censor ?? '';
	if (!a) return prefix + m.raw;
	if ((units === 'conv' || !a.si) && !m.derived && !m.printedUnit) {
		return prefix + fmtNum(m.value, printedDecimals(m.raw));
	}
	return prefix + fmtNum(convert(a, m.value, units), decimalsOf(a, units));
}

export function fmtBound(a: Analyte, v: number, units: Units): string {
	const c = convert(a, v, units);
	const rounded = +c.toFixed(Math.max(decimalsOf(a, units), Math.abs(c) < 1 ? 2 : 0));

	// Trailing zeros dropped, "0.50" reads as "0.5"
	return fmtNum(rounded, (String(rounded).split('.')[1] ?? '').length);
}

export function fmtBounds(a: Analyte, b: { low?: number; high?: number }, units: Units): string {
	if (b.low !== undefined && b.high !== undefined) return `${fmtBound(a, b.low, units)} – ${fmtBound(a, b.high, units)}`;
	if (b.high !== undefined) return `< ${fmtBound(a, b.high, units)}`;
	if (b.low !== undefined) return `> ${fmtBound(a, b.low, units)}`;
	return '—';
}

/** Printed lab range in the printed unit, without the rounding of catalogue bounds */
export function fmtLabRef(r: Range | undefined): string {
	if (!r) return '—';
	const f = (v: number) => v.toLocaleString(locale(), { maximumFractionDigits: 6, useGrouping: false });
	const { low, high } = r.printed;
	const bounds =
		low !== undefined && high !== undefined ? `${f(low)} – ${f(high)}` : high !== undefined ? `< ${f(high)}` : low !== undefined ? `> ${f(low)}` : '';
	return [bounds, r.note].filter(Boolean).join(' · ') || '—';
}

const formatters = new Map<string, Intl.DateTimeFormat>();

const DATE_FORMATS: Record<'long' | 'short' | 'day', Intl.DateTimeFormatOptions> = {
	long: { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' },
	short: { month: 'short', year: '2-digit', timeZone: 'UTC' },
	day: { day: 'numeric', month: 'short', timeZone: 'UTC' }
};

function dateFormat(kind: keyof typeof DATE_FORMATS): Intl.DateTimeFormat {
	const key = `${locale()}:${kind}`;
	let f = formatters.get(key);
	if (!f) {
		f = new Intl.DateTimeFormat(locale(), DATE_FORMATS[kind]);
		formatters.set(key, f);
	}
	return f;
}

export const fmtDate = (t: number) => dateFormat('long').format(t);
export const fmtMonth = (t: number) => dateFormat('short').format(t);
export const fmtDay = (t: number) => dateFormat('day').format(t);
export const fmtIso = (date: string) => fmtDate(toTime(date));

export const isoDate = (t: number) => new Date(t).toISOString().slice(0, 10);

export const monthsOnHrt = (time: number, start: number | undefined): number | undefined =>
	start === undefined ? undefined : (time - start) / MONTH;

/** Time since the HRT start, or the month when there is none */
export function fmtHrt(time: number, start: number | undefined): string {
	const mo = monthsOnHrt(time, start);
	if (mo === undefined) return fmtMonth(time);
	if (Math.abs(mo) < 0.5) return t.chart.hrtStart;
	const sign = mo > 0 ? '+' : '−';
	const abs = Math.abs(mo);
	return abs >= 12 ? `${sign}${t.years(fmtNum(abs / 12, 1))}` : `${sign}${t.months(Math.round(abs))}`;
}

export function phaseName(p: ResolvedPhase | undefined, therapy: Therapy): string {
	if (!p) return '';
	if (p.implicit) return therapy === 'none' ? t.data.baseline.none : t.data.baseline.hrt;
	return p.label;
}

/** Values a computed measurement was made from, like "creatinine 0.9 mg/dl · age 31" */
export function fmtInputs(inputs: Input[], units: Units): string {
	return inputs
		.map((i) => {
			if (i.of === 'age') return t.chart.inputs.age(String(i.value));
			if (i.of === 'height') return `${t.chart.inputs.height} ${fmtNum(i.value, 0)} cm`;
			const a = analyteById.get(i.of);
			if (!a) return '';
			const value = `${i.censor ?? ''}${fmtNum(convert(a, i.value, units), decimalsOf(a, units))} ${unitOf(a, units)}`;
			return `${nameOf(a)} ${value}${i.assumed ? ` (${t.chart.inputs.assumed})` : ''}`;
		})
		.filter(Boolean)
		.join(' · ');
}

export interface Stats {
	n: number;
	first?: Measurement;
	last?: Measurement;
	prev?: Measurement;
	min?: Measurement;
	max?: Measurement;
	mean?: number;
	median?: number;
	sd?: number;
	preMean?: number;
	hrtMean?: number;
	slopePerYear?: number;
}

/** Summary numbers in the analyte's canonical unit */
export function stats(ms: Measurement[]): Stats {
	const n = ms.length;
	if (!n) return { n };

	const values = ms.map((m) => m.value);
	const sorted = [...values].sort((a, b) => a - b);
	const mean = values.reduce((s, v) => s + v, 0) / n;
	const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
	const sd = n > 1 ? Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1)) : undefined;

	const pre = ms.filter((m) => m.phase === BASELINE);
	const hrt = ms.filter((m) => m.phase !== BASELINE);
	const avg = (list: Measurement[]) => (list.length ? list.reduce((s, m) => s + m.value, 0) / list.length : undefined);

	// Least squares slope after the first phase start, only with enough points to mean anything
	let slopePerYear: number | undefined;
	if (hrt.length >= 3) {
		const xs = hrt.map((m) => m.t / YEAR);
		const mx = xs.reduce((s, x) => s + x, 0) / xs.length;
		const my = avg(hrt)!;
		const num = xs.reduce((s, x, i) => s + (x - mx) * (hrt[i].value - my), 0);
		const den = xs.reduce((s, x) => s + (x - mx) ** 2, 0);
		if (den > 0) slopePerYear = num / den;
	}

	const byValue = [...ms].sort((a, b) => a.value - b.value);
	return {
		n,
		first: ms[0],
		last: ms[n - 1],
		prev: n > 1 ? ms[n - 2] : undefined,
		min: byValue[0],
		max: byValue[n - 1],
		mean,
		median,
		sd,
		preMean: avg(pre),
		hrtMean: avg(hrt),
		slopePerYear
	};
}
