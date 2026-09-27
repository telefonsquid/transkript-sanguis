import { acceptUnit, parseNum, parseValue, unitFactor } from './data';
import type { Analyte, Result } from './data/types';

/** One result as typed into manual entry or the import preview, every field a string until saved */
export interface EditRow {
	key: string;
	analyte: string | null;
	value: string;
	/** A unit the app accepts for the analyte, free text for a value of the user's own */
	unit: string;
	low: string;
	high: string;
	rangeNote: string;
	flag: string;
	note: string;
	/** Name as printed on the report */
	printed?: string;
	/** Kept through edits, no form shows it */
	suspect?: string;
}

export type RowProblem = 'value' | 'range' | 'unit' | 'confirm' | 'analyte' | 'duplicate';

/** Values of the user's own count as the same when name and unit match */
export const customKey = (name: string, unit: string) => `custom:${name.trim().toLowerCase()}|${unit.trim()}`;

/** Bounds that are not numbers, or a lower bound above the upper one */
export function rangeProblem(low: string, high: string): boolean {
	const [l, h] = [parseNum(low.trim()), parseNum(high.trim())];
	if ((low.trim() && l === undefined) || (high.trim() && h === undefined)) return true;
	return l !== undefined && h !== undefined && l > h;
}

/**
 * First problem that blocks saving a row. `target` is the catalogue value, `custom` for one the
 * user creates, undefined while none is picked. `siblings` are the other rows of the same draw.
 */
export function rowProblem(row: EditRow, target: Analyte | 'custom' | undefined, siblings: EditRow[]): RowProblem | undefined {
	if (!target) return 'analyte';
	if (!parseValue(row.value)) return 'value';
	if (rangeProblem(row.low, row.high)) return 'range';
	if (target === 'custom') return undefined;
	if (!row.unit.trim() || unitFactor(target, row.unit.trim()) === undefined) return 'unit';
	if (siblings.some((r) => r !== row && r.analyte === row.analyte)) return 'duplicate';
	return undefined;
}

/** The canonical unit is left out, like everywhere else in stored results */
export function toResult(row: EditRow, analyte: string, canonical?: string): Result {
	const r: Result = { analyte, value: row.value.trim() };
	const unit = row.unit.trim();
	if (unit && unit !== canonical) r.unit = unit;

	const [low, high] = [parseNum(row.low.trim()), parseNum(row.high.trim())];
	if (low !== undefined) r.low = low;
	if (high !== undefined) r.high = high;

	for (const k of ['rangeNote', 'flag', 'printed', 'note', 'suspect'] as const) {
		const v = row[k]?.trim();
		if (v) r[k] = v;
	}
	return r;
}

/** A stored result without a unit is in the canonical one */
export function fromResult(r: Result, a: Analyte | undefined, key: string): EditRow {
	const unit = a && r.unit ? (acceptUnit(a, r.unit) ?? r.unit) : (r.unit ?? a?.unit ?? '');
	const bound = (v?: number) => (v === undefined ? '' : String(v));
	return {
		key,
		analyte: r.analyte,
		value: r.value,
		unit,
		low: bound(r.low),
		high: bound(r.high),
		rangeNote: r.rangeNote ?? '',
		flag: r.flag ?? '',
		note: r.note ?? '',
		printed: r.printed,
		suspect: r.suspect
	};
}
