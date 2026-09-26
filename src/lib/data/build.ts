import { analyteById } from './catalogue';
import { ageAt, parseValue, toTime } from './parse';
import type { Analyte, CustomAnalyte, Draw, Measurement, Phase, Profile, Range, Sex } from './types';
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

export function customToAnalyte(c: CustomAnalyte): Analyte {
	const text = { en: c.name, de: c.name };
	return {
		id: c.id,
		name: text,
		unit: c.unit,
		decimals: 2,
		group: c.group ?? 'other',
		custom: true,
		info: {
			en: { what: 'A value you added yourself. It only carries the range your lab printed.', why: '' },
			de: { what: 'Ein selbst angelegter Wert. Er trägt nur den Bereich, den dein Labor angegeben hat.', why: '' }
		},
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

/** CKD-EPI 2009 in its published table form, which reproduces the values German labs print */
export function ckdEpi2009(creatinine: number, age: number, sex: Sex): number {
	const k = sex === 'female' ? 0.7 : 0.9;
	const a = sex === 'female' ? -0.329 : -0.411;
	const base = sex === 'female' ? 144 : 141;
	const ratio = creatinine / k;
	return base * Math.pow(ratio, ratio <= 1 ? a : -1.209) * Math.pow(0.993, age);
}

export function ckdEpiCystatin2012(cystatin: number, age: number, sex: Sex): number {
	const ratio = cystatin / 0.8;
	return 133 * Math.pow(Math.min(ratio, 1), -0.499) * Math.pow(Math.max(ratio, 1), -1.328) * Math.pow(0.996, age) * (sex === 'female' ? 0.932 : 1);
}

/** Vermeulen 1999: free testosterone in nmol/l from total testosterone (nmol/l), SHBG (nmol/l) and albumin (g/l) */
export function freeTestosterone(tt: number, shbg: number, albuminGl: number): number {
	const kAlb = 3.6e4;
	const kShbg = 1e9;
	const n = 1 + kAlb * (albuminGl / 69_000);
	const T = tt * 1e-9;
	const S = shbg * 1e-9;
	const a = n * kShbg;
	const b = n + kShbg * (S - T);
	return ((-b + Math.sqrt(b * b + 4 * a * T)) / (2 * a)) * 1e9;
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

		derive(draw, profile, sexes, values, (analyte, value, from, censor) => {
			const a = analyteById.get(analyte)!;
			out.push({ ...base, analyte, value, censor, raw: round(value, a.decimals), derived: a.derived, note: from });
		});
	}

	out.sort((a, b) => a.t - b.t);
	const labs = [...new Set(profile.draws.map((d) => d.lab?.trim() ?? ''))].sort();
	const drawTimes = [...new Set(out.map((m) => m.t))].sort((a, b) => a - b);
	const hrtStart = hrt ? phases.find((p) => !p.implicit)?.start : undefined;
	return { measurements: out, issues, phases, labs, drawTimes, hrtStart };
}

type Emit = (analyte: string, value: number, from: string, censor?: '<' | '>') => void;

/** Computed series fill gaps the labs left, marked so they never pass as printed values */
function derive(draw: Draw, profile: Profile, sexes: Sex[], v: Map<string, Parsed>, emit: Emit) {
	const exact = (id: string) => {
		const p = v.get(id);
		return p && !p.censor ? p.value : undefined;
	};
	const age = ageAt(profile.birth, draw.date);

	const crea = exact('creatinine');
	if (crea !== undefined && age !== undefined) {
		for (const sex of sexes) {
			emit(`egfr-${sex === 'female' ? 'f' : 'm'}`, ckdEpi2009(crea, age, sex), `Creatinine ${v.get('creatinine')!.raw}, age ${age}`);
		}
	}

	const cys = exact('cystatin-c');
	if (cys !== undefined && age !== undefined) {
		for (const sex of sexes) {
			emit(`egfr-cys-${sex === 'female' ? 'f' : 'm'}`, ckdEpiCystatin2012(cys, age, sex), `Cystatin C ${v.get('cystatin-c')!.raw}, age ${age}`);
		}
	}

	const chol = exact('cholesterol');
	const hdl = exact('hdl');
	const ldl = exact('ldl');
	if (chol !== undefined && hdl !== undefined && !v.has('non-hdl')) emit('non-hdl', chol - hdl, `${round(chol, 0)} − ${round(hdl, 0)}`);
	if (ldl !== undefined && hdl !== undefined && hdl > 0 && !v.has('ldl-hdl')) emit('ldl-hdl', ldl / hdl, `${round(ldl, 0)} ÷ ${round(hdl, 0)}`);

	// A testosterone below the detection limit still gives an upper bound for both indices
	const tt = v.get('testosterone');
	const shbg = exact('shbg');
	if (tt && tt.censor !== '>' && shbg !== undefined && shbg > 0) {
		const ttNmol = tt.value * 3.467;
		const censor = tt.censor;
		if (!v.has('fai')) emit('fai', (ttNmol / shbg) * 100, `Testosterone ${tt.raw} ng/ml, SHBG ${round(shbg, 1)} nmol/l`, censor);

		const alb = exact('albumin');
		const albGl = alb !== undefined ? alb * 10 : 43;
		const from = `Testosterone ${tt.raw} ng/ml, SHBG ${round(shbg, 1)} nmol/l, albumin ${alb !== undefined ? round(alb, 1) + ' g/dl' : '4.3 g/dl assumed'}`;
		if (!v.has('free-t-calc')) emit('free-t-calc', freeTestosterone(ttNmol, shbg, albGl) * 288.4, from, censor);
	}

	const glucose = exact('glucose');
	const insulin = exact('insulin');
	if (glucose !== undefined && insulin !== undefined && draw.fasting !== false) {
		emit('homa-ir', (glucose * insulin) / 405, `Glucose ${round(glucose, 0)} mg/dl × insulin ${round(insulin, 1)} µU/ml ÷ 405`);
	}

	const iron = exact('iron');
	const trf = exact('transferrin');
	if (iron !== undefined && trf !== undefined && trf > 0 && !v.has('tsat')) {
		emit('tsat', (iron * 70.9) / trf, `Iron ${round(iron, 0)} µg/dl × 70.9 ÷ transferrin ${round(trf, 0)} mg/dl`);
	}

	const weight = exact('weight');
	if (weight !== undefined && profile.height) {
		const m = profile.height / 100;
		emit('bmi', weight / m ** 2, `${round(weight, 1)} kg ÷ (${round(m, 2)} m)²`);
	}
}
