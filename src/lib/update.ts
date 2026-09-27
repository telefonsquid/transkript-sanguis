/**
 * Notices a newer desktop release and links to it, installing stays with the person.
 * The one request to another host, made only once switched on. Failures stay silent.
 */
import { REPO_URL, SLUG } from './app';
import { desktop } from './desktop';
import { prefs } from './prefs.svelte';
import { isNewer } from './release';

/** Skips drafts and prereleases */
const LATEST = `https://api.github.com/repos/${new URL(REPO_URL).pathname.slice(1)}/releases/latest`;

const CACHE_KEY = `${SLUG}:latest-release`;

/** Keeps restarts well below GitHub's hourly limit and still spots a release the same day */
const MAX_AGE = 6 * 60 * 60 * 1000;

/** Set from package.json at build time */
export const appVersion: string = __APP_VERSION__;

export interface Update {
	/** Without the leading v */
	version: string;
	url: string;
}

function readCache(): Update | null {
	try {
		const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null');
		if (typeof cached?.version !== 'string' || typeof cached?.url !== 'string' || typeof cached?.at !== 'number') return null;
		return Date.now() - cached.at > MAX_AGE ? null : { version: cached.version, url: cached.url };
	} catch {
		return null;
	}
}

function writeCache(update: Update) {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify({ ...update, at: Date.now() }));
	} catch {
		// Blocked storage only costs another request next start
	}
}

async function fetchLatest(): Promise<Update | null> {
	const response = await fetch(LATEST, { headers: { Accept: 'application/vnd.github+json' } });
	if (!response.ok) return null;

	const release = (await response.json()) as { tag_name?: string; html_url?: string };
	if (!release.tag_name || !release.html_url) return null;
	return { version: release.tag_name.replace(/^v/, ''), url: release.html_url };
}

/** The newest release when it is ahead of this build, only in the desktop app with the check switched on */
export async function checkForUpdate(): Promise<Update | null> {
	if (!desktop || !prefs.updates) return null;

	let latest = readCache();
	if (!latest) {
		try {
			latest = await fetchLatest();
		} catch {
			return null;
		}
		if (!latest) return null;
		writeCache(latest);
	}
	return isNewer(latest.version, appVersion) ? latest : null;
}
