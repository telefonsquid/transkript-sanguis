import { analyteById } from './catalogue';
import * as f from './formulas';
import { ageAt, parseValue, toTime } from './parse';
import type { Analyte, CustomAnalyte, Draw, Input, Measurement, Phase, Profile, Range, Sex, Text } from './types';
import { unitFactor } from './units';

export interface Issue {
	drawId: string;
	date: string;
	analyte: string;
	value: string;
	kind: 'value' | 'unit' | 'analyte';
	detail?: string;
}

export interface ResolvedPhase extends Phase {
	/** The stretch before the first phase, not stored in the profile */
	implicit?: boolean;
}

export interface Built {
	measurements: Measurement[];
	issues: Issue[];
	phases: ResolvedPhase[];
	labs: string[];
	drawTimes: number[];
	/** First phase start on an HRT profile */
	hrtStart?: string;
}

export const BASELINE = 'baseline';

/** Custom values carry no curated text, `what` explains that in both languages */
export function customToAnalyte(c: CustomAnalyte, what: Text): Analyte {
	const text = { en: c.name, de: c.name };
	return {
		id: c.id,
		name: text,
		unit: c.unit,
		decimals: 2,
		group: c.group ?? 'other',
		custom: true,
		info: { en: { what: what.en, why: '' }, de: { what: what.de, why: '' } },
		refs: []
	};
}

export function resolvePhases(profile: Profile): ResolvedPhase[] {
	const sorted = [...profile.phases].sort((a, b) => a.start.localeCompare(b.start));
	return [{ id: BASELINE, label: '', start: '', implicit: true }, ...sorted];
}

function phaseAt(phases: ResolvedPhase[], date: string): string {
	let current = BASELINE;
	for (const p of phases) {
		if (p.implicit) continue;
		const started = p.afterDraw ? date > p.start : date >= p.start;
		if (started) current = p.id;
	}
	return current;
}

const round = (v: number, decimals: number) => String(+v.toFixed(decimals));

interface Parsed {
	value: number;
	censor?: '<' | '>';
	raw: string;
}

/**
 * Turns a profile's printed results into measurements in canonical units, assigns
 * medication phases and adds computed series. Anything unreadable becomes an issue, never an error.
 */
export function buildProfile(profile: Profile | null, lookup: (id: string) => Analyte | undefined): Built {
	if (!profile) return { measurements: [], issues: [], phases: [], labs: [], drawTimes: [] };

	const phases = resolvePhases(profile);
	const out: Measurement[] = [];
	const issues: Issue[] = [];
	const hrt = profile.therapy !== 'none';
	const sexes: Sex[] = hrt || !profile.sex ? ['female', 'male'] : [profile.sex];

	for (const draw of profile.draws) {
		const base = {
			drawId: draw.id,
			date: draw.date,
			t: toTime(draw.date, draw.time),
			lab: draw.lab?.trim() ?? '',
			report: draw.report,
			rangesFor: draw.rangesFor,
			phase: phaseAt(phases, draw.date)
		};
		const values = new Map<string, Parsed>();

		for (const res of draw.results) {
			const issue = (kind: Issue['kind'], detail?: string) =>
				issues.push({ drawId: draw.id, date: draw.date, analyte: res.analyte, value: res.value, kind, detail });

			const a = lookup(res.analyte);
			if (!a) {
				issue('analyte');
				continue;
			}
			const parsed = parseValue(res.value);
			if (!parsed) {
				issue('value');
				continue;
			}
			const factor = unitFactor(a, res.unit);
			if (factor === undefined) {
				issue('unit', res.unit);
				continue;
			}

			const scaled = (v: number | undefined) => (v === undefined ? undefined : v * factor);
			const labRef: Range | undefined =
				res.low !== undefined || res.high !== undefined || res.rangeNote
					? { low: scaled(res.low), high: scaled(res.high), printed: { low: res.low, high: res.high }, note: res.rangeNote }
					: undefined;
			const value = parsed.value * factor;
			values.set(a.id, { value, censor: parsed.censor, raw: res.value });
			out.push({
				...base,
				analyte: a.id,
				value,
				censor: parsed.censor,
				raw: res.value,
				printedUnit: factor === 1 ? undefined : res.unit,
				labRef,
				labFlag: res.flag,
				suspect: res.suspect,
				note: res.note
			});
		}

		derive(draw, profile, sexes, values, (analyte, value, inputs, censor) => {
			const a = analyteById.get(analyte)!;
			out.push({ ...base, analyte, value, censor, raw: round(value, a.decimals), derived: a.derived, inputs });
		});
	}

	out.sort((a, b) => a.t - b.t);
	const labs = [...new Set(profile.draws.map((d) => d.lab?.trim() ?? ''))].sort();
	const drawTimes = [...new Set(out.map((m) => m.t))].sort((a, b) => a - b);
	const hrtStart = hrt ? phases.find((p) => !p.implicit)?.start : undefined;
	return { measurements: out, issues, phases, labs, drawTimes, hrtStart };
}

