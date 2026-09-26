import type { AnalyteDef, Reference, Text } from '../types';
import { T, adult, clinical, female, male, transMen, transWomen } from './refs';

const KDIGO: Reference[] = [
	clinical('kdigo-g1', T('Normal (KDIGO G1)', 'Normal (KDIGO G1)'), [90, undefined], 'kdigo2012'),
	clinical('kdigo-g2', T('Mildly decreased (KDIGO G2)', 'Leicht vermindert (KDIGO G2)'), [60, 90], 'kdigo2012', {
		note: T('Only counts as kidney disease together with other signs of kidney damage.', 'Gilt nur zusammen mit anderen Zeichen einer Nierenschädigung als Nierenerkrankung.')
	})
];

const U_KAT = [{ unit: 'µkat/l', factor: 60 }];

const humble = (therapy: 'f' | 'm', bounds: [number, number]) =>
	(therapy === 'f' ? transWomen : transMen)(bounds, 'humble2022', {
		note: T('Roche platform, 12 months or more on HRT, USA.', 'Roche-Plattform, mindestens 12 Monate HRT, USA.')
	});

const amsterdam = (therapy: 'f' | 'm', bounds: [number, number], note?: Text) =>
	(therapy === 'f' ? transWomen : transMen)(bounds, 'boekhout2023', {
		id: therapy === 'f' ? 'trans-f-12m' : 'trans-m-12m',
		label: therapy === 'f' ? T('Trans women after 12 months (Amsterdam)', 'Trans Frauen nach 12 Monaten (Amsterdam)') : T('Trans men after 12 months (Amsterdam)', 'Trans Männer nach 12 Monaten (Amsterdam)'),
		note
	});

