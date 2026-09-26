import { ckdEpi2009 } from './data/build';
import { ageAt, parseRange } from './data/parse';
import type { Draw, Profile, Result, Sex } from './data/types';

/*
 * Four made up people to explore the app with. Values are plausible, not real:
 * they follow published trends but belong to nobody.
 */

const CITY = 'City Lab';
const ENDO = 'Endocrinology clinic';

/** Ranges the demo labs print, in canonical units */
const shared: Record<string, string> = {
	cortisol: '6.2 - 19.4',
	tsh: '0.27 - 4.20',
	ft4: '0.93 - 1.70',
	ft3: '2.0 - 4.4',
	'anti-tpo': '< 34',
	leukocytes: '4.0 - 10.0',
	mcv: '80 - 96',
	mch: '27 - 33',
	mchc: '32 - 36',
	rdw: '11.5 - 14.5',
	platelets: '150 - 400',
	mpv: '9.0 - 12.5',
	'neutrophils-pct': '40 - 74',
	'neutrophils-abs': '1.8 - 7.7',
	'lymphocytes-pct': '19 - 48',
	'lymphocytes-abs': '1.0 - 4.8',
	'monocytes-pct': '3 - 9',
	'monocytes-abs': '0.2 - 0.8',
	'eosinophils-pct': '0 - 7',
	'eosinophils-abs': '0.0 - 0.5',
	'basophils-pct': '0 - 1.5',
	'basophils-abs': '0.0 - 0.2',
	quick: '70 - 130',
	inr: '0.85 - 1.15',
	aptt: '25 - 37',
	fibrinogen: '180 - 400',
	'd-dimer': '< 0.5',
	sodium: '136 - 145',
	potassium: '3.5 - 5.1',
	chloride: '98 - 107',
	calcium: '2.15 - 2.50',
	magnesium: '0.66 - 1.07',
	phosphate: '0.81 - 1.45',
	'cystatin-c': '0.61 - 0.95',
	urea: '17 - 43',
	bilirubin: '< 1.2',
	albumin: '3.5 - 5.2',
	'total-protein': '6.6 - 8.3',
	cholesterol: '< 200',
	ldl: '< 116',
	triglycerides: '< 150',
	apob: '< 100',
	lpa: '< 30',
	glucose: '70 - 100',
	hba1c: '< 5.7',
	insulin: '2.6 - 24.9',
	ldh: '< 250',
	crp: '< 5',
	transferrin: '200 - 360',
	'vitamin-d': '30 - 100',
	b12: '197 - 771',
	folate: '> 3.9',
	homocysteine: '< 15'
};
const LAB: Record<Sex, Record<string, string>> = {
	female: {
		...shared,
		estradiol: '30.9 - 90.4',
		progesterone: '0.06 - 0.89',
		testosterone: '0.08 - 0.48',
		shbg: '32.4 - 128',
		lh: '2.4 - 12.6',
		fsh: '3.5 - 12.5',
		prolactin: '4.79 - 23.3',
		'dhea-s': '60.9 - 337',
		erythrocytes: '4.0 - 5.2',
		hemoglobin: '12.0 - 16.0',
		hematocrit: '36 - 46',
		creatinine: '0.50 - 0.90',
		'uric-acid': '2.4 - 5.7',
		alt: '< 35',
		ast: '< 35',
		ggt: '< 40',
		alp: '35 - 105',
		hdl: '> 45',
		ck: '< 170',
		iron: '37 - 145',
		ferritin: '15 - 150'
	},
	male: {
		...shared,
		estradiol: '11.3 - 43.2',
		progesterone: '0.05 - 0.15',
		testosterone: '2.49 - 8.36',
		shbg: '18.3 - 54.1',
		lh: '1.7 - 8.6',
		fsh: '1.5 - 12.4',
		prolactin: '4.04 - 15.2',
		'dhea-s': '102 - 385',
		erythrocytes: '4.5 - 5.9',
		hemoglobin: '13.5 - 17.5',
		hematocrit: '40 - 52',
		creatinine: '0.70 - 1.20',
		'uric-acid': '3.4 - 7.0',
		alt: '< 50',
		ast: '< 50',
		ggt: '< 60',
		alp: '40 - 130',
		hdl: '> 40',
		ck: '< 190',
		iron: '59 - 158',
		ferritin: '30 - 400'
	}
};

