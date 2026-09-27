/**
 * Writes the app version into every file that carries it, a mismatch only fails halfway through CI.
 * Refuses a version without a CHANGELOG.md section, the release notes come from there.
 *
 *   bun run version:set 0.2.0
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { versionHeading } from '../src/lib/release';

const ROOT = join(import.meta.dir, '..');
const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
	console.error('usage: bun run version:set <major.minor.patch>');
	process.exit(1);
}

const read = (file: string) => readFileSync(join(ROOT, file), 'utf8');

/** Replaces the first match in a file, or stops */
function patch(file: string, pattern: RegExp, replacement: string) {
	const before = read(file);
	if (!pattern.test(before)) {
		console.error(`${file}: found nothing to replace (${pattern})`);
		process.exit(1);
	}
	writeFileSync(join(ROOT, file), before.replace(pattern, replacement));
	console.log(`  ${file}`);
}

const hasSection = read('CHANGELOG.md')
	.split(/\r?\n/)
	.some((line) => versionHeading(line)?.version === version);
if (!hasSection) {
	console.error(`CHANGELOG.md has no "## ${version} — <date>" section yet. Write it first.`);
	process.exit(1);
}

console.log(`Setting version ${version} in:`);
patch('package.json', /"version": "[^"]+"/, `"version": "${version}"`);
patch('src-tauri/tauri.conf.json', /"version": "[^"]+"/, `"version": "${version}"`);

// The first version in Cargo.toml is the package, the ones below belong to dependencies
patch('src-tauri/Cargo.toml', /version = "[^"]+"/, `version = "${version}"`);
patch('src-tauri/Cargo.lock', /(name = "transkript-sanguis"\r?\nversion = )"[^"]+"/, `$1"${version}"`);

console.log(`
Next:
  git commit -am "release ${version}"
  git tag v${version}
  git push origin main --tags

CI builds every platform and opens a DRAFT release. Review it on GitHub and
publish when the bundles look right.`);
