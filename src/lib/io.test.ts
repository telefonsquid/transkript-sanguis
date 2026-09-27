/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { DRAWS_FORMAT, identify } from './io';

const json = JSON.stringify({ format: DRAWS_FORMAT, version: 2, draws: [{ date: '2026-01-10', results: [] }] });

describe('identify', () => {
	test('finds the JSON inside a chat answer', () => {
		expect(identify(`Here you go:\n\`\`\`json\n${json}\n\`\`\`\nCheck the values.`).kind).toBe('draws');
	});

	test('skips braces in the prose before the JSON', () => {
		expect(identify(`Values in {curly} braces are estimates.\n${json}`).kind).toBe('draws');
	});

	test('tells broken JSON from an unknown format', () => {
		expect(identify('no json here')).toEqual({ kind: 'error', reason: 'json' });
		expect(identify('{"draws": [}')).toEqual({ kind: 'error', reason: 'json' });
		expect(identify('{"hello": 1}')).toEqual({ kind: 'error', reason: 'format' });
	});
});