/** A plain value takes the printed range of its lab, a pair brings its own and an empty one leaves it out */
type Value = string | [value: string, range: string] | Omit<Result, 'analyte'>;

interface Extra {
	time?: string;
	fasting?: boolean;
	notes?: string[];
	/** Off for reports that print no ranges */
	ranges?: boolean;
}

/** Demo ranges are written as the lab prints them and stored as bounds */
function bounds(text: string | undefined): Pick<Result, 'low' | 'high'> {
	const r = parseRange(text);
	if (!r || r.note) return {};
	return { ...(r.low !== undefined && { low: r.low }), ...(r.high !== undefined && { high: r.high }) };
}

function draw(id: string, date: string, lab: string, rangesFor: Sex, values: Record<string, Value>, { ranges = true, ...extra }: Extra = {}): Draw {
	const results = Object.entries(values).map(([analyte, v]): Result => {
		const own: Omit<Result, 'analyte'> = typeof v === 'string' ? { value: v } : Array.isArray(v) ? { value: v[0], ...bounds(v[1]) } : v;
		const printed = typeof v === 'string' && ranges ? bounds(LAB[rangesFor][analyte]) : undefined;
		return { analyte, ...printed, ...own };
	});
	return { id, date, lab, rangesFor, results, ...extra };
}

/** Red cell indices follow from the counts, the way an analyser prints them */
function redCells(hb: number, hct: number, rbc: number): Record<string, string> {
	return {
		hemoglobin: hb.toFixed(1),
		hematocrit: hct.toFixed(1),
		erythrocytes: rbc.toFixed(2),
		mcv: ((hct / rbc) * 10).toFixed(1),
		mch: ((hb / rbc) * 10).toFixed(1),
		mchc: ((hb / hct) * 100).toFixed(1)
	};
}

/** White cell count with its differential, shares in percent of neutrophils, lymphocytes, monocytes, eosinophils, basophils */
function differential(wbc: number, shares: [number, number, number, number, number]): Record<string, string> {
	const out: Record<string, string> = { leukocytes: wbc.toFixed(1) };
	(['neutrophils', 'lymphocytes', 'monocytes', 'eosinophils', 'basophils'] as const).forEach((cell, i) => {
		out[`${cell}-pct`] = shares[i].toFixed(1);
		out[`${cell}-abs`] = ((wbc * shares[i]) / 100).toFixed(2);
	});
	return out;
}

/** City Lab prints an eGFR next to creatinine, from the equation of the sex its ranges use */
function cityEgfr(profile: Profile): Profile {
	for (const d of profile.draws) {
		const crea = d.results.find((r) => r.analyte === 'creatinine');
		const age = ageAt(profile.birth, d.date);
		if (d.lab !== CITY || !crea || age === undefined || !d.rangesFor) continue;
		const e = ckdEpi2009(parseFloat(crea.value), age, d.rangesFor);
		d.results.push({ analyte: 'egfr', value: e >= 90 ? '>90' : String(Math.round(e)), low: 60 });
	}
	return profile;
}

