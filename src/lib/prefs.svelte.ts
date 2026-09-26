import { SLUG } from './app';
import type { Lang } from './data/types';

export type Theme = 'system' | 'light' | 'dark';

interface Prefs {
	lang: Lang;
	/** Language shown next to the main one for analyte names */
	second: Lang | null;
	theme: Theme;
	/** Turns animations off even when the system allows them */
	reduceMotion: boolean;
}

const KEY = `${SLUG}:prefs:v1`;

function detectLang(): Lang {
	try {
		return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
	} catch {
		return 'en';
	}
}

function load(): Prefs {
	const lang = detectLang();
	const defaults: Prefs = { lang, second: lang === 'de' ? 'en' : 'de', theme: 'system', reduceMotion: false };
	try {
		const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
		const isLang = (v: unknown): v is Lang => v === 'de' || v === 'en';
		return {
			lang: isLang(saved.lang) ? saved.lang : defaults.lang,
			second: isLang(saved.second) || saved.second === null ? saved.second : defaults.second,
			theme: ['system', 'light', 'dark'].includes(saved.theme) ? saved.theme : defaults.theme,
			reduceMotion: saved.reduceMotion === true
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
