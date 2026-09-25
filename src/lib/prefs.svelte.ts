import type { Lang } from './data/types';

export type Theme = 'system' | 'light' | 'dark';

interface Prefs {
	lang: Lang;
	/** Show the analyte name in the other language next to the main one */
	altNames: boolean;
	theme: Theme;
}

const KEY = 'laborwerte:prefs:v1';

function detectLang(): Lang {
	try {
		return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
	} catch {
		return 'en';
	}
}

function load(): Prefs {
	const defaults: Prefs = { lang: detectLang(), altNames: true, theme: 'system' };
	try {
		const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
		return {
			lang: saved.lang === 'de' || saved.lang === 'en' ? saved.lang : defaults.lang,
			altNames: typeof saved.altNames === 'boolean' ? saved.altNames : defaults.altNames,
			theme: ['system', 'light', 'dark'].includes(saved.theme) ? saved.theme : defaults.theme
		};
	} catch {
		return defaults;
	}
}

/** UI preferences shared by every profile */
export const prefs: Prefs = $state(load());

export function persistPrefs() {
	try {
		localStorage.setItem(KEY, JSON.stringify($state.snapshot(prefs)));
	} catch {
		// Storage can be blocked, the app still works for this session
	}
}
