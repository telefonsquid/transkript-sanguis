import type { Analyte, Range } from './types';

/** Lab style number: decimal comma or point, no thousands separators */
const NUM = String.raw`\d+(?:[.,]\d+)?|[.,]\d+`;

const num = (s: string) => Number(s.replace(',', '.'));

function clean(text: string): string {
	return text
		.trim()
		.replace(/[−–—]/g, '-')
		.replace(/≤/g, '<=')
		.replace(/≥/g, '>=')
		.replace(/\s+/g, ' ');
}

/** Parses printed values like "12,5", "<0.3", "> 90" or "≤ 5" */
export function parseValue(raw: string): { value: number; censor?: '<' | '>' } | undefined {
	const t = clean(raw).replace(/^(<|>)=/, '$1');
	const m = t.match(new RegExp(`^([<>])?\\s*(${NUM})$`));
	if (!m) return undefined;
	return { value: num(m[2]), censor: m[1] as '<' | '>' | undefined };
}

/** Parses printed ranges like "136 - 145", "3,5 bis 5,1", "< 50", "bis 40", ">= 60" or "über 39" */
export function parseRange(text: string | undefined): Range | undefined {
	if (!text?.trim()) return undefined;
	const t = clean(text)
		.toLowerCase()
		.replace(/^(?:ref\.?|referenz(?:bereich)?:?|normal:?)\s*/, '');

	let m = t.match(new RegExp(`^(?:<=?|bis|unter|below|up to|max\\.?)\\s*(${NUM})$`));
	if (m) return { high: num(m[1]), text };

	m = t.match(new RegExp(`^(?:>=?|über|ueber|ab|above|min\\.?)\\s*(${NUM})$`));
	if (m) return { low: num(m[1]), text };

	m = t.match(new RegExp(`^(${NUM})\\s*(?:-|bis|to|–)\\s*(${NUM})$`));
	if (m) return { low: num(m[1]), high: num(m[2]), text };

	return { text };
}

/** Comparable form of a unit: case, spacing and micro sign variants removed */
export function normUnit(unit: string): string {
	return unit
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '')
		.replace(/μ/g, 'µ')
		.replace(/mcg/g, 'µg')
		.replace(/(^|\/)u(g|l|mol|iu|u)/g, '$1µ$2')
		.replace(/[×x*]?10(?:\^|e|\*\*?)?(?:9|⁹)(?=\/)/g, '10^9')
		.replace(/[×x*]?10(?:\^|e|\*\*?)?(?:12|¹²)(?=\/)/g, '10^12');
}

/** Factor that turns a value in the printed unit into the analyte's canonical unit */
export function unitFactor(a: Analyte, unit: string | undefined): number | undefined {
	if (!unit?.trim()) return 1;
	const u = normUnit(unit);
	if (u === normUnit(a.unit)) return 1;
	const alt = a.units?.find((x) => normUnit(x.unit) === u);
	if (alt) return alt.factor;
	if (a.si && normUnit(a.si.unit) === u) return 1 / a.si.factor;
	return undefined;
}

export function toTime(date: string, time = '12:00'): number {
	const [y, mo, d] = date.split('-').map(Number);
	const [h, mi] = time.split(':').map(Number);
	return Date.UTC(y, mo - 1, d, h || 0, mi || 0);
}

/** Whole years like the labs use in their equations. A birth year alone counts from mid year */
export function ageAt(birth: string | undefined, date: string): number | undefined {
	if (!birth) return undefined;
	const [by, bm = 7, bd = 1] = birth.split('-').map(Number);
	const [y, m, d] = date.split('-').map(Number);
	if (!by) return undefined;
	return y - by - (m < bm || (m === bm && d < bd) ? 1 : 0);
}

export const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

export const nowIso = () => new Date().toISOString();

export const todayIso = () => nowIso().slice(0, 10);
