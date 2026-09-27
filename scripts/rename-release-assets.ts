/**
 * Gives every asset of a release the same name shape, each bundler otherwise follows its own platform habit.
 *
 *   transkript-sanguis_<version>_<os>_<arch>[_<variant>].<ext>
 *
 * Called by .github/workflows/release.yml once every build has run, safe to rerun by hand.
 * Needs GH_TOKEN (or GITHUB_TOKEN) with contents write and GITHUB_REPOSITORY as owner/repo.
 *
 *   bun run rename-release-assets v0.1.0 [--dry-run]
 */

// Longest first, so .app.tar.gz wins over .tar.gz
const EXTENSIONS = ['.app.tar.gz', '.AppImage', '.tar.gz', '.msi', '.exe', '.dmg', '.deb', '.rpm'];

const OS_BY_EXTENSION: Record<string, string> = {
	'.msi': 'windows',
	'.exe': 'windows',
	'.dmg': 'mac',
	'.app.tar.gz': 'mac',
	'.AppImage': 'linux',
	'.deb': 'linux',
	'.rpm': 'linux'
};

/** Every spelling the bundlers use for the two shipped architectures */
const ARCHES: [RegExp, string][] = [
	[/aarch64|arm64/i, 'arm64'],
	[/x86[_-]?64|amd64|x64/i, 'x64']
];

/** Where one binary ships in more than one shape */
const VARIANTS: [RegExp, string][] = [
	[/[_-]setup(\b|_)/i, 'setup'],
	[/[_-]portable(\b|_)/i, 'portable']
];

function first(patterns: [RegExp, string][], name: string): string | null {
	for (const [pattern, value] of patterns) if (pattern.test(name)) return value;
	return null;
}

/** The name an asset should carry, null when no rule places it */
export function targetName(name: string, version: string): string | null {
	const extension = EXTENSIONS.find((e) => name.endsWith(e));
	if (!extension) return null;

	const stem = name.slice(0, -extension.length);
	const arch = first(ARCHES, stem);
	if (!arch) return null;

	const parts = ['transkript-sanguis', version, OS_BY_EXTENSION[extension], arch];
	const variant = first(VARIANTS, stem);
	if (variant) parts.push(variant);
	return parts.join('_') + extension;
}

interface Asset {
	id: number;
	name: string;
}

interface Release {
	tag_name: string;
	assets: Asset[];
}

async function api(token: string, path: string, init?: RequestInit): Promise<unknown> {
	const response = await fetch(`https://api.github.com${path}`, {
		...init,
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${token}`,
			'X-GitHub-Api-Version': '2022-11-28',
			...init?.headers
		}
	});
	if (!response.ok) throw new Error(`${init?.method ?? 'GET'} ${path}: ${response.status} ${await response.text()}`);
	return response.json();
}

async function main(): Promise<number> {
	const [, , tag = '', ...flags] = process.argv;
	const dryRun = flags.includes('--dry-run');
	if (!tag) {
		console.error('usage: bun run rename-release-assets <tag> [--dry-run]');
		return 1;
	}

	const repo = process.env.GITHUB_REPOSITORY;
	const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
	if (!repo || !token) {
		console.error('GITHUB_REPOSITORY and GH_TOKEN (or GITHUB_TOKEN) must be set');
		return 1;
	}

	const version = tag.replace(/^v/, '');
	const releases = (await api(token, `/repos/${repo}/releases?per_page=100`)) as Release[];
	const release = releases.find((r) => r.tag_name === tag);

	// Every build failed, their red jobs already say so
	if (!release) {
		console.log(`no release for ${tag}, nothing to rename`);
		return 0;
	}

	let renamed = 0;
	let failed = 0;
	for (const asset of release.assets) {
		const wanted = targetName(asset.name, version);
		if (!wanted) {
			console.log(`  skip    ${asset.name} (no rule)`);
			continue;
		}
		if (wanted === asset.name) {
			console.log(`  ok      ${asset.name}`);
			continue;
		}
		if (dryRun) {
			console.log(`  would   ${asset.name} -> ${wanted}`);
			renamed++;
			continue;
		}

		try {
			await api(token, `/repos/${repo}/releases/assets/${asset.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: wanted })
			});
			console.log(`  renamed ${asset.name} -> ${wanted}`);
			renamed++;
		} catch (error) {
			console.error(`  FAILED  ${asset.name} -> ${wanted}: ${(error as Error).message}`);
			failed++;
		}
	}

	console.log(`${renamed} renamed, ${failed} failed, ${release.assets.length} assets on ${tag}`);
	return failed > 0 ? 1 : 0;
}

if (import.meta.main) process.exit(await main());
