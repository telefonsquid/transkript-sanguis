import type { Analyte } from './types';

/**
 * Units as a quantity per volume or as a plain amount. Two units convert by their scales when they
 * measure the same quantity, and across quantities (mass to molar, IU to mass) through a unit the
 * catalogue lists with its factor, so no molar masses live here.
 */
interface Parsed {
	dim: string;
	scale: number;
}

const PREFIX: Record<string, number> = { '': 1, k: 1e3, d: 1e-1, c: 1e-2, m: 1e-3, µ: 1e-6, u: 1e-6, n: 1e-9, p: 1e-12, f: 1e-15 };

// Cell counts, G and T stay case sensitive because g is gram
const COUNT: Record<string, number> = { '': 1, Zellen: 1, cells: 1, Tsd: 1e3, 'Tsd.': 1e3, Mio: 1e6, 'Mio.': 1e6, G: 1e9, Gpt: 1e9, T: 1e12, Tpt: 1e12 };

const BASE: Record<string, [string, number]> = {
	g: ['g', 1],
	mol: ['mol', 1],
	Mol: ['mol', 1],
	eq: ['eq', 1],
	Eq: ['eq', 1],
	val: ['eq', 1],
	U: ['U', 1],
	u: ['U', 1],
	IU: ['U', 1],
	iU: ['U', 1],
	kat: ['U', 6e7]
};

const SUPERSCRIPT = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/** Undoes what OCR and chat assistants do to printed units: LaTeX, spacing, 1 or I read for l, o1 for ol */
export function cleanUnit(raw: string): string {
	return raw
		.replace(/\\mu\s*/g, 'µ')
		.replace(/\\(?:text|mathrm)\{([^}]*)\}/g, '$1')
		.replace(/[$\\{}]/g, '')
		.replace(/\s+/g, '')
		.replace(/μ/g, 'µ')
		.replace(/mcg/gi, 'µg')
		.replace(/[×x*·]?10(?:\^|\*\*?|e|E)(\d+)/g, '10^$1')
		.replace(/[×x*·]?10([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, e: string) => `10^${[...e].map((c) => SUPERSCRIPT.indexOf(c)).join('')}`)
		.replace(/mo[1Il|]/g, 'mol')
		.replace(/^([kmµunp]?)lU/, '$1IU')
		.replace(/(^|\/)([dcmµunpf]?)[1Ii|]$/, '$1$2l')
		.replace(/(\d),(\d)/g, '$1.$2')
		.replace(/m2\b|m2$/g, 'm²');
}

/** Comparison form for units outside the grammar, like "%", "ratio" or "ml/min/1.73 m²" */
function key(unit: string): string {
	return unit
		.toLowerCase()
		.replace(/²/g, '2')
		.replace(/100(?:leuk\w*|wbc|lc|leu)\.?/, '100wbc')
		.replace(/sek|sec/g, 's')
		.replace(/std|stunde/g, 'h')
		.replace(/[^a-z0-9%.µ]/g, '')
		.replace(/mm1h/, 'mmh');
}

function amount(s: string): Parsed | undefined {
	const pow = s.match(/^10\^(\d+)$/);
	if (pow) return { dim: 'n', scale: 10 ** Number(pow[1]) };
	if (Object.hasOwn(COUNT, s)) return { dim: 'n', scale: COUNT[s] };

	const m = s.match(/^([kdcmµunpf]?)(g|[mM]ol|[eE]q|val|I?U|iU|u|kat)$/);
	if (!m) return undefined;
	const [dim, scale] = BASE[m[2]];
	return { dim, scale: PREFIX[m[1]] * scale };
}

function volume(s: string): number | undefined {
	if (/^mm[³3]$/.test(s)) return 1e-6;
	const m = s.match(/^([kdcmµunpf]?)[lL]$/);
	return m ? PREFIX[m[1]] : undefined;
}

/** Reads a cleaned unit as quantity and scale, undefined for anything outside the grammar */
function parse(s: string): Parsed | undefined {
	if (/DDU/i.test(s)) return undefined;
	s = s.replace(/FEU$/i, '');

	const parts = s.split('/');
	if (parts.length === 1) {
		if (/^µm[³3]$/.test(s)) return { dim: 'l', scale: 1e-15 };
		const vol = volume(s);
		if (vol !== undefined) return { dim: 'l', scale: vol };
		const a = amount(s);
		return a && a.dim !== 'n' ? a : undefined;
	}
	if (parts.length !== 2) return undefined;

	const a = amount(parts[0]);
	const vol = volume(parts[1]);
	if (!a || vol === undefined) return undefined;
	return { dim: `${a.dim}/l`, scale: a.scale / vol };
}

/** Every unit the catalogue names for an analyte, with the factor to its canonical unit */
function listed(a: Analyte): { unit: string; factor: number }[] {
	return [{ unit: a.unit, factor: 1 }, ...(a.units ?? []), ...(a.si ? [{ unit: a.si.unit, factor: 1 / a.si.factor }] : [])];
}

