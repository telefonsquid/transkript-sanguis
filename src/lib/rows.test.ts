/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { analyteById } from './data/catalogue';
import { fromResult, rowProblem, toResult, type EditRow } from './rows';

const estradiol = analyteById.get('estradiol')!;

const row = (extra: Partial<EditRow> = {}): EditRow => ({
	key: 'r',
	analyte: 'estradiol',
	value: '120',
	unit: 'pg/ml',
	low: '',
	high: '',
	rangeNote: '',
	flag: '',
	note: '',
	...extra
});

describe('rowProblem', () => {
	test('names the first thing that blocks saving', () => {
		expect(rowProblem(row(), undefined, [])).toBe('analyte');
		expect(rowProblem(row({ value: 'high' }), estradiol, [])).toBe('value');
		expect(rowProblem(row({ low: '40', high: '20' }), estradiol, [])).toBe('range');
		expect(rowProblem(row({ unit: 'U/l' }), estradiol, [])).toBe('unit');
		expect(rowProblem(row(), estradiol, [row({ key: 'other' })])).toBe('duplicate');
		expect(rowProblem(row({ low: '20', high: '40' }), estradiol, [])).toBeUndefined();
	});

	test("a value of the user's own skips the unit check", () => {
		expect(rowProblem(row({ unit: 'furlongs' }), 'custom', [])).toBeUndefined();
	});
});

describe('toResult and fromResult', () => {
	test('round trip keeps what was printed', () => {
		const edited = row({ unit: 'pmol/l', low: '0,5', high: ' ', printed: 'Östradiol', note: ' ' });
		const r = toResult(edited, 'estradiol', estradiol.unit);
		expect(r).toEqual({ analyte: 'estradiol', value: '120', unit: 'pmol/l', low: 0.5, printed: 'Östradiol' });
		expect(fromResult(r, estradiol, 'r')).toEqual({ ...row({ unit: 'pmol/l', low: '0.5' }), printed: 'Östradiol' });
	});

	test('the canonical unit is left out', () => {
		expect(toResult(row({ unit: estradiol.unit }), 'estradiol', estradiol.unit).unit).toBeUndefined();
		expect(fromResult({ analyte: 'estradiol', value: '1' }, estradiol, 'r').unit).toBe(estradiol.unit);
	});

	test('a suspect flag survives an edit', () => {
		const r = { analyte: 'estradiol', value: '120', suspect: 'aged sample' };
		expect(toResult(fromResult(r, estradiol, 'r'), 'estradiol', estradiol.unit)).toEqual(r);
	});
});