export function demoFeminizing(): Profile {
	const m = 'male';
	const f = 'female';
	return cityEgfr({
		id: 'demo-fem',
		name: 'Raven',
		created: new Date().toISOString(),
		therapy: 'feminizing',
		sex: 'male',
		birth: '1996',
		height: 178,
		demo: true,
		custom: [],
		reports: [],
		phases: [
			{ id: 'p1', label: 'Oral E2 4 mg + CPA 10 mg', start: '2023-03-06', regimen: 'Estradiol 2 mg twice daily, cyproterone acetate 10 mg daily' },
			{ id: 'p2', label: 'EV 5 mg/week', start: '2024-02-12', approx: true, regimen: 'Estradiol valerate 5 mg injected every 7 days, antiandrogen stopped' },
			{ id: 'p3', label: 'EV 4 mg/week', start: '2025-01-13', regimen: 'Estradiol valerate 4 mg every 7 days' }
		],
		draws: [
			draw(
				'd1',
				'2022-11-14',
				CITY,
				m,
				{
					estradiol: '28',
					testosterone: '5.92',
					shbg: '31.2',
					lh: '4.8',
					fsh: '3.9',
					prolactin: '9.1',
					'dhea-s': '286',
					cortisol: '14.2',
					...redCells(15.4, 45.1, 5.21),
					rdw: '12.6',
					platelets: '248',
					mpv: '10.4',
					...differential(6.3, [57.1, 31.4, 7.8, 3.0, 0.7]),
					sodium: '140',
					potassium: '4.3',
					chloride: '102',
					calcium: '2.38',
					creatinine: '1.02',
					urea: '31',
					'uric-acid': '5.9',
					alt: '31',
					ast: '26',
					ggt: '22',
					alp: '74',
					bilirubin: '0.7',
					albumin: '4.7',
					cholesterol: '188',
					hdl: '47',
					ldl: '118',
					triglycerides: '104',
					glucose: '88',
					hba1c: '5.2',
					insulin: '6.8',
					crp: '0.9',
					iron: '112',
					ferritin: '142',
					transferrin: '262',
					'vitamin-d': '18.5',
					tsh: '1.85',
					ft4: '1.29',
					weight: '74.0'
				},
				{ time: '08:30', fasting: true, notes: ['Baseline before HRT.'] }
			),
			draw(
				'd2',
				'2023-06-12',
				CITY,
				m,
				{
					estradiol: '96',
					testosterone: '0.21',
					shbg: '58.4',
					lh: '<0.3',
					fsh: '0.4',
					prolactin: '24.8',
					cortisol: '21.6',
					...redCells(14.2, 41.6, 4.82),
					leukocytes: '5.9',
					platelets: '256',
					sodium: '139',
					potassium: '4.2',
					creatinine: '0.95',
					alt: '24',
					ast: '21',
					ggt: '18',
					alp: '63',
					albumin: '4.5',
					cholesterol: '176',
					hdl: '55',
					ldl: '102',
					triglycerides: '138',
					crp: '2.1',
					weight: '75.2'
				},
				{ time: '09:10', notes: ['Three months on oral estradiol and CPA.'] }
			),
			draw(
				'd3',
				'2023-10-02',
				CITY,
				f,
				{
					estradiol: '142',
					testosterone: '0.12',
					shbg: '71.8',
					lh: '<0.3',
					fsh: '0.3',
					prolactin: '31.2',
					cortisol: '23.4',
					...redCells(13.3, 39.4, 4.51),
					creatinine: '0.91',
					alt: '19',
					ggt: '15',
					alp: '58',
					iron: '98',
					ferritin: '168',
					transferrin: '284',
					weight: '76.1'
				},
				{ time: '08:50', notes: ['The lab now prints female ranges.'] }
			),
			draw(
				'd4',
				'2024-01-22',
				ENDO,
				f,
				{
					estradiol: '118',
					testosterone: '0.15',
					shbg: '69.0',
					prolactin: '27.5',
					'dhea-s': '262',
					cortisol: '22.1',
					...redCells(13.1, 38.9, 4.44),
					platelets: '241',
					...differential(5.4, [55.2, 33.9, 7.4, 2.8, 0.7]),
					fibrinogen: '318',
					'd-dimer': '0.31',
					sodium: '140',
					potassium: '4.1',
					creatinine: '0.89',
					'cystatin-c': '0.86',
					alt: '21',
					albumin: '4.4',
					cholesterol: '181',
					hdl: '58',
					ldl: '104',
					triglycerides: '121',
					glucose: '84',
					hba1c: '5.1',
					insulin: '8.9',
					'vitamin-d': '31.2',
					weight: '76.8'
				},
				{ time: '08:20', fasting: true, notes: ['Last draw on oral estradiol, injections start in February.'] }
			),
			draw(
				'd5',
				'2024-05-06',
				ENDO,
				f,
				{
					estradiol: ['386', '30.9 - 90.4'],
					testosterone: ['0.31', '0.08 - 0.48'],
					shbg: '49.3',
					prolactin: ['16.4', '4.79 - 23.3'],
					hemoglobin: '13.0',
					hematocrit: '38.5',
					creatinine: '0.88',
					alt: '18',
					ast: '19',
					ggt: '14',
					crp: '0.6',
					weight: '77.4'
				},
				{ time: '10:40', ranges: false, notes: ['Drawn 3 days after the injection, near the peak.'] }
			),
			draw(
				'd6',
				'2024-11-18',
				ENDO,
				f,
				{
					estradiol: '184',
					testosterone: '0.44',
					shbg: '47.1',
					lh: '<0.3',
					fsh: '0.5',
					prolactin: '13.9',
					cortisol: '15.3',
					...redCells(12.8, 38.0, 4.32),
					rdw: '12.9',
					platelets: '233',
					mpv: '10.6',
					...differential(5.1, [54.9, 34.3, 7.6, 2.6, 0.6]),
					creatinine: '0.86',
					'cystatin-c': '0.84',
					albumin: '4.6',
					cholesterol: '172',
					hdl: '56',
					ldl: '99',
					triglycerides: '92',
					tsh: '2.10',
					ft4: '1.24',
					ferritin: '191',
					'vitamin-d': '34.8',
					weight: '77.9'
				},
				{ time: '08:05', notes: ['Trough: drawn right before the next injection.'] }
			),
			draw(
				'd7',
				'2025-06-02',
				CITY,
				f,
				{
					estradiol: '162',
					testosterone: '0.52',
					shbg: '45.0',
					lh: '0.4',
					fsh: '0.6',
					prolactin: '12.2',
					...redCells(12.9, 38.3, 4.36),
					leukocytes: '6.0',
					platelets: '229',
					sodium: '141',
					potassium: '4.4',
					calcium: '2.34',
					magnesium: '0.84',
					creatinine: '0.87',
					urea: '27',
					'uric-acid': '4.6',
					alt: '17',
					ast: '20',
					ggt: '13',
					alp: '55',
					bilirubin: '0.6',
					glucose: '86',
					hba1c: '5.2',
					insulin: '9.4',
					psa: '0.03',
					weight: '78.3'
				},
				{ time: '08:40', fasting: true }
			),
			draw(
				'd8',
				'2026-01-12',
				ENDO,
				f,
				{
					estradiol: '171',
					testosterone: '0.38',
					shbg: '46.2',
					lh: '<0.3',
					fsh: '0.4',
					prolactin: '11.8',
					'dhea-s': '241',
					...redCells(12.7, 37.6, 4.29),
					platelets: '238',
					...differential(5.6, [56.3, 33.0, 7.9, 2.2, 0.6]),
					creatinine: '0.84',
					'cystatin-c': '0.88',
					albumin: '4.5',
					cholesterol: '179',
					hdl: '57',
					ldl: '104',
					triglycerides: '95',
					apob: '82',
					lpa: '11',
					crp: '0.4',
					iron: '104',
					ferritin: '205',
					transferrin: '268',
					tsh: '1.94',
					'vitamin-d': '29.4',
					weight: '78.0'
				},
				{ time: '08:15' }
			)
		]
	});
}

