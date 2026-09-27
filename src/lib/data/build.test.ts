/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { BASELINE, buildProfile, resolvePhases } from './build';
import { analyteById } from './catalogue';
import type { Draw, Profile } from './types';

const lookup = (id: string) => analyteById.get(id);

const profile = (draws: Draw[], extra: Partial<Profile> = {}): Profile => ({
	id: 'p',
	name: 'Test',
	created: '2026-01-01',
	therapy: 'feminizing',
	sex: 'male',
	birth: '1990',
	phases: [],
	reports: [],
	draws,
	custom: [],
	...extra
});

describe('buildProfile', () => {
	test('a value listed twice in one draw keeps the first and raises an issue', () => {
		const draw: Draw = { id: 'd', date: '2026-01-10', results: [{ analyte: 'estradiol', value: '100' }, { analyte: 'estradiol', value: '200' }] };
		const built = buildProfile(profile([draw]), lookup);
		expect(built.measurements.filter((m) => m.analyte === 'estradiol').map((m) => m.value)).toEqual([100]);
		expect(built.issues.map((i) => i.kind)).toEqual(['duplicate']);
	});

	test('a printed value wins over the computed one', () => {
		const draw: Draw = {
			id: 'd',
			date: '2026-01-10',
			results: [
				{ analyte: 'glucose', value: '90' },
				{ analyte: 'insulin', value: '10' },
				{ analyte: 'homa-ir', value: '3' }
			]
		};
		const homa = buildProfile(profile([draw]), lookup).measurements.filter((m) => m.analyte === 'homa-ir');
		expect(homa).toHaveLength(1);
		expect(homa[0].derived).toBeUndefined();
	});
});

describe('resolvePhases', () => {
	test('a phase without a valid start covers no draws', () => {
		const phases = [
			{ id: 'a', label: 'A', start: '' },
			{ id: 'b', label: 'B', start: '2026-01-01' }
		];
		expect(resolvePhases(profile([], { phases })).map((p) => p.id)).toEqual([BASELINE, 'b']);

		const built = buildProfile(profile([{ id: 'd', date: '2025-06-01', results: [{ analyte: 'estradiol', value: '20' }] }], { phases }), lookup);
		expect(built.measurements[0].phase).toBe(BASELINE);
		expect(built.hrtStart).toBe('2026-01-01');
	});
});