/** Factor that turns a value in the printed unit into the analyte's canonical unit */
export function unitFactor(a: Analyte, unit: string | undefined): number | undefined {
	if (!unit?.trim()) return 1;
	const s = cleanUnit(unit);
	const p = parse(s);

	if (p) {
		for (const u of listed(a)) {
			const q = parse(cleanUnit(u.unit));
			if (q?.dim === p.dim) return (p.scale / q.scale) * u.factor;
		}
		return undefined;
	}
	const k = key(s);
	if (!k) return undefined;
	return listed(a).find((u) => !parse(cleanUnit(u.unit)) && key(cleanUnit(u.unit)) === k)?.factor;
}

/** Listed units whose factor disagrees with the one their spelling implies */
export function unitConflicts(a: Analyte): string[] {
	return listed(a)
		.filter((u) => {
			const f = unitFactor(a, u.unit);
			return f === undefined || Math.abs(f / u.factor - 1) > 1e-3;
		})
		.map((u) => u.unit);
}

/** Whether a value without any unit can only mean the canonical one, like a percentage or a ratio */
export function unitless(a: Analyte): boolean {
	return !parse(cleanUnit(a.unit));
}

const COMMON = [
	...['g/dl', 'g/l', 'mg/dl', 'mg/l', 'µg/dl', 'µg/l', 'µg/ml', 'ng/dl', 'ng/ml', 'ng/l', 'pg/ml'],
	...['mmol/l', 'µmol/l', 'nmol/l', 'pmol/l'],
	...['U/l', 'U/ml', 'mU/l', 'mU/ml', 'µU/ml', 'IU/l', 'IU/ml', 'mIU/l', 'mIU/ml', 'µIU/ml', 'kU/l'],
	...['/nl', '/pl', '/µl', 'G/l', 'T/l', '10^9/l', '10^12/l', 'Tsd/µl', 'Mio/µl'],
	'mEq/l'
];

// Common spellings count as accepted up to a factor of about 300 from the canonical unit
const REACH = 2.5;

/** Units the app accepts for an analyte, canonical first, then the catalogue's, then common spellings that convert */
export function unitChoices(a: Analyte): string[] {
	const out = listed(a).map((u) => u.unit);
	for (const u of COMMON) {
		const f = unitFactor(a, u);
		if (f !== undefined && Math.abs(Math.log10(f)) <= REACH) out.push(u);
	}
	return [...new Set(out)];
}

/** The accepted spelling of a printed unit, undefined when the app cannot convert it */
export function acceptUnit(a: Analyte, printed: string): string | undefined {
	if (!printed.trim()) return unitless(a) ? a.unit : undefined;
	const f = unitFactor(a, printed);
	if (f === undefined) return undefined;

	const s = cleanUnit(printed);
	const p = parse(s);
	const choices = unitChoices(a);
	const same = (u: string) => {
		const q = parse(cleanUnit(u));
		return p ? q?.dim === p.dim && Math.abs(q.scale / p.scale - 1) < 1e-9 : !q && key(cleanUnit(u)) === key(s);
	};
	return choices.find((u) => cleanUnit(u) === s) ?? choices.find(same) ?? s;
}

/** Middle of the curated ranges on a log scale, what a value in the canonical unit usually looks like */
function typical(a: Analyte): number | undefined {
	const bounds = a.refs.flatMap((r) => [r.low, r.high]).filter((v): v is number => v !== undefined && v > 0);
	if (!bounds.length) return undefined;
	return 10 ** (bounds.reduce((s, v) => s + Math.log10(v), 0) / bounds.length);
}

const common = (a: string, b: string) => {
	let i = 0;
	while (i < a.length && i < b.length && a[i].toLowerCase() === b[i].toLowerCase()) i++;
	return i;
};

/**
 * Best guess for a unit the app cannot read, from where value and printed range land against the
 * curated ranges. Among equal units the spelling closest to the printed one wins.
 */
export function suggestUnit(a: Analyte, printed: string, values: (number | undefined)[]): string | undefined {
	const mid = typical(a);
	const points = values.filter((v): v is number => v !== undefined && v > 0);
	const choices = unitChoices(a).map((unit) => ({ unit, factor: unitFactor(a, unit)! }));
	const s = cleanUnit(printed);
	const closest = (group: typeof choices) => group.reduce((win, c) => (common(c.unit, s) > common(win.unit, s) ? c : win)).unit;

	// Without a size to go by, only the spelling is left
	if (!mid || !points.length) return unitless(a) || !s || !choices.length ? a.unit : closest(choices);

	const distance = (f: number) => points.reduce((s, v) => s + Math.abs(Math.log10((v * f) / mid)), 0) / points.length;
	const best = Math.min(...choices.map((c) => distance(c.factor)));
	return closest(choices.filter((c) => distance(c.factor) - best < 1e-9));
}
