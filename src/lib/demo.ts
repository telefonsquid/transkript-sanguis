import type { Draw, Profile, Result } from './data/types';

/*
 * Two made up people to explore the app with. Values are plausible, not real:
 * they follow the published trends on HRT but belong to nobody.
 */

type Value = string | [value: string, ref: string];

function draw(id: string, date: string, lab: string, rangesFor: 'female' | 'male', values: Record<string, Value>, notes?: string[]): Draw {
	const results: Result[] = Object.entries(values).map(([analyte, v]) => (Array.isArray(v) ? { analyte, value: v[0], ref: v[1] } : { analyte, value: v }));
	return { id, date, lab, rangesFor, results, ...(notes ? { notes } : {}) };
}

const CITY = 'City Lab';
const ENDO = 'Endocrinology clinic';

export function demoFeminizing(): Profile {
	const m = 'male';
	const f = 'female';
	return {
		id: 'demo-fem',
		name: 'Robin (demo)',
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
			draw('d1', '2022-11-14', CITY, m, {
				estradiol: ['28', '11.3 - 43.2'],
				testosterone: ['5.92', '2.49 - 8.36'],
				shbg: '31.2',
				lh: '4.8',
				fsh: '3.9',
				prolactin: ['9.1', '4.04 - 15.2'],
				hemoglobin: ['15.4', '13.5 - 17.5'],
				hematocrit: ['45.1', '40 - 52'],
				erythrocytes: ['5.21', '4.5 - 5.9'],
				leukocytes: ['6.3', '4.0 - 10.0'],
				platelets: ['248', '150 - 400'],
				creatinine: ['1.02', '0.70 - 1.20'],
				alt: ['31', '< 50'],
				ast: ['26', '< 50'],
				ggt: ['22', '< 60'],
				alp: ['74', '40 - 130'],
				potassium: ['4.3', '3.5 - 5.1'],
				sodium: ['140', '136 - 145'],
				cholesterol: ['188', '< 200'],
				hdl: ['47', '> 40'],
				ldl: ['118', '< 116'],
				triglycerides: ['104', '< 150'],
				glucose: ['88', '70 - 100'],
				hba1c: '5.2',
				crp: ['0.9', '< 5'],
				ferritin: ['142', '30 - 400'],
				'vitamin-d': ['18.5', '30 - 100'],
				tsh: ['1.85', '0.27 - 4.20'],
				weight: '74.0'
			}),
			draw('d2', '2023-06-12', CITY, m, {
				estradiol: ['96', '11.3 - 43.2'],
				testosterone: ['0.21', '2.49 - 8.36'],
				shbg: '58.4',
				lh: '<0.3',
				fsh: '0.4',
				prolactin: ['24.8', '4.04 - 15.2'],
				hemoglobin: ['14.2', '13.5 - 17.5'],
				hematocrit: ['41.6', '40 - 52'],
				erythrocytes: ['4.82', '4.5 - 5.9'],
				creatinine: ['0.95', '0.70 - 1.20'],
				alt: ['24', '< 50'],
				ast: ['21', '< 50'],
				ggt: ['18', '< 60'],
				alp: ['63', '40 - 130'],
				cholesterol: ['176', '< 200'],
				hdl: ['55', '> 40'],
				ldl: ['102', '< 116'],
				triglycerides: ['138', '< 150'],
				crp: ['2.1', '< 5'],
				weight: '75.2'
			}),
			draw('d3', '2023-10-02', CITY, f, {
				estradiol: ['142', '30.9 - 90.4'],
				testosterone: ['0.12', '0.08 - 0.48'],
				shbg: '71.8',
				lh: '<0.3',
				fsh: '0.3',
				prolactin: ['31.2', '4.79 - 23.3'],
				hemoglobin: ['13.3', '12.0 - 16.0'],
				hematocrit: ['39.4', '36 - 46'],
				erythrocytes: ['4.51', '4.0 - 5.2'],
				creatinine: ['0.91', '0.50 - 0.90'],
				alt: ['19', '< 35'],
				ggt: ['15', '< 40'],
				alp: ['58', '35 - 105'],
				ferritin: ['168', '15 - 150'],
				weight: '76.1'
			}),
			draw('d4', '2024-01-22', ENDO, f, {
				estradiol: ['118', '30.9 - 90.4'],
				testosterone: ['0.15', '0.08 - 0.48'],
				shbg: '69.0',
				prolactin: ['27.5', '4.79 - 23.3'],
				hemoglobin: ['13.1', '12.0 - 16.0'],
				hematocrit: ['38.9', '36 - 46'],
				creatinine: ['0.89', '0.50 - 0.90'],
				potassium: ['4.1', '3.5 - 5.1'],
				alt: ['21', '< 35'],
				cholesterol: ['181', '< 200'],
				hdl: ['58', '> 45'],
				ldl: ['104', '< 116'],
				triglycerides: ['121', '< 150'],
				glucose: ['84', '70 - 100'],
				hba1c: '5.1',
				'vitamin-d': ['31.2', '30 - 100'],
				weight: '76.8'
			}),
			draw('d5', '2024-05-06', ENDO, f, { estradiol: ['386', '30.9 - 90.4'], testosterone: ['0.31', '0.08 - 0.48'], shbg: '49.3', prolactin: ['16.4', '4.79 - 23.3'], hemoglobin: '13.0', hematocrit: '38.5', creatinine: '0.88', alt: '18', ast: '19', ggt: '14', crp: '0.6', weight: '77.4' }, [
				'Drawn 3 days after the injection, near the peak.'
			]),
			draw('d6', '2024-11-18', ENDO, f, {
				estradiol: ['184', '30.9 - 90.4'],
				testosterone: ['0.44', '0.08 - 0.48'],
				shbg: '47.1',
				prolactin: ['13.9', '4.79 - 23.3'],
				hemoglobin: ['12.8', '12.0 - 16.0'],
				hematocrit: ['38.0', '36 - 46'],
				erythrocytes: ['4.32', '4.0 - 5.2'],
				creatinine: ['0.86', '0.50 - 0.90'],
				cholesterol: '172',
				hdl: '56',
				ldl: '99',
				triglycerides: '92',
				tsh: '2.10',
				ferritin: '191',
				'vitamin-d': '34.8',
				weight: '77.9'
			}, ['Trough: drawn right before the next injection.']),
			draw('d7', '2025-06-02', CITY, f, {
				estradiol: ['162', '30.9 - 90.4'],
				testosterone: ['0.52', '0.08 - 0.48'],
				shbg: '45.0',
				lh: '0.4',
				prolactin: ['12.2', '4.79 - 23.3'],
				hemoglobin: ['12.9', '12.0 - 16.0'],
				hematocrit: ['38.3', '36 - 46'],
				creatinine: ['0.87', '0.50 - 0.90'],
				alt: ['17', '< 35'],
				ggt: ['13', '< 40'],
				alp: ['55', '35 - 105'],
				potassium: ['4.4', '3.5 - 5.1'],
				glucose: ['86', '70 - 100'],
				hba1c: '5.2',
				psa: '0.03',
				weight: '78.3'
			}),
			draw('d8', '2026-01-12', ENDO, f, {
				estradiol: ['171', '30.9 - 90.4'],
				testosterone: ['0.38', '0.08 - 0.48'],
				shbg: '46.2',
				albumin: '4.5',
				hemoglobin: ['12.7', '12.0 - 16.0'],
				hematocrit: ['37.6', '36 - 46'],
				creatinine: ['0.84', '0.50 - 0.90'],
				'cystatin-c': ['0.88', '0.61 - 0.95'],
				cholesterol: '179',
				hdl: '57',
				ldl: '104',
				triglycerides: '95',
				crp: '0.4',
				ferritin: '205',
				'vitamin-d': '29.4',
				weight: '78.0'
			})
		]
	};
}