export function demoMasculinizing(): Profile {
	const f = 'female';
	const m = 'male';
	return cityEgfr({
		id: 'demo-masc',
		name: 'Sam',
		created: new Date().toISOString(),
		therapy: 'masculinizing',
		sex: 'female',
		birth: '1999',
		height: 166,
		demo: true,
		custom: [],
		reports: [],
		phases: [
			{ id: 'p1', label: 'Testosterone gel 50 mg/day', start: '2023-09-04', regimen: 'Testosterone gel 50 mg daily' },
			{ id: 'p2', label: 'T undecanoate every 12 weeks', start: '2024-06-03', regimen: 'Testosterone undecanoate 1000 mg every 12 weeks' },
			{ id: 'p3', label: 'T undecanoate every 14 weeks', start: '2025-03-17', regimen: 'Interval extended after a high hematocrit' }
		],
		draws: [
			draw(
				'd1',
				'2023-07-20',
				CITY,
				f,
				{
					testosterone: '0.32',
					estradiol: '54',
					progesterone: '0.24',
					shbg: '64.1',
					lh: '5.2',
					fsh: '6.1',
					prolactin: '12.4',
					amh: '3.8',
					'dhea-s': '214',
					...redCells(12.9, 38.8, 4.41),
					rdw: '12.4',
					platelets: '271',
					mpv: '10.1',
					...differential(5.8, [55.6, 34.2, 6.9, 2.6, 0.7]),
					sodium: '139',
					potassium: '4.0',
					calcium: '2.33',
					creatinine: '0.71',
					urea: '24',
					'uric-acid': '3.6',
					alt: '14',
					ast: '18',
					ggt: '12',
					alp: '58',
					albumin: '4.5',
					ck: '88',
					cholesterol: '172',
					hdl: '64',
					ldl: '92',
					triglycerides: '78',
					glucose: '82',
					hba1c: '5.0',
					iron: '76',
					ferritin: '34',
					transferrin: '305',
					'vitamin-d': '22.1',
					tsh: '1.72',
					weight: '61.5'
				},
				{ time: '08:00', fasting: true, notes: ['Baseline before HRT, cycle day 4.'] }
			),
			draw(
				'd2',
				'2023-12-11',
				CITY,
				f,
				{
					testosterone: '3.1',
					estradiol: '62',
					shbg: '48.0',
					lh: '3.1',
					fsh: '4.2',
					...redCells(13.9, 41.9, 4.83),
					creatinine: '0.79',
					alt: '17',
					ck: '131',
					cholesterol: '170',
					hdl: '55',
					ldl: '98',
					triglycerides: '84',
					weight: '63.0'
				},
				{ time: '09:30', notes: ['Three months on gel.'] }
			),
			draw(
				'd3',
				'2024-04-15',
				ENDO,
				m,
				{
					testosterone: '4.4',
					estradiol: '51',
					shbg: '39.2',
					lh: '1.4',
					fsh: '2.2',
					...redCells(14.8, 44.6, 5.12),
					platelets: '262',
					...differential(6.1, [58.4, 31.6, 6.8, 2.5, 0.7]),
					creatinine: '0.86',
					'cystatin-c': '0.79',
					alt: '20',
					ast: '22',
					albumin: '4.6',
					cholesterol: '176',
					hdl: '49',
					ldl: '104',
					triglycerides: '96',
					ferritin: '28',
					weight: '64.8'
				},
				{ time: '10:15', notes: ['The clinic prints male ranges. Last draw on gel.'] }
			),
			draw(
				'd4',
				'2024-09-02',
				ENDO,
				m,
				{
					testosterone: '6.8',
					estradiol: '48',
					shbg: '31.4',
					lh: '<0.1',
					fsh: '0.4',
					...redCells(16.2, 48.7, 5.61),
					creatinine: '0.93',
					alt: '24',
					ggt: '18',
					ck: '214',
					weight: '66.1'
				},
				{ time: '09:45', notes: ['Week 10 of the 12 week interval.', 'Gym the day before.'] }
			),
			draw(
				'd5',
				'2025-03-10',
				ENDO,
				m,
				{
					testosterone: '5.9',
					estradiol: '44',
					shbg: '29.0',
					...redCells(16.9, 51.2, 5.84),
					rdw: '13.1',
					leukocytes: '6.4',
					platelets: '254',
					creatinine: '0.95',
					'uric-acid': '5.6',
					cholesterol: '184',
					hdl: '43',
					ldl: '118',
					triglycerides: '112',
					glucose: '88',
					hba1c: '5.2',
					insulin: '7.9',
					weight: '67.4'
				},
				{ time: '08:10', fasting: true, notes: ['Hematocrit above 50 %: injection interval extended to 14 weeks.'] }
			),
			draw(
				'd6',
				'2025-10-06',
				CITY,
				m,
				{
					testosterone: '5.1',
					estradiol: '39',
					shbg: '30.2',
					lh: '<0.1',
					...redCells(16.1, 48.3, 5.52),
					platelets: '248',
					...differential(6.8, [60.1, 30.2, 6.5, 2.4, 0.8]),
					sodium: '141',
					potassium: '4.4',
					calcium: '2.40',
					creatinine: '0.94',
					urea: '33',
					'uric-acid': '5.8',
					alt: '22',
					ast: '24',
					ggt: '17',
					alp: '72',
					ck: '176',
					iron: '102',
					ferritin: '41',
					transferrin: '271',
					'vitamin-d': '27.5',
					tsh: '1.58',
					weight: '67.9'
				},
				{ time: '08:25' }
			),
			draw(
				'd7',
				'2026-04-20',
				ENDO,
				m,
				{
					testosterone: '5.4',
					estradiol: '41',
					shbg: '30.8',
					'dhea-s': '228',
					...redCells(15.9, 47.6, 5.46),
					creatinine: '0.96',
					'cystatin-c': '0.82',
					albumin: '4.6',
					cholesterol: '181',
					hdl: '45',
					ldl: '113',
					triglycerides: '101',
					apob: '88',
					weight: '68.2'
				},
				{ time: '08:50', notes: ['Trough: last week before the next injection.'] }
			)
		]
	});
}

