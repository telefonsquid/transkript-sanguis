import type { Draw, Profile, Result } from './data/types';

/*
 * Four made up people to explore the app with. Values are plausible, not real:
 * they follow published trends but belong to nobody.
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
		name: '[DEMO] Raven',
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
		name: '[DEMO] Sam',
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

/** Cis woman with iron deficiency and Hashimoto's thyroiditis */
export function demoCisWoman(): Profile {
	const f = 'female';
	return {
		id: 'demo-cis-f',
		name: '[DEMO] Lena',
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
			draw('d1', '2024-02-26', CITY, f, {
				hemoglobin: ['11.2', '12.0 - 16.0'],
				hematocrit: ['35.1', '36 - 46'],
				erythrocytes: ['4.35', '4.0 - 5.2'],
				mcv: ['80.7', '80 - 96'],
				mch: ['25.7', '27 - 33'],
				mchc: ['31.9', '32 - 36'],
				rdw: ['15.8', '11.5 - 14.5'],
				leukocytes: ['5.9', '4.0 - 10.0'],
				platelets: ['362', '150 - 400'],
				iron: ['38', '37 - 145'],
				ferritin: ['8', '15 - 150'],
				transferrin: ['362', '200 - 360'],
				tsh: ['4.9', '0.27 - 4.20'],
				ft4: ['1.02', '0.93 - 1.70'],
				'anti-tpo': ['286', '< 34'],
				'vitamin-d': ['17.2', '30 - 100'],
				b12: ['298', '197 - 771'],
				folate: ['5.8', '> 3.9'],
				crp: ['0.8', '< 5'],
				glucose: ['84', '70 - 100'],
				creatinine: ['0.74', '0.50 - 0.90'],
				alt: ['16', '< 35'],
				cholesterol: ['205', '< 200'],
				hdl: ['68', '> 45'],
				ldl: ['121', '< 116'],
				triglycerides: ['82', '< 150'],
				weight: '64.5'
			}, ['Tired for months, heavy periods.']),
			draw('d2', '2024-06-17', CITY, f, {
				hemoglobin: ['12.6', '12.0 - 16.0'],
				hematocrit: ['38.4', '36 - 46'],
				erythrocytes: ['4.52', '4.0 - 5.2'],
				mcv: ['85.0', '80 - 96'],
				mch: ['27.9', '27 - 33'],
				mchc: ['32.8', '32 - 36'],
				iron: ['84', '37 - 145'],
				ferritin: ['31', '15 - 150'],
				transferrin: ['318', '200 - 360'],
				tsh: ['5.6', '0.27 - 4.20'],
				ft4: ['0.91', '0.93 - 1.70'],
				'anti-tpo': ['301', '< 34'],
				'vitamin-d': ['28.4', '30 - 100'],
				weight: '64.9'
			}, ['TSH rising, fT4 below range: levothyroxine started.']),
			draw('d3', '2024-09-30', ENDO, f, {
				hemoglobin: ['13.1', '12.0 - 16.0'],
				hematocrit: ['39.6', '36 - 46'],
				erythrocytes: ['4.49', '4.0 - 5.2'],
				mcv: ['88.2', '80 - 96'],
				mch: ['29.2', '27 - 33'],
				mchc: ['33.1', '32 - 36'],
				iron: ['96', '37 - 145'],
				ferritin: ['48', '15 - 150'],
				transferrin: ['290', '200 - 360'],
				tsh: ['2.9', '0.27 - 4.20'],
				ft4: ['1.18', '0.93 - 1.70'],
				'vitamin-d': ['34.1', '30 - 100'],
				weight: '65.2'
			}, ['Levothyroxine taken after the draw.']),
			draw('d4', '2025-01-20', CITY, f, {
				hemoglobin: ['13.4', '12.0 - 16.0'],
				hematocrit: ['40.2', '36 - 46'],
				erythrocytes: ['4.52', '4.0 - 5.2'],
				mcv: ['88.9', '80 - 96'],
				mch: ['29.6', '27 - 33'],
				mchc: ['33.3', '32 - 36'],
				ferritin: ['62', '15 - 150'],
				tsh: ['3.8', '0.27 - 4.20'],
				ft4: ['1.08', '0.93 - 1.70'],
				'vitamin-d': ['22.6', '30 - 100'],
				cholesterol: ['198', '< 200'],
				hdl: ['71', '> 45'],
				ldl: ['112', '< 116'],
				triglycerides: ['74', '< 150'],
				weight: '65.0'
			}, ['Still tired: dose raised to 75 µg, iron paused.']),
			draw('d5', '2025-05-12', ENDO, f, {
				hemoglobin: ['13.5', '12.0 - 16.0'],
				hematocrit: ['40.6', '36 - 46'],
				erythrocytes: ['4.55', '4.0 - 5.2'],
				mcv: ['89.2', '80 - 96'],
				mch: ['29.7', '27 - 33'],
				mchc: ['33.3', '32 - 36'],
				ferritin: ['54', '15 - 150'],
				tsh: ['1.6', '0.27 - 4.20'],
				ft4: ['1.31', '0.93 - 1.70'],
				'anti-tpo': ['244', '< 34'],
				b12: ['356', '197 - 771'],
				folate: ['7.1', '> 3.9'],
				weight: '64.2'
			}),
			draw('d6', '2025-11-03', CITY, f, {
				hemoglobin: ['13.2', '12.0 - 16.0'],
				hematocrit: ['39.9', '36 - 46'],
				erythrocytes: ['4.46', '4.0 - 5.2'],
				mcv: ['89.5', '80 - 96'],
				mch: ['29.6', '27 - 33'],
				mchc: ['33.1', '32 - 36'],
				iron: ['88', '37 - 145'],
				ferritin: ['44', '15 - 150'],
				transferrin: ['296', '200 - 360'],
				tsh: ['1.9', '0.27 - 4.20'],
				ft4: ['1.26', '0.93 - 1.70'],
				'vitamin-d': ['26.8', '30 - 100'],
				crp: ['0.6', '< 5'],
				glucose: ['86', '70 - 100'],
				hba1c: '5.1',
				creatinine: ['0.76', '0.50 - 0.90'],
				alt: ['15', '< 35'],
				weight: '64.0'
			}),
			draw('d7', '2026-06-08', CITY, f, {
				hemoglobin: ['13.3', '12.0 - 16.0'],
				hematocrit: ['40.0', '36 - 46'],
				erythrocytes: ['4.48', '4.0 - 5.2'],
				mcv: ['89.3', '80 - 96'],
				mch: ['29.7', '27 - 33'],
				mchc: ['33.3', '32 - 36'],
				ferritin: ['39', '15 - 150'],
				tsh: ['1.4', '0.27 - 4.20'],
				ft4: ['1.34', '0.93 - 1.70'],
				'vitamin-d': ['38.5', '30 - 100'],
				cholesterol: ['196', '< 200'],
				hdl: ['70', '> 45'],
				ldl: ['110', '< 116'],
				triglycerides: ['79', '< 150'],
				weight: '63.8'
			})
		]
	};
}