export const chemistry: AnalyteDef[] = [
	{
		id: 'sodium',
		name: T('Sodium', 'Natrium'),
		aliases: ['Na', 'Na+'],
		unit: 'mmol/l',
		units: [{ unit: 'mEq/l', factor: 1 }],
		decimals: 0,
		group: 'electrolytes',
		related: ['potassium', 'chloride'],
		refs: [humble('f', [134, 143]), humble('m', [137.9, 145.1])]
	},
	{
		id: 'potassium',
		name: T('Potassium', 'Kalium'),
		aliases: ['K', 'K+'],
		unit: 'mmol/l',
		units: [{ unit: 'mEq/l', factor: 1 }],
		decimals: 2,
		group: 'electrolytes',
		related: ['sodium', 'creatinine'],
		refs: [humble('f', [3.6, 5.07]), humble('m', [3.7, 5.11])]
	},
	{
		id: 'chloride',
		name: T('Chloride', 'Chlorid'),
		aliases: ['Cl', 'Cl-'],
		unit: 'mmol/l',
		units: [{ unit: 'mEq/l', factor: 1 }],
		decimals: 0,
		group: 'electrolytes',
		related: ['sodium'],
		refs: [
			adult([96, 108], 'nhanes-biopro'),
			humble('f', [94.3, 105.7]),
			humble('m', [97, 107])
		]
	},
	{
		id: 'calcium',
		name: T('Calcium', 'Calcium'),
		aliases: ['Ca', 'Kalzium', 'Calcium gesamt'],
		unit: 'mmol/l',
		units: [{ unit: 'mg/dl', factor: 0.2495 }],
		decimals: 2,
		group: 'electrolytes',
		related: ['albumin', 'vitamin-d', 'phosphate'],
		refs: [
			adult([2.1, 2.54], 'nhanes-biopro', { note: T('8.4 to 10.2 mg/dl, adults 18 to 60.', '8,4 bis 10,2 mg/dl, Erwachsene von 18 bis 60.') })
		]
	},
	{
		id: 'magnesium',
		name: T('Magnesium', 'Magnesium'),
		aliases: ['Mg'],
		unit: 'mmol/l',
		units: [
			{ unit: 'mg/dl', factor: 0.4114 },
			{ unit: 'mEq/l', factor: 0.5 }
		],
		decimals: 2,
		group: 'electrolytes',
		related: ['calcium', 'potassium'],
		primary: { any: 'adult' },
		refs: [
			adult([0.75, 0.95], 'costello2016', { note: T('Central 95 % of US adults in NHANES I, still the basis of most lab ranges.', 'Mittlere 95 % der US-Erwachsenen in NHANES I, bis heute Grundlage der meisten Laborbereiche.') }),
			clinical('mg-health', T('Suggested for good health', 'Empfohlen für die Gesundheit'), [0.85, undefined], 'costello2016', { note: T('An expert panel argues that values below 0.85 mmol/l often already mean a deficit.', 'Ein Expertengremium hält Werte unter 0,85 mmol/l oft schon für einen Mangel.') })
		]
	},
	{
		id: 'phosphate',
		name: T('Phosphate', 'Phosphat'),
		aliases: ['Phosphor', 'Anorganisches Phosphat', 'PO4'],
		unit: 'mmol/l',
		units: [{ unit: 'mg/dl', factor: 0.3229 }],
		decimals: 2,
		group: 'electrolytes',
		related: ['calcium', 'vitamin-d'],
		refs: [
			adult([0.87, 1.45], 'nhanes-biopro', { note: T('2.7 to 4.5 mg/dl.', '2,7 bis 4,5 mg/dl.') })
		]
	},
	{
		id: 'creatinine',
		name: T('Creatinine', 'Kreatinin'),
		aliases: ['Creatinin', 'Crea', 'Krea', 'Kreatinin (enzymatisch)', 'Kreatinin (Jaffé)'],
		unit: 'mg/dl',
		units: [{ unit: 'µmol/l', factor: 1 / 88.42 }],
		si: { unit: 'µmol/l', factor: 88.42, decimals: 0 },
		decimals: 2,
		group: 'kidney',
		primary: { feminizing: 'trans-f', masculinizing: 'trans-m' },
		related: ['egfr', 'egfr-f', 'egfr-m', 'cystatin-c', 'urea'],
		refs: [
			humble('f', [0.7, 1.1]),
			amsterdam('f', [0.62, 1.07], T('55 to 95 µmol/l.', '55 bis 95 µmol/l.')),
			humble('m', [0.69, 1.21]),
			amsterdam('m', [0.66, 1.13], T('58 to 100 µmol/l.', '58 bis 100 µmol/l.')),
			female([0.51, 0.95], 'roche-crea', { note: T('Enzymatic method.', 'Enzymatische Methode.') }),
			male([0.67, 1.17], 'roche-crea', { note: T('Enzymatic method.', 'Enzymatische Methode.') })
		]
	},
	{
		id: 'egfr',
		name: T('eGFR (as reported)', 'eGFR (laut Labor)'),
		aliases: ['GFR', 'GFR (CKD-EPI)', 'eGFR (CKD-EPI)', 'Estimated glomerular filtration rate', 'geschätzte GFR'],
		unit: 'ml/min/1.73 m²',
		units: [{ unit: 'ml/min', factor: 1 }],
		decimals: 1,
		group: 'kidney',
		related: ['egfr-f', 'egfr-m', 'creatinine'],
		refs: KDIGO
	},
	{
		id: 'egfr-f',
		name: T('eGFR, female equation', 'eGFR, weibliche Formel'),
		unit: 'ml/min/1.73 m²',
		decimals: 1,
		group: 'kidney',
		derived: T('CKD-EPI 2009 with female coefficients, from creatinine and age at each draw.', 'CKD-EPI 2009 mit weiblichen Koeffizienten, aus Kreatinin und Alter bei jeder Abnahme.'),
		related: ['egfr-m', 'egfr', 'creatinine'],
		refs: KDIGO
	},
	{
		id: 'egfr-m',
		name: T('eGFR, male equation', 'eGFR, männliche Formel'),
		unit: 'ml/min/1.73 m²',
		decimals: 1,
		group: 'kidney',
		derived: T('CKD-EPI 2009 with male coefficients, from creatinine and age at each draw.', 'CKD-EPI 2009 mit männlichen Koeffizienten, aus Kreatinin und Alter bei jeder Abnahme.'),
		related: ['egfr-f', 'egfr', 'creatinine'],
		refs: KDIGO
	},
	{
		id: 'cystatin-c',
		name: T('Cystatin C', 'Cystatin C'),
		aliases: ['Cys C', 'CysC'],
		unit: 'mg/l',
		decimals: 2,
		group: 'kidney',
		related: ['egfr-cys-f', 'egfr-cys-m', 'creatinine'],
		refs: [
			adult([0.61, 0.95], 'roche-cysc', { note: T('2.5th to 97.5th percentile of 273 healthy adults aged 21 to 77, standardised to ERM-DA471/IFCC.', '2,5. bis 97,5. Perzentile von 273 gesunden Erwachsenen zwischen 21 und 77, standardisiert auf ERM-DA471/IFCC.') })
		]
	},
	{
		id: 'egfr-cys-f',
		name: T('eGFR from cystatin C, female', 'eGFR aus Cystatin C, weiblich'),
		unit: 'ml/min/1.73 m²',
		decimals: 1,
		group: 'kidney',
		derived: T('CKD-EPI 2012 cystatin C equation, female factor 0.932.', 'CKD-EPI-2012-Formel für Cystatin C, weiblicher Faktor 0,932.'),
		related: ['egfr-cys-m', 'cystatin-c', 'egfr-f'],
		refs: KDIGO
	},
	{
		id: 'egfr-cys-m',
		name: T('eGFR from cystatin C, male', 'eGFR aus Cystatin C, männlich'),
		unit: 'ml/min/1.73 m²',
		decimals: 1,
		group: 'kidney',
		derived: T('CKD-EPI 2012 cystatin C equation, male.', 'CKD-EPI-2012-Formel für Cystatin C, männlich.'),
		related: ['egfr-cys-f', 'cystatin-c', 'egfr-m'],
		refs: KDIGO
	},
	{
		id: 'urea',
		name: T('Urea', 'Harnstoff'),
		aliases: ['Urea', 'Harnstoff'],
		unit: 'mg/dl',
		units: [{ unit: 'mmol/l', factor: 6.006 }],
		si: { unit: 'mmol/l', factor: 0.1665, decimals: 1 },
		decimals: 1,
		group: 'kidney',
		related: ['creatinine'],
		refs: [
			adult([12.8, 49.2], 'nhanes-biopro', { note: T('Converted from urea nitrogen 6 to 23 mg/dl, adults 18 to 60.', 'Umgerechnet aus Harnstoff-Stickstoff 6 bis 23 mg/dl, Erwachsene von 18 bis 60.') })
		]
	},
	{
		id: 'uric-acid',
		name: T('Uric acid', 'Harnsäure'),
		aliases: ['Urat', 'Uric acid'],
		unit: 'mg/dl',
		units: [{ unit: 'µmol/l', factor: 1 / 59.48 }],
		si: { unit: 'µmol/l', factor: 59.48, decimals: 0 },
		decimals: 1,
		group: 'kidney',
		primary: { feminizing: 'female', masculinizing: 'male' },
		refs: [female([2.4, 5.7], 'roche-ua'), male([3.4, 7.0], 'roche-ua')]
	},
	{
		id: 'alt',
		name: T('ALT', 'GPT (ALT)'),
		aliases: ['GPT', 'ALAT', 'ALT (GPT)', 'GPT (ALAT)', 'Alanine aminotransferase', 'Alanin-Aminotransferase'],
		unit: 'U/l',
		units: U_KAT,
		si: { unit: 'µkat/l', factor: 1 / 60, decimals: 2 },
		decimals: 0,
		group: 'liver',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['ast', 'ggt', 'alp'],
		refs: [
			humble('f', [5.6, 48.9]),
			amsterdam('f', [9, 61]),
			humble('m', [7.8, 69.1]),
			amsterdam('m', [10, 53]),
			female([undefined, 34], 'schumann2003', { note: T('IFCC method at 37 °C.', 'IFCC-Methode bei 37 °C.') }),
			male([undefined, 45], 'schumann2003', { note: T('IFCC method at 37 °C.', 'IFCC-Methode bei 37 °C.') })
		]
	},
	{
		id: 'ast',
		name: T('AST', 'GOT (AST)'),
		aliases: ['GOT', 'ASAT', 'AST (GOT)', 'GOT (ASAT)', 'Aspartate aminotransferase', 'Aspartat-Aminotransferase'],
		unit: 'U/l',
		units: U_KAT,
		si: { unit: 'µkat/l', factor: 1 / 60, decimals: 2 },
		decimals: 0,
		group: 'liver',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['alt', 'ggt', 'ck'],
		refs: [
			humble('f', [9.3, 33.4]),
			amsterdam('f', [12, 39]),
			humble('m', [13.8, 56.4]),
			amsterdam('m', [14, 45]),
			female([undefined, 31], 'schumann2003', { note: T('IFCC method at 37 °C.', 'IFCC-Methode bei 37 °C.') }),
			male([undefined, 35], 'schumann2003', { note: T('IFCC method at 37 °C.', 'IFCC-Methode bei 37 °C.') })
		]
	},
	{
		id: 'ggt',
		name: T('GGT', 'γ-GT'),
		aliases: ['gamma-GT', 'y-GT', 'Gamma-GT', 'GGT', 'Gamma glutamyl transferase', 'Gamma-Glutamyltransferase'],
		unit: 'U/l',
		units: U_KAT,
		si: { unit: 'µkat/l', factor: 1 / 60, decimals: 2 },
		decimals: 0,
		group: 'liver',
		scale: 'log',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['alt', 'ast', 'alp'],
		refs: [
			humble('f', [5.3, 32.7]),
			amsterdam('f', [10, 92]),
			humble('m', [7, 67.2]),
			amsterdam('m', [8, 62]),
			female([undefined, 38], 'schumann2003', { note: T('IFCC method at 37 °C.', 'IFCC-Methode bei 37 °C.') }),
			male([undefined, 55], 'schumann2003', { note: T('IFCC method at 37 °C.', 'IFCC-Methode bei 37 °C.') })
		]
	},
	{
		id: 'alp',
		name: T('Alkaline phosphatase', 'Alkalische Phosphatase'),
		aliases: ['ALP', 'AP', 'Alk. Phosphatase', 'AP (IFCC)'],
		unit: 'U/l',
		units: U_KAT,
		si: { unit: 'µkat/l', factor: 1 / 60, decimals: 2 },
		decimals: 0,
		group: 'liver',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['ggt', 'calcium', 'vitamin-d'],
		refs: [
			humble('f', [34.6, 91]),
			amsterdam('f', [35, 107]),
			humble('m', [40.9, 113.3]),
			amsterdam('m', [45, 132]),
			female([35, 104], 'roche-alp'),
			male([40, 129], 'roche-alp')
		]
	},
	{
		id: 'bilirubin',
		name: T('Bilirubin, total', 'Bilirubin gesamt'),
		aliases: ['Bilirubin', 'Gesamtbilirubin', 'Total bilirubin'],
		unit: 'mg/dl',
		units: [{ unit: 'µmol/l', factor: 1 / 17.1 }],
		si: { unit: 'µmol/l', factor: 17.1, decimals: 0 },
		decimals: 2,
		group: 'liver',
		refs: [
			adult([undefined, 1.0], 'nhanes-biopro')
		]
	},
	{
		id: 'albumin',
		name: T('Albumin', 'Albumin'),
		aliases: ['Alb', 'Albumin (Serum)'],
		unit: 'g/dl',
		units: [{ unit: 'g/l', factor: 0.1 }],
		si: { unit: 'g/l', factor: 10, decimals: 0 },
		decimals: 1,
		group: 'liver',
		related: ['total-protein', 'calcium', 'free-t-calc'],
		refs: [
			adult([3.5, 5.0], 'nhanes-biopro')
		]
	},
	{
		id: 'total-protein',
		name: T('Total protein', 'Gesamteiweiß'),
		aliases: ['Gesamteiweiss', 'Gesamt-Eiweiß', 'Protein gesamt', 'TP'],
		unit: 'g/dl',
		units: [{ unit: 'g/l', factor: 0.1 }],
		si: { unit: 'g/l', factor: 10, decimals: 0 },
		decimals: 1,
		group: 'liver',
		related: ['albumin'],
		refs: [
			adult([6.6, 8.7], 'nhanes-biopro')
		]
	},
	{
		id: 'amylase',
		name: T('Amylase', 'Amylase'),
		aliases: ['Alpha-Amylase', 'Pankreas-Amylase'],
		unit: 'U/l',
		units: U_KAT,
		decimals: 0,
		group: 'pancreas',
		related: ['lipase'],
		refs: [
			adult([28, 100], 'roche-amyl')
		]
	},
	{
		id: 'lipase',
		name: T('Lipase', 'Lipase'),
		aliases: ['Pankreaslipase'],
		unit: 'U/l',
		units: U_KAT,
		decimals: 0,
		group: 'pancreas',
		related: ['amylase', 'triglycerides'],
		refs: [
			adult([13, 60], 'roche-lipc')
		]
	}
];
