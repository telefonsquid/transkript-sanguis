/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { analyteById, analytes } from './catalogue';
import { acceptUnit, cleanUnit, suggestUnit, unitChoices, unitConflicts, unitFactor } from './units';

const a = (id: string) => analyteById.get(id)!;

describe('cleanUnit', () => {
	test('undoes LaTeX and OCR slips', () => {
		expect(cleanUnit(String.raw`$\mu$g/dl`)).toBe('µg/dl');
		expect(cleanUnit(String.raw`\text{pmol/l}`)).toBe('pmol/l');
		expect(cleanUnit('pmo1/1')).toBe('pmol/l');
		expect(cleanUnit('mg/dI')).toBe('mg/dl');
		expect(cleanUnit('mcg/l')).toBe('µg/l');
		expect(cleanUnit('x10^9 / l')).toBe('10^9/l');
		expect(cleanUnit('10⁹/l')).toBe('10^9/l');
	});
});

describe('unitFactor', () => {
	test('converts listed units', () => {
		expect(unitFactor(a('estradiol'), 'pg/ml')).toBe(1);
		expect(unitFactor(a('estradiol'), 'pmol/l')).toBeCloseTo(1 / 3.671, 6);
	});

	test('converts other spellings of the same quantity by scale', () => {
		expect(unitFactor(a('estradiol'), 'ng/l')).toBeCloseTo(1, 9);
		expect(unitFactor(a('estradiol'), 'nmol/l')).toBeCloseTo(1000 / 3.671, 6);
	});

	test('refuses units of another quantity', () => {
		expect(unitFactor(a('estradiol'), 'U/l')).toBeUndefined();
	});

	test('treats a missing unit as the canonical one', () => {
		expect(unitFactor(a('estradiol'), '')).toBe(1);
	});
});

describe('catalogue units', () => {
	test('every listed factor agrees with its spelling', () => {
		const broken = analytes.flatMap((x) => unitConflicts(x).map((u) => `${x.id}: ${u}`));
		expect(broken).toEqual([]);
	});

	test('every accepted unit converts', () => {
		for (const x of analytes) for (const u of unitChoices(x)) expect(unitFactor(x, u)).toBeDefined();
	});
});

describe('acceptUnit and suggestUnit', () => {
	test('picks the accepted spelling', () => {
		expect(acceptUnit(a('estradiol'), 'pmo1/l')).toBe('pmol/l');
		expect(acceptUnit(a('estradiol'), 'furlongs')).toBeUndefined();
	});

	test('guesses the unit from where the values land', () => {
		expect(suggestUnit(a('estradiol'), '??', [550])).toBe('pmol/l');
		expect(suggestUnit(a('estradiol'), '??', [150])).toBe('pg/ml');
	});
});
