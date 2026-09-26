import { BASELINE, toTime } from './data';
import type { Analyte, Measurement, Range, RefKind, Reference, Therapy } from './data/types';
import { locale, t, tx } from './i18n';
import { current, lookup } from './profiles.svelte';

export type Basis = 'primary' | 'lab' | 'target' | 'trans' | 'female' | 'male' | 'adult' | 'clinical';
export type Units = 'conv' | 'si';
export type Status = 'low' | 'in' | 'high' | 'none';
export type Kind = RefKind | 'lab';

export interface Bounds {
	low?: number;
	high?: number;
	label: string;
	kind: Kind;
}

export const BASES: Basis[] = ['primary', 'lab', 'target', 'trans', 'female', 'male', 'adult', 'clinical'];

/** Fixed legend order, validated as a palette in this order */
export const KIND_ORDER: Kind[] = ['lab', 'target', 'context', 'trans', 'clinical', 'female', 'male', 'adult'];

/** References that apply to the active profile's therapy and age */
export function refsFor(a: Analyte, therapy: Therapy = current.therapy, age = current.age): Reference[] {
	return a.refs.filter(
		(r) => (!r.therapy || r.therapy === therapy) && (!r.age || age === undefined || (age >= r.age[0] && age <= r.age[1]))
	);
}

function labBounds(m: Measurement): Bounds | undefined {
	if (!m.labRef || (m.labRef.low === undefined && m.labRef.high === undefined)) return undefined;
	return { low: m.labRef.low, high: m.labRef.high, label: t.kind.lab, kind: 'lab' };
}

/** The reference "best fit" stands for on this profile, before falling back to the lab range */
export function primaryRef(a: Analyte, therapy: Therapy = current.therapy): Reference | undefined {
	const refs = refsFor(a, therapy);
	const id = a.primary?.[therapy] ?? a.primary?.any;
	if (id) {
		const exact = refs.find((r) => r.id === id);
		if (exact) return exact;

		// The chosen range may exist only for another age band, take the visible one of the same kind
		const kind = a.refs.find((r) => r.id === id)?.kind;
		const sibling = refs.find((r) => r.kind === kind);
		if (sibling) return sibling;
	}
	if (therapy === 'none') {
		const sex = current.profile?.sex;
		return refs.find((r) => r.kind === sex) ?? refs.find((r) => r.kind === 'adult');
	}
	return undefined;
}

/**
 * Reference used when neither a default nor a lab range exists. Sex specific ranges never
 * qualify on HRT, a suppressed LH judged against cis men would read as a false "low".
 */
export function fallbackRef(a: Analyte): Reference | undefined {
	const kinds: RefKind[] = ['adult', 'clinical', 'target', 'trans'];
	return refsFor(a).find((r) => (r.low !== undefined || r.high !== undefined) && kinds.includes(r.kind));
}

const asBounds = (r: Reference): Bounds => ({ low: r.low, high: r.high, label: tx(r.label), kind: r.kind });

/** Reference a value is judged against. Falls back to the printed lab range, then to the first curated one */
export function boundsFor(a: Analyte, m: Measurement | undefined, basis: Basis): Bounds | undefined {
	const lab = m ? labBounds(m) : undefined;
	if (basis === 'lab') return lab;

	if (basis === 'primary') {
		const ref = primaryRef(a);
		if (ref) return asBounds(ref);
		if (lab) return lab;
		const fallback = fallbackRef(a);
		return fallback && asBounds(fallback);
	}

	const ref = refsFor(a).find((r) => r.kind === basis);
	return ref ? asBounds(ref) : lab;
}

export function statusOf(m: Measurement, b: Bounds | undefined): Status {
	if (!b) return 'none';
	const { low, high } = b;
	const v = m.value;

	if (m.censor === '<') {
		if (low !== undefined && v <= low) return 'low';
		if (high === undefined || v <= high) return 'in';
		return 'none';
	}
	if (m.censor === '>') {
		if (high !== undefined && v >= high) return 'high';
		if (low === undefined || v >= low) return 'in';
		return 'none';
	}

	if (low !== undefined && v < low) return 'low';
	if (high !== undefined && v > high) return 'high';
	return 'in';
}

/**
 * Position inside a range: 0 at the lower limit, 1 at the upper limit.
 * One sided limits use 0 as the missing lower bound, or twice the limit as the missing upper bound.
 */
export function position(v: number, b: Bounds | undefined): number | undefined {
	if (!b) return undefined;
	const low = b.low ?? 0;
	const high = b.high ?? (b.low !== undefined ? b.low * 2 : undefined);
	if (high === undefined || high === low) return undefined;
	return (v - low) / (high - low);
}

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

/** Decimals a printed value was given with, "12,50" has two */
function printedDecimals(raw: string): number {
	const m = raw.match(/[.,](\d+)\s*$/);
	return m ? m[1].length : 0;
}

/** Printed values keep their printed precision, anything converted or computed uses the analyte's */
export function fmtValue(m: Measurement, units: Units): string {
	const a = lookup(m.analyte);
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

const MONTH = 30.4375 * 86_400_000;

export const isoDate = (t: number) => new Date(t).toISOString().slice(0, 10);

export function hrtStartTime(): number | undefined {
	const start = current.built.hrtStart;
	return start ? toTime(start) : undefined;
}

export function monthsOnHrt(time: number): number | undefined {
	const start = hrtStartTime();
	return start === undefined ? undefined : (time - start) / MONTH;
}

export function fmtHrt(time: number): string {
	const mo = monthsOnHrt(time);
	if (mo === undefined) return fmtMonth(time);
	if (Math.abs(mo) < 0.5) return t.chart.hrtStart;
	const sign = mo > 0 ? '+' : '−';
	const abs = Math.abs(mo);
	return abs >= 12 ? `${sign}${t.years(fmtNum(abs / 12, 1))}` : `${sign}${t.months(Math.round(abs))}`;
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
		const xs = hrt.map((m) => m.t / (365.25 * 86_400_000));
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

export function phaseName(id: string): string {
	const p = current.built.phases.find((x) => x.id === id);
	if (!p) return '';
	if (p.implicit) return current.therapy === 'none' ? t.data.baseline.none : t.data.baseline.hrt;
	return p.label;
}
