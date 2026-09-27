/**
 * Release notes and version numbers, shared by the changelog page, the update check and the release scripts.
 * CHANGELOG.md is the only place notes are written, so the app and the GitHub release always agree.
 */

/** A version heading like `## 0.1.0 — 2026-09-27`, leading v and date optional */
export function versionHeading(line: string): { version: string; date: string | null } | null {
	const m = line.match(/^##\s+v?(\S+)\s*(?:[—–-]\s*(.*))?$/);
	return m ? { version: m[1], date: m[2]?.trim() || null } : null;
}

export interface Inline {
	text: string;
	/** Written in backticks */
	code: boolean;
}

export interface ChangeGroup {
	/** Added, Changed, Fixed, or null for bullets straight under the version */
	title: string | null;
	items: Inline[][];
}

export interface Release {
	version: string;
	date: string | null;
	/** Prose between the version heading and the first group */
	intro: Inline[][];
	groups: ChangeGroup[];
}

function inline(text: string): Inline[] {
	return text
		.split('`')
		.map((part, i) => ({ text: part, code: i % 2 === 1 }))
		.filter((part) => part.text !== '');
}

// Wrapped lines join back up, the page wraps on its own
function paragraphs(lines: string[]): string[] {
	const out: string[] = [];
	for (const line of lines) {
		const bullet = line.match(/^\s*[-*]\s+(.*)$/);
		if (bullet) out.push(bullet[1]);
		else if (line.trim() === '') out.push('');
		else if (out.length === 0 || out.at(-1) === '') out.push(line.trim());
		else out[out.length - 1] += ' ' + line.trim();
	}
	return out.filter((p) => p !== '');
}

/** Every release, newest first. Unknown lines stay as paragraphs, so nothing gets dropped */
export function parseChangelog(markdown: string): Release[] {
	const releases: Release[] = [];
	let release: Release | null = null;
	let group: ChangeGroup | null = null;
	let buffer: string[] = [];

	// Lines collect until the next heading tells where they belong
	const flush = () => {
		const parsed = paragraphs(buffer).map(inline);
		buffer = [];
		if (group) group.items.push(...parsed);
		else release?.intro.push(...parsed);
	};

	for (const line of markdown.split(/\r?\n/)) {
		const version = versionHeading(line);
		const heading = line.match(/^###\s+(.*)$/);
		if (version) {
			flush();
			group = null;
			release = { ...version, intro: [], groups: [] };
			releases.push(release);
		} else if (heading && release) {
			flush();
			group = { title: heading[1].trim(), items: [] };
			release.groups.push(group);
		} else if (!line.startsWith('#')) {
			buffer.push(line);
		}
	}
	flush();
	return releases;
}

/** The raw text under one version heading, for the GitHub release body */
export function releaseSection(markdown: string, version: string): string | null {
	const lines = markdown.split(/\r?\n/);
	const start = lines.findIndex((line) => versionHeading(line)?.version === version.replace(/^v/, ''));
	if (start === -1) return null;

	const rest = lines.slice(start + 1);
	const end = rest.findIndex((line) => versionHeading(line) !== null);
	return (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
}

function split(version: string) {
	const [core, ...tail] = version.replace(/^v/, '').split('-');
	return { numbers: core.split('.').map((n) => Number(n) || 0), pre: tail.join('-') };
}

/** Whether candidate is a later release than installed. Two prereleases of the same version count as equal */
export function isNewer(candidate: string, installed: string): boolean {
	const a = split(candidate);
	const b = split(installed);
	for (let i = 0; i < 3; i++) {
		const [mine, theirs] = [a.numbers[i] ?? 0, b.numbers[i] ?? 0];
		if (mine !== theirs) return mine > theirs;
	}

	// A prerelease comes before its release
	return a.pre === '' && b.pre !== '';
}
