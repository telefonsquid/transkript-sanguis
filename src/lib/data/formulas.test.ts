/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import * as f from './formulas';

describe('kidney', () => {
	test('CKD-EPI 2009 matches published calculators', () => {
		expect(f.ckdEpi2009(1.2, 50, 'male')).toBeCloseTo(70.1, 0);
		expect(f.ckdEpi2009(0.7, 40, 'female')).toBeCloseTo(108.7, 0);
	});

	test('CKD-EPI cystatin C 2012', () => {
		expect(f.ckdEpiCystatin2012(0.8, 40, 'male')).toBeCloseTo(113.3, 0);
		expect(f.ckdEpiCystatin2012(0.8, 40, 'female')).toBeCloseTo(105.6, 0);
	});
});

describe('free testosterone', () => {
	test('Vermeulen balances free, albumin bound and SHBG bound testosterone', () => {
		const [tt, shbg, albumin] = [15, 40, 43];
		const ft = f.vermeulen(tt, shbg, albumin) * 1e-9;
		const albBound = ft * 3.6e4 * (albumin / 69_000);
		const shbgBound = (shbg * 1e-9 * 1e9 * ft) / (1 + 1e9 * ft);
		expect((ft + albBound + shbgBound) * 1e9).toBeCloseTo(tt, 6);
		expect(ft * 1e9).toBeGreaterThan(0.25);
		expect(ft * 1e9).toBeLessThan(0.35);
	});

	test('less SHBG leaves more testosterone free', () => {
		expect(f.freeTestosterone(5, 20)).toBeGreaterThan(f.freeTestosterone(5, 60));
	});

	test('free androgen index', () => {
		expect(f.fai(1, 34.67)).toBeCloseTo(10, 0);
	});
});

describe('simple ratios', () => {
	test('lipids, glucose and iron', () => {
		expect(f.nonHdl(200, 50)).toBe(150);
		expect(f.ldlHdl(120, 60)).toBe(2);
		expect(f.homaIr(90, 10)).toBeCloseTo(2.22, 2);
		expect(f.tsat(100, 250)).toBeCloseTo(28.4, 1);
	});

	test('body and blood count', () => {
		expect(f.bmi(70, 175)).toBeCloseTo(22.86, 2);
		expect(f.mcv(45, 5)).toBe(90);
		expect(f.mch(15, 5)).toBe(30);
		expect(f.mchc(15, 45)).toBeCloseTo(33.3, 1);
	});

	test('HbA1c', () => {
		expect(f.hba1cIfcc(6.5)).toBeCloseTo(47.5, 1);
		expect(f.eag(7)).toBeCloseTo(154.2, 1);
	});
});
