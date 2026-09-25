import type { Analyte, Lang, Text } from '../data/types';
import { prefs } from '../prefs.svelte';
import { de } from './de';
import { en, type Dict } from './en';

const dicts: Record<Lang, Dict> = { en, de };

/** Reading any key tracks the language, so templates update when it changes */
export const t: Dict = new Proxy({} as Dict, {
	get: (_, key) => dicts[prefs.lang][key as keyof Dict]
});

export const tx = (text: Text | undefined): string => (text ? (text[prefs.lang] ?? text.en) : '');

export const nameOf = (a: Analyte): string => tx(a.name);

/** The name in the other language, when it adds something */
export function altNameOf(a: Analyte): string | undefined {
	if (!prefs.altNames || a.custom) return undefined;
	const other = a.name[prefs.lang === 'en' ? 'de' : 'en'];
	return other && other !== nameOf(a) ? other : undefined;
}

export const locale = () => dicts[prefs.lang].locale;

export const LANGS: { id: Lang; label: string }[] = [
	{ id: 'en', label: 'English' },
	{ id: 'de', label: 'Deutsch' }
];