/** Cis woman with iron deficiency and Hashimoto's thyroiditis */
export function demoCisWoman(): Profile {
	const f = 'female';
	return cityEgfr({
		id: 'demo-cis-f',
		name: 'Lena',
		created: new Date().toISOString(),
		therapy: 'none',
		sex: 'female',
		birth: '1991',
		height: 168,
		demo: true,
		custom: [],
		reports: [],
		phases: [
			{ id: 'p1', label: 'Iron 100 mg every other day', start: '2024-03-11', regimen: 'Ferrous sulfate 100 mg every second day' },
			{ id: 'p2', label: 'Levothyroxine 50 µg', start: '2024-06-24', regimen: 'Levothyroxine 50 µg daily, iron continued' },
			{ id: 'p3', label: 'Levothyroxine 75 µg', start: '2025-02-03', regimen: 'Levothyroxine 75 µg daily, iron stopped' }
		],
		draws: [
			draw(
				'd1',
				'2024-02-26',
				CITY,
				f,
				{
					...redCells(11.2, 35.1, 4.35),
					rdw: '15.8',
					platelets: '362',
					mpv: '10.1',
					...differential(5.9, [58.0, 32.0, 7.0, 2.4, 0.6]),
					iron: '38',
					ferritin: '8',
					transferrin: '362',
					tsh: '4.9',
					ft4: '1.02',
					ft3: '3.1',
					'anti-tpo': '286',
					estradiol: '42',
					progesterone: '0.21',
					lh: '5.8',
					fsh: '6.9',
					testosterone: '0.21',
					shbg: '68',
					prolactin: '14.2',
					amh: '2.9',
					'dhea-s': '198',
					cortisol: '13.8',
					'vitamin-d': '17.2',
					b12: '298',
					folate: '5.8',
					crp: '0.8',
					glucose: '84',
					insulin: '5.9',
					sodium: '139',
					potassium: '4.1',
					calcium: '2.31',
					creatinine: '0.74',
					alt: '16',
					ast: '19',
					ggt: '14',
					cholesterol: '205',
					hdl: '68',
					ldl: '121',
					triglycerides: '82',
					weight: '64.5'
				},
				{ time: '07:50', fasting: true, notes: ['Cycle day 3.', 'Tired for months, heavy periods.'] }
			),
			draw(
				'd2',
				'2024-06-17',
				CITY,
				f,
				{
					...redCells(12.6, 38.4, 4.52),
					rdw: '14.6',
					iron: '84',
					ferritin: '31',
					transferrin: '318',
					tsh: '5.6',
					ft4: '0.91',
					ft3: '2.8',
					'anti-tpo': '301',
					estradiol: ['148', '60.4 - 232'],
					progesterone: ['11.4', '1.83 - 23.9'],
					'vitamin-d': '28.4',
					weight: '64.9'
				},
				{ time: '08:05', notes: ['Cycle day 22, the lab printed luteal phase ranges.', 'TSH rising, fT4 below range: levothyroxine started.'] }
			),
			draw(
				'd3',
				'2024-09-30',
				ENDO,
				f,
				{
					...redCells(13.1, 39.6, 4.49),
					...differential(6.2, [56.4, 33.8, 6.9, 2.3, 0.6]),
					iron: '96',
					ferritin: '48',
					transferrin: '290',
					tsh: '2.9',
					ft4: '1.18',
					'vitamin-d': '34.1',
					weight: '65.2'
				},
				{ time: '08:30', notes: ['Levothyroxine taken after the draw.'] }
			),
			draw(
				'd4',
				'2025-01-20',
				CITY,
				f,
				{
					...redCells(13.4, 40.2, 4.52),
					ferritin: '62',
					tsh: '3.8',
					ft4: '1.08',
					ft3: '2.9',
					'vitamin-d': '22.6',
					cholesterol: '198',
					hdl: '71',
					ldl: '112',
					triglycerides: '74',
					weight: '65.0'
				},
				{ time: '07:45', notes: ['Still tired: dose raised to 75 µg, iron paused.'] }
			),
			draw(
				'd5',
				'2025-05-12',
				ENDO,
				f,
				{
					...redCells(13.5, 40.6, 4.55),
					ferritin: '54',
					tsh: '1.6',
					ft4: '1.31',
					'anti-tpo': '244',
					estradiol: '51',
					progesterone: '0.28',
					lh: '6.4',
					fsh: '7.3',
					testosterone: '0.24',
					shbg: '72',
					prolactin: '12.8',
					amh: '2.6',
					'dhea-s': '186',
					b12: '356',
					folate: '7.1',
					homocysteine: '8.9',
					weight: '64.2'
				},
				{ time: '08:20', notes: ['Cycle day 4.'] }
			),
			draw(
				'd6',
				'2025-11-03',
				CITY,
				f,
				{
					...redCells(13.2, 39.9, 4.46),
					rdw: '13.0',
					platelets: '284',
					mpv: '10.3',
					...differential(5.7, [57.9, 32.6, 6.8, 2.1, 0.6]),
					quick: '104',
					inr: '0.97',
					aptt: '29.8',
					fibrinogen: '312',
					iron: '88',
					ferritin: '44',
					transferrin: '296',
					tsh: '1.9',
					ft4: '1.26',
					'vitamin-d': '26.8',
					crp: '0.6',
					glucose: '86',
					hba1c: '5.1',
					insulin: '6.2',
					sodium: '140',
					potassium: '4.2',
					calcium: '2.36',
					magnesium: '0.85',
					phosphate: '1.12',
					creatinine: '0.76',
					'cystatin-c': '0.74',
					urea: '26',
					'uric-acid': '3.9',
					alt: '15',
					ast: '18',
					ggt: '13',
					alp: '61',
					bilirubin: '0.5',
					albumin: '4.6',
					'total-protein': '7.2',
					weight: '64.0'
				},
				{ time: '07:55', fasting: true, notes: ['Clotting checked before a wisdom tooth removal.'] }
			),
			draw(
				'd7',
				'2026-06-08',
				CITY,
				f,
				{
					...redCells(13.3, 40.0, 4.48),
					ferritin: '39',
					tsh: '1.4',
					ft4: '1.34',
					estradiol: '38',
					progesterone: '0.30',
					lh: '5.1',
					fsh: '7.8',
					testosterone: '0.19',
					shbg: '65',
					prolactin: '16.1',
					amh: '2.3',
					'vitamin-d': '38.5',
					cholesterol: '196',
					hdl: '70',
					ldl: '110',
					triglycerides: '79',
					weight: '63.8'
				},
				{ time: '08:10', notes: ['Cycle day 5.', 'Ferritin drifting down again since the iron pause.'] }
			)
		]
	});
}