/** Cis man with high LDL and prediabetes */
export function demoCisMan(): Profile {
	const m = 'male';
	return {
		id: 'demo-cis-m',
		name: '[DEMO] Max',
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
			draw('d1', '2023-10-23', CITY, m, {
				cholesterol: ['262', '< 200'],
				hdl: ['41', '> 40'],
				ldl: ['181', '< 116'],
				triglycerides: ['198', '< 150'],
				apob: ['128', '< 100'],
				lpa: ['18', '< 30'],
				glucose: ['108', '70 - 100'],
				hba1c: ['5.9', '< 5.7'],
				insulin: ['16.8', '2.6 - 24.9'],
				alt: ['52', '< 50'],
				ast: ['34', '< 50'],
				ggt: ['71', '< 60'],
				'uric-acid': ['7.6', '3.4 - 7.0'],
				creatinine: ['1.04', '0.70 - 1.20'],
				potassium: ['4.4', '3.5 - 5.1'],
				sodium: ['141', '136 - 145'],
				crp: ['3.4', '< 5'],
				testosterone: ['3.9', '2.49 - 8.36'],
				shbg: '24.1',
				tsh: ['1.62', '0.27 - 4.20'],
				hemoglobin: ['15.6', '13.5 - 17.5'],
				hematocrit: ['45.8', '40 - 52'],
				erythrocytes: ['5.12', '4.5 - 5.9'],
				mcv: ['89.5', '80 - 96'],
				mch: ['30.5', '27 - 33'],
				mchc: ['34.1', '32 - 36'],
				leukocytes: ['7.2', '4.0 - 10.0'],
				platelets: ['241', '150 - 400'],
				psa: ['0.8', '< 2.5'],
				'vitamin-d': ['21.3', '30 - 100'],
				weight: '96.4'
			}, ['Check-up, fasting.']),
			draw('d2', '2024-04-29', CITY, m, {
				cholesterol: ['238', '< 200'],
				hdl: ['45', '> 40'],
				ldl: ['162', '< 116'],
				triglycerides: ['142', '< 150'],
				glucose: ['101', '70 - 100'],
				hba1c: ['5.8', '< 5.7'],
				alt: ['41', '< 50'],
				ggt: ['52', '< 60'],
				'uric-acid': ['7.1', '3.4 - 7.0'],
				weight: '91.2'
			}, ['Down 5 kg, LDL still high: statin started.']),
			draw('d3', '2024-08-19', CITY, m, {
				cholesterol: ['176', '< 200'],
				hdl: ['47', '> 40'],
				ldl: ['102', '< 116'],
				triglycerides: ['118', '< 150'],
				apob: ['86', '< 100'],
				glucose: ['97', '70 - 100'],
				hba1c: ['5.7', '< 5.7'],
				alt: ['46', '< 50'],
				ast: ['38', '< 50'],
				ck: ['212', '< 190'],
				weight: '89.8'
			}, ['Long run two days before, CK slightly up.']),
			draw('d4', '2025-01-13', CITY, m, {
				cholesterol: ['181', '< 200'],
				hdl: ['46', '> 40'],
				ldl: ['108', '< 116'],
				triglycerides: ['128', '< 150'],
				apob: ['90', '< 100'],
				hba1c: ['5.7', '< 5.7'],
				alt: ['38', '< 50'],
				ck: ['164', '< 190'],
				weight: '90.5'
			}, ['LDL above the goal of 100: dose raised to 40 mg.']),
			draw('d5', '2025-05-05', CITY, m, {
				cholesterol: ['152', '< 200'],
				hdl: ['48', '> 40'],
				ldl: ['79', '< 116'],
				triglycerides: ['110', '< 150'],
				apob: ['72', '< 100'],
				glucose: ['95', '70 - 100'],
				hba1c: ['5.6', '< 5.7'],
				insulin: ['11.2', '2.6 - 24.9'],
				alt: ['43', '< 50'],
				ast: ['31', '< 50'],
				ggt: ['44', '< 60'],
				ck: ['178', '< 190'],
				'uric-acid': ['6.6', '3.4 - 7.0'],
				creatinine: ['1.06', '0.70 - 1.20'],
				tsh: ['1.71', '0.27 - 4.20'],
				hemoglobin: ['15.4', '13.5 - 17.5'],
				hematocrit: ['45.1', '40 - 52'],
				erythrocytes: ['5.05', '4.5 - 5.9'],
				mcv: ['89.3', '80 - 96'],
				mch: ['30.5', '27 - 33'],
				mchc: ['34.1', '32 - 36'],
				weight: '88.1'
			}),
			draw('d6', '2025-12-01', CITY, m, {
				cholesterol: ['148', '< 200'],
				hdl: ['50', '> 40'],
				ldl: ['76', '< 116'],
				triglycerides: ['101', '< 150'],
				apob: ['69', '< 100'],
				lpa: ['17', '< 30'],
				glucose: ['93', '70 - 100'],
				hba1c: ['5.5', '< 5.7'],
				alt: ['35', '< 50'],
				ck: ['156', '< 190'],
				crp: ['1.2', '< 5'],
				testosterone: ['4.4', '2.49 - 8.36'],
				shbg: '27.5',
				psa: ['0.9', '< 2.5'],
				'vitamin-d': ['19.8', '30 - 100'],
				weight: '86.9'
			}),
			draw('d7', '2026-06-22', CITY, m, {
				cholesterol: ['151', '< 200'],
				hdl: ['52', '> 40'],
				ldl: ['77', '< 116'],
				triglycerides: ['94', '< 150'],
				apob: ['70', '< 100'],
				glucose: ['91', '70 - 100'],
				hba1c: ['5.4', '< 5.7'],
				alt: ['31', '< 50'],
				ggt: ['36', '< 60'],
				'uric-acid': ['6.2', '3.4 - 7.0'],
				creatinine: ['1.05', '0.70 - 1.20'],
				'vitamin-d': ['31.6', '30 - 100'],
				weight: '85.4'
			})
		]
	};
}

export const demoProfiles = (): Profile[] => [demoFeminizing(), demoMasculinizing(), demoCisWoman(), demoCisMan()];

export const DEMO_IDS = ['demo-fem', 'demo-masc', 'demo-cis-f', 'demo-cis-m'];

/** Raise when the demo data changes, stored copies are then replaced */
export const DEMO_VERSION = 1;
