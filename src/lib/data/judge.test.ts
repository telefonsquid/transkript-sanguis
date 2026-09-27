/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { analyteById } from './catalogue';
import { basisRef, bestRef, boundsFor, labBounds, position, primaryRef, refsFor, statusOf, type Subject } from './judge';
import type { Measurement } from './types';

const a = (id: string) => analyteById.get(id)!;

const m = (value: number, extra: Partial<Measurement> = {}): Measurement => ({
	analyte: 'estradiol',
	drawId: 'd',
	date: '2024-01-01',
	t: 0,
	value,
	raw: String(value),
	lab: '',
	phase: 'baseline',
	...extra
});

const fem: Subject = { therapy: 'feminizing', sex: 'male', age: 30 };
const cisWoman: Subject = { therapy: 'none', sex: 'female', age: 30 };

describe('reference choice', () => {
	test('a therapy default wins', () => {
		expect(primaryRef(a('estradiol'), fem)?.id).toBe('target-endo');
		expect(primaryRef(a('lh'), fem)?.id).toBe('trans-f');
	});

	test('without HRT the range of the sex assigned at birth is used', () => {
		expect(primaryRef(a('ferritin'), cisWoman)?.kind).toBe('female');
	});

	test('best fit never falls back to a cis sex range on HRT', () => {
		for (const x of analyteById.values()) {
			const ref = bestRef(x, fem);
			if (ref && !x.primary?.feminizing && !x.primary?.any) expect(['female', 'male']).not.toContain(ref.kind);
		}
	});

	test('the lab basis has no curated reference', () => {
		expect(basisRef(a('estradiol'), 'lab', fem)).toBeUndefined();
	});
});

describe('refsFor', () => {
	test('ranges per height need a height', () => {
		expect(refsFor(a('weight'), { therapy: 'none' })).toEqual([]);
		const [who] = refsFor(a('weight'), { therapy: 'none', height: 175 });
		expect(who.low).toBeCloseTo(56.7, 1);
		expect(who.high).toBeCloseTo(76.6, 1);
	});

	test('therapy limited ranges stay on their therapy', () => {
		expect(refsFor(a('lh'), cisWoman).some((r) => r.therapy)).toBe(false);
	});
});

describe('bounds and status', () => {
	const printed = m(50, { labRef: { low: 20, high: 40, printed: { low: 20, high: 40 } } });

	test('the printed range steps in without a curated one', () => {
		expect(boundsFor(a('estradiol'), printed, 'lab', fem)).toEqual({ low: 20, high: 40, kind: 'lab' });
		expect(labBounds(m(1))).toBeUndefined();
	});

	test('plain values', () => {
		const b = { low: 20, high: 40, kind: 'lab' as const };
		expect(statusOf(m(10), b)).toBe('low');
		expect(statusOf(m(30), b)).toBe('in');
		expect(statusOf(m(50), b)).toBe('high');
		expect(statusOf(m(50), undefined)).toBe('none');
	});

	test('censored values only count where the limit decides', () => {
		const b = { low: 20, high: 40, kind: 'lab' as const };
		expect(statusOf(m(5, { censor: '<' }), b)).toBe('low');
		expect(statusOf(m(30, { censor: '<' }), b)).toBe('in');
		expect(statusOf(m(50, { censor: '<' }), b)).toBe('none');
		expect(statusOf(m(50, { censor: '>' }), b)).toBe('high');
		expect(statusOf(m(10, { censor: '>' }), b)).toBe('none');
	});

	test('position inside a range', () => {
		expect(position(30, { low: 20, high: 40, kind: 'lab' })).toBe(0.5);
		expect(position(10, { high: 40, kind: 'lab' })).toBe(0.25);
		expect(position(30, { low: 20, kind: 'lab' })).toBe(0.5); // Open top edge sits at twice the lower bound
		expect(position(30, undefined)).toBeUndefined();
	});
});
