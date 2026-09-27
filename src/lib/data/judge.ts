import type { Analyte, Measurement, RefKind, Reference, Sex, Therapy } from './types';

export type Basis = 'primary' | 'lab' | 'target' | 'trans' | 'female' | 'male' | 'adult' | 'clinical';
export type Status = 'low' | 'in' | 'high' | 'none';
export type Kind = RefKind | 'lab';

export const BASES: Basis[] = ['primary', 'lab', 'target', 'trans', 'female', 'male', 'adult', 'clinical'];

/** Fixed legend order, validated as a palette in this order */
export const KIND_ORDER: Kind[] = ['lab', 'target', 'context', 'trans', 'clinical', 'female', 'male', 'adult'];

/** The person a value is judged for */
export interface Subject {
	therapy: Therapy;
	sex?: Sex;
	age?: number;
	/** In cm */
	height?: number;
}

/** Limits a value is judged against, `ref` is missing for the printed lab range */
export interface Bounds {
	low?: number;
	high?: number;
	kind: Kind;
	ref?: Reference;
}

/** References that apply to a subject's therapy, age and height */
export function refsFor(a: Analyte, s: Subject): Reference[] {
	const { therapy, age, height } = s;
	const fits = a.refs.filter(
		(r) => (!r.therapy || r.therapy === therapy) && (!r.age || age === undefined || (age >= r.age[0] && age <= r.age[1]))
	);
	if (!fits.some((r) => r.perHeight)) return fits;

	// Ranges per height² need a height to become a range
	const m2 = height ? (height / 100) ** 2 : 0;
	const scale = (v: number | undefined) => (v === undefined ? v : Math.round(v * m2 * 10) / 10);
	return fits.flatMap((r) => (!r.perHeight ? [r] : m2 ? [{ ...r, low: scale(r.low), high: scale(r.high) }] : []));
}

export function labBounds(m: Measurement): Bounds | undefined {
	if (!m.labRef || (m.labRef.low === undefined && m.labRef.high === undefined)) return undefined;
	return { low: m.labRef.low, high: m.labRef.high, kind: 'lab' };
}

/** The reference "best fit" stands for on this subject, before falling back to the lab range */
export function primaryRef(a: Analyte, s: Subject): Reference | undefined {
	const refs = refsFor(a, s);
	const id = a.primary?.[s.therapy] ?? a.primary?.any;
	if (id) {
		const exact = refs.find((r) => r.id === id);
		if (exact) return exact;

		// The chosen range may exist only for another age band, take the visible one of the same kind
		const kind = a.refs.find((r) => r.id === id)?.kind;
		const sibling = refs.find((r) => r.kind === kind);
		if (sibling) return sibling;
	}
	if (s.therapy === 'none') return refs.find((r) => r.kind === s.sex) ?? refs.find((r) => r.kind === 'adult');
	return undefined;
}

/**
 * Reference used when no default exists, a cohort on the same therapy first. Sex specific ranges
 * never qualify on HRT, a suppressed LH judged against cis men would read as a false "low".
 */
export function fallbackRef(a: Analyte, s: Subject): Reference | undefined {
	const refs = refsFor(a, s).filter((r) => r.low !== undefined || r.high !== undefined);
	const kinds: RefKind[] = ['trans', 'adult', 'clinical', 'target'];
	for (const kind of kinds) {
		const ref = refs.find((r) => r.kind === kind);
		if (ref) return ref;
	}
}

/** Curated reference "best fit" judges against, the printed lab range only steps in without one */
export function bestRef(a: Analyte, s: Subject): Reference | undefined {
	return primaryRef(a, s) ?? fallbackRef(a, s);
}

/** The reference a basis stands for, before the printed lab range steps in */
export function basisRef(a: Analyte, basis: Basis, s: Subject): Reference | undefined {
	if (basis === 'lab') return undefined;
	return basis === 'primary' ? bestRef(a, s) : refsFor(a, s).find((r) => r.kind === basis);
}

export const refBounds = (r: Reference): Bounds => ({ low: r.low, high: r.high, kind: r.kind, ref: r });

/** Limits a value is judged against, the printed lab range when no curated one fits */
export function boundsFor(a: Analyte, m: Measurement | undefined, basis: Basis, s: Subject): Bounds | undefined {
	const ref = basisRef(a, basis, s);
	if (ref) return refBounds(ref);
	return m ? labBounds(m) : undefined;
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
