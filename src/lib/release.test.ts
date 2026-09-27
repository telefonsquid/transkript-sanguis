/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { isNewer, parseChangelog, releaseSection, versionHeading } from './release';

const sample = `# Changelog

Intro that belongs to no release.

## 0.2.0 — 2026-10-01

Short intro
that wraps.

### Added

- New \`thing\`
- A bullet that
  wraps onto a second line

### Fixed

- Old bug

## v0.1.0
- Bullet without a group
`;

describe('versionHeading', () => {
	test('reads version and date', () => {
		expect(versionHeading('## 1.2.0 — 2026-08-01')).toEqual({ version: '1.2.0', date: '2026-08-01' });
		expect(versionHeading('## v1.2.0 - 2026-08-01')).toEqual({ version: '1.2.0', date: '2026-08-01' });
		expect(versionHeading('## 1.2.0')).toEqual({ version: '1.2.0', date: null });
	});

	test('ignores other headings', () => {
		expect(versionHeading('# Changelog')).toBeNull();
		expect(versionHeading('### Added')).toBeNull();
		expect(versionHeading('- ## not a heading')).toBeNull();
	});
});

describe('parseChangelog', () => {
	const [second, first] = parseChangelog(sample);

	test('keeps releases newest first with their groups', () => {
		expect(second.version).toBe('0.2.0');
		expect(second.date).toBe('2026-10-01');
		expect(second.groups.map((g) => g.title)).toEqual(['Added', 'Fixed']);
		expect(first).toMatchObject({ version: '0.1.0', date: null, groups: [] });
	});

	test('joins wrapped lines and splits code spans', () => {
		expect(second.intro).toEqual([[{ text: 'Short intro that wraps.', code: false }]]);
		expect(second.groups[0].items).toEqual([
			[
				{ text: 'New ', code: false },
				{ text: 'thing', code: true }
			],
			[{ text: 'A bullet that wraps onto a second line', code: false }]
		]);
	});

	test('keeps bullets without a group as intro', () => {
		expect(first.intro).toEqual([[{ text: 'Bullet without a group', code: false }]]);
	});

	test('reads the real changelog', () => {
		const releases = parseChangelog(readFileSync(new URL('../../CHANGELOG.md', import.meta.url), 'utf8'));
		const version = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
		expect(releases.length).toBeGreaterThan(0);
		expect(releases.every((r) => /^\d+\.\d+\.\d+/.test(r.version) && /^\d{4}-\d{2}-\d{2}$/.test(r.date ?? ''))).toBe(true);
		expect(releases.some((r) => r.version === version)).toBe(true);
	});
});

describe('releaseSection', () => {
	test('returns the text up to the next version', () => {
		expect(releaseSection(sample, 'v0.2.0')).toStartWith('Short intro');
		expect(releaseSection(sample, '0.2.0')).toEndWith('- Old bug');
		expect(releaseSection(sample, '0.1.0')).toBe('- Bullet without a group');
		expect(releaseSection(sample, '9.9.9')).toBeNull();
	});
});

describe('isNewer', () => {
	test('compares the three numbers', () => {
		expect(isNewer('0.2.0', '0.1.9')).toBe(true);
		expect(isNewer('v1.0.0', '0.9.9')).toBe(true);
		expect(isNewer('0.10.0', '0.9.0')).toBe(true);
		expect(isNewer('0.1.0', '0.1.0')).toBe(false);
		expect(isNewer('0.1.0', '0.2.0')).toBe(false);
	});

	test('puts a prerelease before its release', () => {
		expect(isNewer('1.0.0', '1.0.0-beta.1')).toBe(true);
		expect(isNewer('1.0.0-beta.1', '1.0.0')).toBe(false);
		expect(isNewer('1.0.0-beta.2', '1.0.0-beta.1')).toBe(false);
	});
});