type Emit = (analyte: string, value: number, inputs: Input[], censor?: '<' | '>') => void;

/** Computed series fill gaps the labs left, marked so they never pass as printed values */
function derive(draw: Draw, profile: Profile, sexes: Sex[], v: Map<string, Parsed>, emit: Emit) {
	const exact = (id: string) => {
		const p = v.get(id);
		return p && !p.censor ? p.value : undefined;
	};
	const input = (of: string): Input => ({ of, value: v.get(of)!.value, censor: v.get(of)!.censor });
	const age = ageAt(profile.birth, draw.date);
	const suffix = (sex: Sex) => (sex === 'female' ? 'f' : 'm');

	const crea = exact('creatinine');
	if (crea !== undefined && age !== undefined) {
		for (const sex of sexes) emit(`egfr-${suffix(sex)}`, f.ckdEpi2009(crea, age, sex), [input('creatinine'), { of: 'age', value: age }]);
	}

	const cys = exact('cystatin-c');
	if (cys !== undefined && age !== undefined) {
		for (const sex of sexes) emit(`egfr-cys-${suffix(sex)}`, f.ckdEpiCystatin2012(cys, age, sex), [input('cystatin-c'), { of: 'age', value: age }]);
	}

	const chol = exact('cholesterol');
	const hdl = exact('hdl');
	const ldl = exact('ldl');
	if (chol !== undefined && hdl !== undefined && !v.has('non-hdl')) emit('non-hdl', f.nonHdl(chol, hdl), [input('cholesterol'), input('hdl')]);
	if (ldl !== undefined && hdl !== undefined && hdl > 0 && !v.has('ldl-hdl')) emit('ldl-hdl', f.ldlHdl(ldl, hdl), [input('ldl'), input('hdl')]);

	// A testosterone below the detection limit still gives an upper bound for both indices
	const tt = v.get('testosterone');
	const shbg = exact('shbg');
	if (tt && tt.censor !== '>' && shbg !== undefined && shbg > 0) {
		const censor = tt.censor;
		if (!v.has('fai')) emit('fai', f.fai(tt.value, shbg), [input('testosterone'), input('shbg')], censor);

		const alb = exact('albumin');
		const albumin: Input = alb !== undefined ? input('albumin') : { of: 'albumin', value: f.ASSUMED_ALBUMIN, assumed: true };
		if (!v.has('free-t-calc')) emit('free-t-calc', f.freeTestosterone(tt.value, shbg, albumin.value), [input('testosterone'), input('shbg'), albumin], censor);
	}

	const glucose = exact('glucose');
	const insulin = exact('insulin');
	if (glucose !== undefined && insulin !== undefined && draw.fasting !== false) {
		emit('homa-ir', f.homaIr(glucose, insulin), [input('glucose'), input('insulin')]);
	}

	const iron = exact('iron');
	const trf = exact('transferrin');
	if (iron !== undefined && trf !== undefined && trf > 0 && !v.has('tsat')) emit('tsat', f.tsat(iron, trf), [input('iron'), input('transferrin')]);

	const weight = exact('weight');
	if (weight !== undefined && profile.height) emit('bmi', f.bmi(weight, profile.height), [input('weight'), { of: 'height', value: profile.height }]);
}
