import type { HrtTherapy, Reference, RefKind, Text } from '../types';

type Bounds = [low: number | undefined, high: number | undefined];

interface Options {
	id?: string;
	label?: Text;
	note?: Text;
	therapy?: HrtTherapy;
	age?: [number, number];
}

export const T = (en: string, de: string): Text => ({ en, de });

function make(kind: RefKind, id: string, label: Text, [low, high]: Bounds, source: string, o: Options): Reference {
	return { id, kind, label, low, high, source, note: o.note, therapy: o.therapy, age: o.age };
}

export const female = (bounds: Bounds, source: string, o: Options = {}) =>
	make('female', o.id ?? 'female', o.label ?? T('Cis women', 'Cis Frauen'), bounds, source, o);

export const male = (bounds: Bounds, source: string, o: Options = {}) =>
	make('male', o.id ?? 'male', o.label ?? T('Cis men', 'Cis Männer'), bounds, source, o);

/** Population range that does not differ by sex */
export const adult = (bounds: Bounds, source: string, o: Options = {}) =>
	make('adult', o.id ?? 'adult', o.label ?? T('Adults', 'Erwachsene'), bounds, source, o);

export const transWomen = (bounds: Bounds, source: string, o: Options = {}) =>
	make('trans', o.id ?? 'trans-f', o.label ?? T('Trans women on HRT', 'Trans Frauen unter HRT'), bounds, source, {
		...o,
		therapy: 'feminizing'
	});

export const transMen = (bounds: Bounds, source: string, o: Options = {}) =>
	make('trans', o.id ?? 'trans-m', o.label ?? T('Trans men on HRT', 'Trans Männer unter HRT'), bounds, source, {
		...o,
		therapy: 'masculinizing'
	});

export const target = (id: string, label: Text, bounds: Bounds, source: string, o: Options = {}) =>
	make('target', id, label, bounds, source, o);

export const clinical = (id: string, label: Text, bounds: Bounds, source: string, o: Options = {}) =>
	make('clinical', id, label, bounds, source, o);

export const context = (id: string, label: Text, bounds: Bounds, source: string, o: Options = {}) =>
	make('context', id, label, bounds, source, o);
