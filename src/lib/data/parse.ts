/** Printed range as numbers, text that is not a plain range stays behind as a note */
export interface PrintedRange {
	low?: number;
	high?: number;
	note?: string;
}

/** Lab style number: decimal comma or point, no thousands separators */
const NUM = String.raw`\d+(?:[.,]\d+)?|[.,]\d+`;

const num = (s: string) => Number(s.replace(',', '.'));

function clean(text: string): string {
	return text
		.trim()
		.replace(/[$\\]/g, '')
		.replace(/(\d)\.\.(\d)/g, '$1.$2')
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

/** A single printed number like "12,5" or "0.3", undefined for anything else */
export function parseNum(raw: string | number | null | undefined): number | undefined {
	if (typeof raw === 'number') return Number.isFinite(raw) ? raw : undefined;
	if (!raw) return undefined;
	const t = clean(raw);
	return new RegExp(`^-?(?:${NUM})$`).test(t) ? num(t) : undefined;
}

/** Parses printed ranges like "136 - 145", "3,5 bis 5,1", "< 50", "bis 40", ">= 60" or "über 39" */
export function parseRange(text: string | null | undefined): PrintedRange | undefined {
	if (!text?.trim()) return undefined;
	const t = clean(text)
		.toLowerCase()
		.replace(/^(?:ref\.?|referenz(?:bereich)?:?|normal:?)\s*/, '');

	let m = t.match(new RegExp(`^(?:<=?|bis|unter|below|up to|max\\.?)\\s*(${NUM})$`));
	if (m) return { high: num(m[1]) };

	m = t.match(new RegExp(`^(?:>=?|über|ueber|ab|above|min\\.?)\\s*(${NUM})$`));
	if (m) return { low: num(m[1]) };

	m = t.match(new RegExp(`^(${NUM})\\s*(?:-|bis|to|–)\\s*(${NUM})$`));
	if (m) return { low: num(m[1]), high: num(m[2]) };

	return { note: text.trim() };
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
