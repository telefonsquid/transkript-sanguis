/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { ageAt, isIsoDate, parseNum, parseRange, parseValue, printedDecimals, toTime } from './parse';

describe('parseValue', () => {
	test('reads decimal commas and points', () => {
		expect(parseValue('12,5')).toEqual({ value: 12.5, censor: undefined });
		expect(parseValue('0.3')).toEqual({ value: 0.3, censor: undefined });
	});

	test('keeps limits of detection as censored values', () => {
		expect(parseValue('<0,3')).toEqual({ value: 0.3, censor: '<' });
		expect(parseValue('> 90')).toEqual({ value: 90, censor: '>' });
		expect(parseValue('≤ 5')).toEqual({ value: 5, censor: '<' });
	});

	test('keeps the sign of negative values', () => {
		expect(parseValue('-2,5')).toEqual({ value: -2.5, censor: undefined });
		expect(parseValue('−1')).toEqual({ value: -1, censor: undefined });
	});

	test('rejects text', () => {
		expect(parseValue('negativ')).toBeUndefined();
		expect(parseValue('')).toBeUndefined();
	});
});

describe('parseNum', () => {
	test('reads plain numbers only', () => {
		expect(parseNum('12,5')).toBe(12.5);
		expect(parseNum('-1')).toBe(-1);
		expect(parseNum(4)).toBe(4);
		expect(parseNum('1.000,5')).toBeUndefined();
		expect(parseNum('<3')).toBeUndefined();
		expect(parseNum(Number.NaN)).toBeUndefined();
		expect(parseNum(null)).toBeUndefined();
	});
});

describe('parseRange', () => {
	test('reads two sided ranges in both languages', () => {
		expect(parseRange('136 - 145')).toEqual({ low: 136, high: 145 });
		expect(parseRange('3,5 bis 5,1')).toEqual({ low: 3.5, high: 5.1 });
		expect(parseRange('0.5 – 1.2')).toEqual({ low: 0.5, high: 1.2 });
		expect(parseRange('136-145')).toEqual({ low: 136, high: 145 });
	});

	test('reads negative limits', () => {
		expect(parseRange('-2 - +3')).toEqual({ low: -2, high: 3 });
		expect(parseRange('−3 bis 3')).toEqual({ low: -3, high: 3 });
		expect(parseRange('> -2')).toEqual({ low: -2 });
	});

	test('reads one sided ranges', () => {
		expect(parseRange('< 50')).toEqual({ high: 50 });
		expect(parseRange('bis 40')).toEqual({ high: 40 });
		expect(parseRange('>= 60')).toEqual({ low: 60 });
		expect(parseRange('über 39')).toEqual({ low: 39 });
	});

	test('keeps anything else as a note', () => {
		expect(parseRange('siehe Befund')).toEqual({ note: 'siehe Befund' });
		expect(parseRange('  ')).toBeUndefined();
	});
});

describe('dates', () => {
	test('printed decimals', () => {
		expect(printedDecimals('12,50')).toBe(2);
		expect(printedDecimals('<0.3')).toBe(1);
		expect(printedDecimals('90')).toBe(0);
	});

	test('toTime is UTC noon by default', () => {
		expect(new Date(toTime('2024-03-01')).toISOString()).toBe('2024-03-01T12:00:00.000Z');
		expect(new Date(toTime('2024-03-01', '08:30')).toISOString()).toBe('2024-03-01T08:30:00.000Z');
	});

	test('ageAt counts whole years, a birth year alone from mid year', () => {
		expect(ageAt('1990-05-10', '2024-05-09')).toBe(33);
		expect(ageAt('1990-05-10', '2024-05-10')).toBe(34);
		expect(ageAt('1990', '2024-06-30')).toBe(33);
		expect(ageAt('1990', '2024-07-01')).toBe(34);
		expect(ageAt(undefined, '2024-07-01')).toBeUndefined();
	});

	test('isIsoDate', () => {
		expect(isIsoDate('2024-02-29')).toBe(true);
		expect(isIsoDate('2024-13-01')).toBe(false);
		expect(isIsoDate('01.02.2024')).toBe(false);
		expect(isIsoDate('2026-02-30')).toBe(false);
		expect(isIsoDate('2023-02-29')).toBe(false);
		expect(isIsoDate('')).toBe(false);
	});
});