/** Cis man with high LDL and prediabetes */
export function demoCisMan(): Profile {
	const m = 'male';
	return cityEgfr({
		id: 'demo-cis-m',
		name: 'Max',
		created: new Date().toISOString(),
		therapy: 'none',
		sex: 'male',
		birth: '1982',
		height: 183,
		demo: true,
		custom: [],
		reports: [],
		phases: [
			{ id: 'p1', label: 'Diet and exercise', start: '2023-11-06', regimen: 'Mediterranean diet, running three times a week' },
			{ id: 'p2', label: 'Atorvastatin 20 mg', start: '2024-05-13', regimen: 'Atorvastatin 20 mg daily' },
			{ id: 'p3', label: 'Atorvastatin 40 mg', start: '2025-01-27', regimen: 'Atorvastatin 40 mg daily' }
		],
		draws: [
			draw(
				'd1',
				'2023-10-23',
				CITY,
				m,
				{
					cholesterol: '262',
					hdl: '41',
					ldl: '181',
					triglycerides: '198',
					apob: '128',
					lpa: '18',
					glucose: '108',
					hba1c: '5.9',
					insulin: '16.8',
					alt: '52',
					ast: '34',
					ggt: '71',
					alp: '82',
					bilirubin: '0.9',
					albumin: '4.7',
					ldh: '182',
					'uric-acid': '7.6',
					creatinine: '1.04',
					urea: '36',
					sodium: '141',
					potassium: '4.4',
					chloride: '103',
					calcium: '2.41',
					crp: '3.4',
					testosterone: '3.9',
					shbg: '24.1',
					estradiol: '29',
					lh: '4.6',
					fsh: '5.2',
					prolactin: '8.9',
					'dhea-s': '212',
					cortisol: '16.1',
					tsh: '1.62',
					...redCells(15.6, 45.8, 5.12),
					rdw: '12.8',
					platelets: '241',
					mpv: '10.2',
					...differential(7.2, [61.2, 28.9, 7.1, 2.1, 0.7]),
					iron: '118',
					ferritin: '312',
					transferrin: '248',
					psa: ['0.8', '< 2.5'],
					'vitamin-d': '21.3',
					weight: '96.4'
				},
				{ time: '08:15', fasting: true, notes: ['Check-up.'] }
			),
			draw(
				'd2',
				'2024-04-29',
				CITY,
				m,
				{ cholesterol: '238', hdl: '45', ldl: '162', triglycerides: '142', glucose: '101', hba1c: '5.8', insulin: '13.9', alt: '41', ggt: '52', 'uric-acid': '7.1', weight: '91.2' },
				{ time: '07:40', fasting: true, notes: ['Down 5 kg, LDL still high: statin started.'] }
			),
			draw(
				'd3',
				'2024-08-19',
				CITY,
				m,
				{ cholesterol: '176', hdl: '47', ldl: '102', triglycerides: '118', apob: '86', glucose: '97', hba1c: '5.7', alt: '46', ast: '38', ck: '212', weight: '89.8' },
				{ time: '08:35', notes: ['Long run two days before, CK slightly up.'] }
			),
			draw(
				'd4',
				'2025-01-13',
				CITY,
				m,
				{
					cholesterol: '181',
					hdl: '46',
					ldl: '108',
					triglycerides: '128',
					apob: '90',
					hba1c: '5.7',
					alt: '38',
					ck: '164',
					potassium: { value: '5.8', suspect: 'Haemolysed sample' },
					ldh: { value: '261', suspect: 'Haemolysed sample' },
					weight: '90.5'
				},
				{ time: '16:20', notes: ['LDL above the goal of 100: dose raised to 40 mg.', 'Sample reached the lab the next morning and had haemolysed.'] }
			),
			draw(
				'd5',
				'2025-05-05',
				CITY,
				m,
				{
					cholesterol: '152',
					hdl: '48',
					ldl: '79',
					triglycerides: '110',
					apob: '72',
					glucose: '95',
					hba1c: '5.6',
					insulin: '11.2',
					alt: '43',
					ast: '31',
					ggt: '44',
					ck: '178',
					'uric-acid': '6.6',
					creatinine: '1.06',
					'cystatin-c': '0.89',
					sodium: '140',
					potassium: '4.3',
					tsh: '1.71',
					...redCells(15.4, 45.1, 5.05),
					platelets: '236',
					...differential(6.8, [60.4, 29.5, 7.0, 2.4, 0.7]),
					ferritin: '246',
					weight: '88.1'
				},
				{ time: '08:05', fasting: true }
			),
			draw(
				'd6',
				'2025-12-01',
				CITY,
				m,
				{
					cholesterol: '148',
					hdl: '50',
					ldl: '76',
					triglycerides: '101',
					apob: '69',
					lpa: '17',
					glucose: '93',
					hba1c: '5.5',
					alt: '35',
					ck: '156',
					crp: '1.2',
					testosterone: '4.4',
					shbg: '27.5',
					estradiol: '26',
					lh: '4.9',
					fsh: '5.6',
					albumin: '4.6',
					homocysteine: '11.8',
					psa: ['0.9', '< 2.5'],
					'vitamin-d': '19.8',
					weight: '86.9'
				},
				{ time: '08:20' }
			),
			draw(
				'd7',
				'2026-06-22',
				CITY,
				m,
				{
					cholesterol: '151',
					hdl: '52',
					ldl: '77',
					triglycerides: '94',
					apob: '70',
					glucose: '91',
					hba1c: '5.4',
					insulin: '8.6',
					alt: '31',
					ast: '26',
					ggt: '36',
					'uric-acid': '6.2',
					creatinine: '1.05',
					crp: '<0.6',
					ferritin: '204',
					'vitamin-d': '31.6',
					weight: '85.4'
				},
				{ time: '07:50', fasting: true }
			)
		]
	});
}

export const demoProfiles = (): Profile[] => [demoCisWoman(), demoCisMan(), demoFeminizing(), demoMasculinizing()];

export const DEMO_IDS = ['demo-cis-f', 'demo-cis-m', 'demo-fem', 'demo-masc'];

/** Raise when the demo data changes, stored copies are then replaced */
export const DEMO_VERSION = 4;
