/**
 * Prints one release's section of CHANGELOG.md for the GitHub release body.
 * Called by .github/workflows/release.yml with the tag name.
 *
 *   bun run release-notes v0.1.0
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { releaseSection } from '../src/lib/release';

const wanted = process.argv[2] ?? '';
if (!wanted) {
	console.error('usage: bun run release-notes <version>');
	process.exit(1);
}

const body = releaseSection(readFileSync(join(import.meta.dir, '..', 'CHANGELOG.md'), 'utf8'), wanted);
if (body === null) {
	console.error(`CHANGELOG.md has no section for ${wanted}`);
	process.exit(1);
}

console.log(body);