export function demoMasculinizing(): Profile {
	const f = 'female';
	const m = 'male';
	return {
		id: 'demo-masc',
		name: 'Sam (demo)',
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
			draw('d1', '2023-07-20', CITY, f, {
				testosterone: ['0.32', '0.08 - 0.48'],
				estradiol: '88',
				shbg: '64.1',
				lh: '5.2',
				fsh: '6.1',
				prolactin: ['12.4', '4.79 - 23.3'],
				hemoglobin: ['12.9', '12.0 - 16.0'],
				hematocrit: ['38.8', '36 - 46'],
				erythrocytes: ['4.41', '4.0 - 5.2'],
				leukocytes: ['5.8', '4.0 - 10.0'],
				creatinine: ['0.71', '0.50 - 0.90'],
				alt: ['14', '< 35'],
				ast: ['18', '< 35'],
				ggt: ['12', '< 40'],
				alp: ['58', '35 - 105'],
				cholesterol: '172',
				hdl: '64',
				ldl: '92',
				triglycerides: '78',
				glucose: '82',
				hba1c: '5.0',
				ferritin: ['34', '15 - 150'],
				'vitamin-d': '22.1',
				weight: '61.5'
			}),
			draw('d2', '2023-12-11', CITY, f, {
				testosterone: ['3.1', '0.08 - 0.48'],
				estradiol: '62',
				shbg: '48.0',
				lh: '3.1',
				hemoglobin: ['13.9', '12.0 - 16.0'],
				hematocrit: ['41.9', '36 - 46'],
				erythrocytes: ['4.83', '4.0 - 5.2'],
				creatinine: ['0.79', '0.50 - 0.90'],
				alt: ['17', '< 35'],
				hdl: '55',
				weight: '63.0'
			}),
			draw('d3', '2024-04-15', ENDO, m, {
				testosterone: ['4.4', '2.49 - 8.36'],
				estradiol: '51',
				shbg: '39.2',
				lh: '1.4',
				fsh: '2.2',
				hemoglobin: ['14.8', '13.5 - 17.5'],
				hematocrit: ['44.6', '40 - 52'],
				erythrocytes: ['5.12', '4.5 - 5.9'],
				creatinine: ['0.86', '0.70 - 1.20'],
				alt: ['20', '< 50'],
				ast: ['22', '< 50'],
				cholesterol: '176',
				hdl: '49',
				ldl: '104',
				triglycerides: '96',
				ferritin: ['28', '30 - 400'],
				weight: '64.8'
			}),
			draw('d4', '2024-09-02', ENDO, m, {
				testosterone: ['6.8', '2.49 - 8.36'],
				estradiol: '48',
				shbg: '31.4',
				lh: '<0.1',
				fsh: '0.4',
				hemoglobin: ['16.2', '13.5 - 17.5'],
				hematocrit: ['48.7', '40 - 52'],
				erythrocytes: ['5.61', '4.5 - 5.9'],
				creatinine: ['0.93', '0.70 - 1.20'],
				alt: ['24', '< 50'],
				ggt: ['18', '< 60'],
				weight: '66.1'
			}, ['Week 10 of the 12 week interval.']),
			draw('d5', '2025-03-10', ENDO, m, {
				testosterone: ['5.9', '2.49 - 8.36'],
				estradiol: '44',
				shbg: '29.0',
				hemoglobin: ['16.9', '13.5 - 17.5'],
				hematocrit: ['51.2', '40 - 52'],
				erythrocytes: ['5.84', '4.5 - 5.9'],
				creatinine: ['0.95', '0.70 - 1.20'],
				cholesterol: '184',
				hdl: '43',
				ldl: '118',
				triglycerides: '112',
				glucose: '88',
				hba1c: '5.2',
				weight: '67.4'
			}, ['Hematocrit above 50 %: injection interval extended to 14 weeks.']),
			draw('d6', '2025-10-06', CITY, m, {
				testosterone: ['5.1', '2.49 - 8.36'],
				shbg: '30.2',
				hemoglobin: ['16.1', '13.5 - 17.5'],
				hematocrit: ['48.3', '40 - 52'],
				erythrocytes: ['5.52', '4.5 - 5.9'],
				creatinine: ['0.94', '0.70 - 1.20'],
				alt: ['22', '< 50'],
				ast: ['24', '< 50'],
				ggt: ['17', '< 60'],
				alp: ['72', '40 - 130'],
				ferritin: ['41', '30 - 400'],
				'vitamin-d': '27.5',
				weight: '67.9'
			}),
			draw('d7', '2026-04-20', ENDO, m, {
				testosterone: ['5.4', '2.49 - 8.36'],
				estradiol: '41',
				shbg: '30.8',
				albumin: '4.6',
				hemoglobin: ['15.9', '13.5 - 17.5'],
				hematocrit: ['47.6', '40 - 52'],
				creatinine: ['0.96', '0.70 - 1.20'],
				cholesterol: '181',
				hdl: '45',
				ldl: '113',
				triglycerides: '101',
				weight: '68.2'
			})
		]
	};
}

export function demoProfile(kind: 'feminizing' | 'masculinizing'): Profile {
	return kind === 'feminizing' ? demoFeminizing() : demoMasculinizing();
}
