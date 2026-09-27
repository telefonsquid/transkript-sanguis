import { analyteById } from './catalogue';
import type { Sex } from './types';
import { unitFactor } from './units';

/*
 * Every clinical formula the app computes or checks against, in the catalogue's canonical units.
 * Unit conversions come from the catalogue so a fixed factor there fixes them here too.
 */

/** Value in the canonical unit of an analyte, converted into one of its listed units */
function toUnit(id: string, unit: string, v: number): number {
	return v / unitFactor(analyteById.get(id)!, unit)!;
}

function fromUnit(id: string, unit: string, v: number): number {
	return v * unitFactor(analyteById.get(id)!, unit)!;
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
export function vermeulen(tt: number, shbg: number, albuminGl: number): number {
	const kAlb = 3.6e4;
	const kShbg = 1e9;
	const n = 1 + kAlb * (albuminGl / 69_000);
	const T = tt * 1e-9;
	const S = shbg * 1e-9;
	const a = n * kShbg;
	const b = n + kShbg * (S - T);
	return ((-b + Math.sqrt(b * b + 4 * a * T)) / (2 * a)) * 1e9;
}

/** Albumin Vermeulen assumes when none was measured, in g/dl */
export const ASSUMED_ALBUMIN = 4.3;

/** Free testosterone in pg/ml from testosterone (ng/ml), SHBG (nmol/l) and albumin (g/dl) */
export function freeTestosterone(tt: number, shbg: number, albumin = ASSUMED_ALBUMIN): number {
	const nmol = vermeulen(toUnit('testosterone', 'nmol/l', tt), shbg, toUnit('albumin', 'g/l', albumin));
	return fromUnit('free-t-calc', 'nmol/l', nmol);
}

/** Free androgen index in % from testosterone (ng/ml) and SHBG (nmol/l) */
export function fai(tt: number, shbg: number): number {
	return (toUnit('testosterone', 'nmol/l', tt) / shbg) * 100;
}

export const nonHdl = (cholesterol: number, hdl: number) => cholesterol - hdl;

export const ldlHdl = (ldl: number, hdl: number) => ldl / hdl;

/** Glucose in mg/dl, insulin in µU/ml */
export const homaIr = (glucose: number, insulin: number) => (glucose * insulin) / 405;

/** Iron each mg of transferrin can carry, folded into the percentage: 100 ÷ 1.41 µg/mg */
const TSAT_FACTOR = 70.9;

/** Transferrin saturation in % from iron (µg/dl) and transferrin (mg/dl) */
export const tsat = (iron: number, transferrin: number) => (iron * TSAT_FACTOR) / transferrin;

export const bmi = (weight: number, heightCm: number) => weight / (heightCm / 100) ** 2;

/** Red cell indices from hematocrit (%), erythrocytes (/pl) and hemoglobin (g/dl) */
export const mcv = (hematocrit: number, erythrocytes: number) => (hematocrit / erythrocytes) * 10;
export const mch = (hemoglobin: number, erythrocytes: number) => (hemoglobin / erythrocytes) * 10;
export const mchc = (hemoglobin: number, hematocrit: number) => (hemoglobin / hematocrit) * 100;

/** HbA1c from NGSP % to IFCC mmol/mol */
export const hba1cIfcc = (ngsp: number) => (ngsp - 2.15) * 10.929;

/** Estimated average glucose in mg/dl from HbA1c in % (ADAG) */
export const eag = (ngsp: number) => 28.7 * ngsp - 46.7;
