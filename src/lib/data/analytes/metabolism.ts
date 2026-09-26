import type { AnalyteDef } from '../types';
import { T, adult, clinical, context, female, male, transMen, transWomen } from './refs';

const MG_DL_CHOL = [{ unit: 'mmol/l', factor: 38.67 }];

const humble = (therapy: 'f' | 'm', bounds: [number | undefined, number]) =>
	(therapy === 'f' ? transWomen : transMen)(bounds, 'humble2022', {
		note: T('Roche platform, 12 months or more on HRT, USA.', 'Roche-Plattform, mindestens 12 Monate HRT, USA.')
	});

export const metabolism: AnalyteDef[] = [
	{
		id: 'cholesterol',
		name: T('Total cholesterol', 'Gesamtcholesterin'),
		aliases: ['Cholesterin', 'Cholesterol', 'Chol', 'Cholesterin gesamt'],
		unit: 'mg/dl',
		units: MG_DL_CHOL,
		si: { unit: 'mmol/l', factor: 0.02586, decimals: 2 },
		decimals: 0,
		group: 'lipids',
		related: ['ldl', 'hdl', 'non-hdl', 'triglycerides'],
		refs: [humble('f', [109.6, 239.4]), humble('m', [120, 272.1])]
	},
	{
		id: 'hdl',
		name: T('HDL cholesterol', 'HDL-Cholesterin'),
		aliases: ['HDL', 'HDL-C', 'HDL-Chol'],
		unit: 'mg/dl',
		units: MG_DL_CHOL,
		si: { unit: 'mmol/l', factor: 0.02586, decimals: 2 },
		decimals: 0,
		group: 'lipids',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['ldl', 'cholesterol', 'ldl-hdl'],
		refs: [
			humble('f', [32.6, 97.1]),
			humble('m', [29.6, 72.1]),
			female([46, undefined], 'esc2019', { label: T('Women, higher risk below (ESC)', 'Frauen, höheres Risiko darunter (ESC)'), note: T('Below 1.2 mmol/l.', 'Unter 1,2 mmol/l.') }),
			male([39, undefined], 'esc2019', { label: T('Men, higher risk below (ESC)', 'Männer, höheres Risiko darunter (ESC)'), note: T('Below 1.0 mmol/l.', 'Unter 1,0 mmol/l.') })
		]
	},
	{
		id: 'ldl',
		name: T('LDL cholesterol', 'LDL-Cholesterin'),
		aliases: ['LDL', 'LDL-C', 'LDL-Chol', 'LDL (berechnet)', 'LDL (direkt)'],
		unit: 'mg/dl',
		units: MG_DL_CHOL,
		si: { unit: 'mmol/l', factor: 0.02586, decimals: 2 },
		decimals: 0,
		group: 'lipids',
		primary: { any: 'esc-low' },
		related: ['hdl', 'cholesterol', 'non-hdl', 'apob'],
		refs: [
			clinical('esc-low', T('ESC goal, low risk', 'ESC-Ziel, niedriges Risiko'), [undefined, 116], 'esc2019', { note: T('Below 3.0 mmol/l.', 'Unter 3,0 mmol/l.') }),
			clinical('esc-moderate', T('ESC goal, moderate risk', 'ESC-Ziel, mittleres Risiko'), [undefined, 100], 'esc2019', { note: T('Below 2.6 mmol/l.', 'Unter 2,6 mmol/l.') }),
			clinical('esc-high', T('ESC goal, high risk', 'ESC-Ziel, hohes Risiko'), [undefined, 70], 'esc2019', { note: T('Below 1.8 mmol/l and at least 50 % lower than untreated.', 'Unter 1,8 mmol/l und mindestens 50 % unter dem Ausgangswert.') }),
			clinical('esc-very-high', T('ESC goal, very high risk', 'ESC-Ziel, sehr hohes Risiko'), [undefined, 55], 'esc2019', { note: T('Below 1.4 mmol/l and at least 50 % lower than untreated.', 'Unter 1,4 mmol/l und mindestens 50 % unter dem Ausgangswert.') }),
			humble('f', [28, 147]),
			humble('m', [58.5, 171.6])
		]
	},
	{
		id: 'non-hdl',
		name: T('Non-HDL cholesterol', 'Non-HDL-Cholesterin'),
		aliases: ['Non-HDL', 'Non-HDL-C', 'Nicht-HDL-Cholesterin'],
		unit: 'mg/dl',
		units: MG_DL_CHOL,
		si: { unit: 'mmol/l', factor: 0.02586, decimals: 2 },
		decimals: 0,
		group: 'lipids',
		primary: { any: 'esc-moderate' },
		derived: T('Total cholesterol minus HDL, computed where the lab did not print it.', 'Gesamtcholesterin minus HDL, berechnet, wo das Labor es nicht angibt.'),
		related: ['ldl', 'cholesterol', 'triglycerides', 'apob'],
		refs: [
			clinical('esc-moderate', T('ESC goal, moderate risk', 'ESC-Ziel, mittleres Risiko'), [undefined, 130], 'esc2019', { note: T('Below 3.4 mmol/l.', 'Unter 3,4 mmol/l.') }),
			clinical('esc-high', T('ESC goal, high risk', 'ESC-Ziel, hohes Risiko'), [undefined, 100], 'esc2019', { note: T('Below 2.6 mmol/l.', 'Unter 2,6 mmol/l.') }),
			clinical('esc-very-high', T('ESC goal, very high risk', 'ESC-Ziel, sehr hohes Risiko'), [undefined, 85], 'esc2019', { note: T('Below 2.2 mmol/l.', 'Unter 2,2 mmol/l.') })
		]
	},
	{
		id: 'ldl-hdl',
		name: T('LDL/HDL ratio', 'LDL/HDL-Quotient'),
		aliases: ['LDL/HDL', 'LDL/HDL Risiko Index', 'LDL/HDL-Quotient'],
		unit: 'ratio',
		decimals: 1,
		group: 'lipids',
		derived: T('LDL divided by HDL, computed where the lab did not print it.', 'LDL geteilt durch HDL, berechnet, wo das Labor ihn nicht angibt.'),
		related: ['ldl', 'hdl'],
		primary: { any: 'procam' },
		refs: [
			context('procam', T('Below the PROCAM high risk line', 'Unter der PROCAM-Hochrisikogrenze'), [undefined, 5], 'millan2009', { note: T('In 4,559 men of the PROCAM study a ratio above 5 came with more than six times the rate of heart events.', 'Bei 4.559 Männern der PROCAM-Studie ging ein Quotient über 5 mit mehr als sechsmal so vielen Herzereignissen einher.') }),
			clinical('secondary', T('Target after a heart event', 'Ziel nach einem Herzereignis'), [undefined, 3.7], 'millan2009', { note: T('Coronary patients in Barcelona who reached a ratio below 3.7 had less than half the risk of hospital stays and death.', 'Koronarpatienten in Barcelona mit einem Quotienten unter 3,7 hatten weniger als halb so viele Klinikaufenthalte und Todesfälle.') })
		]
	},
	{
		id: 'triglycerides',
		name: T('Triglycerides', 'Triglyceride'),
		aliases: ['TG', 'Triglyzeride', 'Neutralfette'],
		unit: 'mg/dl',
		units: [{ unit: 'mmol/l', factor: 88.57 }],
		si: { unit: 'mmol/l', factor: 0.01129, decimals: 2 },
		decimals: 0,
		group: 'lipids',
		scale: 'log',
		primary: { any: 'esc' },
		related: ['cholesterol', 'non-hdl', 'glucose'],
		refs: [
			clinical('esc', T('Desirable (ESC)', 'Wünschenswert (ESC)'), [undefined, 150], 'esc2019', { note: T('Below 1.7 mmol/l.', 'Unter 1,7 mmol/l.') }),
			humble('f', [46.3, 313.2]),
			humble('m', [44.1, 348.7])
		]
	},
	{
		id: 'apob',
		name: T('Apolipoprotein B', 'Apolipoprotein B'),
		aliases: ['ApoB', 'Apo B', 'Apo-B'],
		unit: 'mg/dl',
		units: [{ unit: 'g/l', factor: 100 }],
		si: { unit: 'g/l', factor: 0.01, decimals: 2 },
		decimals: 0,
		group: 'lipids',
		primary: { any: 'esc-moderate' },
		related: ['ldl', 'non-hdl', 'lpa'],
		refs: [
			clinical('esc-moderate', T('ESC goal, moderate risk', 'ESC-Ziel, mittleres Risiko'), [undefined, 100], 'esc2019'),
			clinical('esc-high', T('ESC goal, high risk', 'ESC-Ziel, hohes Risiko'), [undefined, 80], 'esc2019'),
			clinical('esc-very-high', T('ESC goal, very high risk', 'ESC-Ziel, sehr hohes Risiko'), [undefined, 65], 'esc2019')
		]
	},
	{
		id: 'lpa',
		name: T('Lipoprotein(a), mass', 'Lipoprotein(a), Masse'),
		aliases: ['Lp(a)', 'Lpa', 'Lipoprotein a'],
		unit: 'mg/dl',
		units: [
			{ unit: 'mg/l', factor: 0.1 },
			{ unit: 'g/l', factor: 100 }
		],
		decimals: 0,
		group: 'lipids',
		scale: 'log',
		primary: { any: 'eas-low' },
		related: ['lpa-molar', 'apob', 'ldl'],
		refs: [
			clinical('eas-low', T('Risk unlikely below (EAS)', 'Risiko unwahrscheinlich darunter (EAS)'), [undefined, 30], 'eas2022'),
			clinical('eas-high', T('Risk relevant above (EAS)', 'Risiko relevant darüber (EAS)'), [undefined, 50], 'eas2022', {
				note: T('Between 30 and 50 mg/dl is a grey zone.', 'Zwischen 30 und 50 mg/dl liegt eine Grauzone.')
			})
		]
	},
	{
		id: 'lpa-molar',
		name: T('Lipoprotein(a), particles', 'Lipoprotein(a), Partikel'),
		aliases: ['Lp(a) nmol/l', 'Lipoprotein(a) molar'],
		unit: 'nmol/l',
		decimals: 0,
		group: 'lipids',
		scale: 'log',
		primary: { any: 'eas-low' },
		related: ['lpa', 'apob'],
		refs: [
			clinical('eas-low', T('Risk unlikely below (EAS)', 'Risiko unwahrscheinlich darunter (EAS)'), [undefined, 75], 'eas2022'),
			clinical('eas-high', T('Risk relevant above (EAS)', 'Risiko relevant darüber (EAS)'), [undefined, 125], 'eas2022')
		]
	},
	{
		id: 'glucose',
		name: T('Glucose', 'Glukose'),
		aliases: ['Glucose', 'Blutzucker', 'Glucose nüchtern', 'Nüchternglukose', 'Glucose (Glykolysehemmer)', 'Glucose im Plasma'],
		unit: 'mg/dl',
		units: [{ unit: 'mmol/l', factor: 18.016 }],
		si: { unit: 'mmol/l', factor: 0.05551, decimals: 1 },
		decimals: 0,
		group: 'glucose',
		primary: { any: 'ada-normal' },
		related: ['hba1c', 'insulin', 'homa-ir'],
		refs: [
			clinical('ada-normal', T('Normal fasting (ADA)', 'Normal nüchtern (ADA)'), [undefined, 100], 'ada2025', { note: T('Below 5.6 mmol/l.', 'Unter 5,6 mmol/l.') }),
			clinical('ada-ifg', T('Impaired fasting glucose (ADA)', 'Gestörte Nüchternglukose (ADA)'), [100, 126], 'ada2025', {
				note: T('126 or more on two occasions means diabetes.', '126 oder mehr bei zwei Messungen bedeutet Diabetes.')
			})
		]
	},
	{
		id: 'hba1c',
		name: T('HbA1c', 'HbA1c'),
		aliases: ['HBA1c', 'Glycated haemoglobin', 'Glykohämoglobin', 'Langzeitzucker', 'HbA1c (NGSP)'],
		unit: '%',
		decimals: 1,
		group: 'glucose',
		primary: { any: 'ada-normal' },
		related: ['hba1c-ifcc', 'glucose', 'eag'],
		refs: [
			clinical('ada-normal', T('Normal (ADA)', 'Normal (ADA)'), [undefined, 5.7], 'ada2025'),
			clinical('ada-pre', T('Prediabetes (ADA)', 'Prädiabetes (ADA)'), [5.7, 6.5], 'ada2025', { note: T('6.5 % or more means diabetes.', '6,5 % oder mehr bedeutet Diabetes.') }),
			humble('f', [4.2, 5.8]),
			humble('m', [4.6, 5.6])
		]
	},
	{
		id: 'hba1c-ifcc',
		name: T('HbA1c (IFCC)', 'HbA1c (IFCC)'),
		aliases: ['HbA1c-IFCC', 'HbA1c International', 'HbA1c mmol/mol'],
		unit: 'mmol/mol',
		decimals: 0,
		group: 'glucose',
		primary: { any: 'ada-normal' },
		related: ['hba1c'],
		refs: [
			clinical('ada-normal', T('Normal (ADA)', 'Normal (ADA)'), [undefined, 39], 'ada2025'),
			clinical('ada-pre', T('Prediabetes (ADA)', 'Prädiabetes (ADA)'), [39, 48], 'ada2025')
		]
	},
	{
		id: 'eag',
		name: T('Estimated average glucose', 'Mittlere Blutglukose'),
		aliases: ['eAG', 'mittlere Glucosebelastung', 'mittlere Blutglucose'],
		unit: 'mg/dl',
		units: [{ unit: 'mmol/l', factor: 18.016 }],
		si: { unit: 'mmol/l', factor: 0.05551, decimals: 1 },
		decimals: 0,
		group: 'glucose',
		related: ['hba1c'],
		primary: { any: 'ada-normal' },
		refs: [
			clinical('ada-normal', T('Normal (ADA)', 'Normal (ADA)'), [undefined, 117], 'nathan2008', { note: T('HbA1c below 5.7 % (ADA) translated with the ADAG formula.', 'HbA1c unter 5,7 % (ADA), umgerechnet mit der ADAG-Formel.') }),
			clinical('ada-pre', T('Prediabetes (ADA)', 'Prädiabetes (ADA)'), [117, 140], 'nathan2008', { note: T('HbA1c 5.7 to 6.4 %. From 140 mg/dl, matching 6.5 %, it means diabetes.', 'HbA1c 5,7 bis 6,4 %. Ab 140 mg/dl, entsprechend 6,5 %, bedeutet es Diabetes.') })
		]
	},
	{
		id: 'insulin',
		name: T('Insulin', 'Insulin'),
		aliases: ['Insulin nüchtern', 'Fasting insulin'],
		unit: 'µU/ml',
		units: [
			{ unit: 'µIU/ml', factor: 1 },
			{ unit: 'mU/l', factor: 1 },
			{ unit: 'pmol/l', factor: 1 / 6.945 }
		],
		si: { unit: 'pmol/l', factor: 6.945, decimals: 0 },
		decimals: 1,
		group: 'glucose',
		scale: 'log',
		primary: { any: 'adult' },
		related: ['glucose', 'homa-ir'],
		refs: [adult([2.6, 24.9], 'roche-insulin', { note: T('Fasting.', 'Nüchtern.') })]
	},
	{
		id: 'homa-ir',
		name: T('HOMA-IR', 'HOMA-IR'),
		aliases: ['HOMA', 'HOMA index'],
		unit: 'index',
		decimals: 2,
		group: 'glucose',
		derived: T('Fasting glucose (mg/dl) × fasting insulin (µU/ml) ÷ 405.', 'Nüchternglukose (mg/dl) × Nüchterninsulin (µU/ml) ÷ 405.'),
		related: ['insulin', 'glucose'],
		refs: [
			clinical('ir', T('Below the insulin resistance cut-off', 'Unter der Grenze für Insulinresistenz'), [undefined, 2.05], 'gayoso2013', { note: T('Best cut-off for metabolic syndrome in 2,459 Spanish adults. Published cut-offs range from about 1.6 to 3.8 by population and method.', 'Beste Grenze für das metabolische Syndrom bei 2.459 spanischen Erwachsenen. Veröffentlichte Grenzen reichen je nach Bevölkerung und Methode von etwa 1,6 bis 3,8.') })
		]
	},
	{
		id: 'troponin-t',
		name: T('Troponin T (high sensitivity)', 'Troponin T hs'),
		aliases: ['hs-TnT', 'TnT', 'Troponin T', 'hsTnT'],
		unit: 'pg/ml',
		units: [{ unit: 'ng/l', factor: 1 }],
		decimals: 1,
		group: 'cardiac',
		related: ['ck-mb', 'ck'],
		primary: { any: 'adult' },
		refs: [
			adult([undefined, 14], 'roche-tnt', { note: T('99th percentile of 533 healthy adults aged 20 to 71, the usual line for heart muscle damage.', '99. Perzentile von 533 gesunden Erwachsenen zwischen 20 und 71, die übliche Grenze für Herzmuskelschaden.') }),
			female([undefined, 9], 'roche-tnt', { note: T('99th percentile of 265 women in the same study. Studies found separate lines by sex add little in practice.', '99. Perzentile von 265 Frauen derselben Studie. Getrennte Grenzen nach Geschlecht bringen laut Studien in der Praxis wenig.') }),
			male([undefined, 16.8], 'roche-tnt', { note: T('99th percentile of 268 men in the same study.', '99. Perzentile von 268 Männern derselben Studie.') })
		]
	},
	{
		id: 'ck',
		name: T('Creatine kinase', 'Kreatinkinase'),
		aliases: ['CK', 'CPK', 'CK gesamt', 'Creatinkinase'],
		unit: 'U/l',
		units: [{ unit: 'µkat/l', factor: 60 }],
		decimals: 0,
		group: 'cardiac',
		scale: 'log',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['ck-mb', 'ast', 'creatinine'],
		refs: [
			female([undefined, 145], 'schumann2003', { note: T('IFCC method at 37 °C.', 'IFCC-Methode bei 37 °C.') }),
			male([undefined, 171], 'schumann2003', { note: T('IFCC method at 37 °C.', 'IFCC-Methode bei 37 °C.') })
		]
	},
	{
		id: 'ck-mb',
		name: T('CK-MB', 'CK-MB'),
		aliases: ['CK-MB Aktivität'],
		unit: 'U/l',
		decimals: 0,
		group: 'cardiac',
		related: ['troponin-t', 'ck'],
		refs: [
			adult([undefined, 25], 'roche-ckmb', { note: T('Activity by immune inhibition at 37 °C.', 'Aktivität per Immuninhibition bei 37 °C.') })
		]
	},
	{
		id: 'ldh',
		name: T('LDH', 'LDH'),
		aliases: ['Lactate dehydrogenase', 'Laktatdehydrogenase', 'LD'],
		unit: 'U/l',
		units: [{ unit: 'µkat/l', factor: 60 }],
		decimals: 0,
		group: 'cardiac',
		refs: [
			female([undefined, 247], 'schumann2003', { note: T('IFCC method at 37 °C.', 'IFCC-Methode bei 37 °C.') }),
			male([undefined, 248], 'schumann2003', { note: T('IFCC method at 37 °C.', 'IFCC-Methode bei 37 °C.') })
		]
	},
	{
		id: 'crp',
		name: T('CRP', 'CRP'),
		aliases: ['C-reactive protein', 'C-reaktives Protein', 'hs-CRP', 'hsCRP', 'CRP (hochsensitiv)'],
		unit: 'mg/l',
		units: [{ unit: 'mg/dl', factor: 10 }],
		decimals: 1,
		group: 'inflammation',
		scale: 'log',
		related: ['leukocytes', 'esr'],
		refs: [
			clinical('aha-low', T('Low cardiovascular risk (hs-CRP)', 'Niedriges Herz-Kreislauf-Risiko (hs-CRP)'), [undefined, 1], 'aha-crp', {
				note: T('Only meaningful with a high sensitivity assay and no acute infection.', 'Nur aussagekräftig mit hochsensitivem Test und ohne akute Infektion.')
			}),
			clinical('aha-avg', T('Average cardiovascular risk (hs-CRP)', 'Durchschnittliches Herz-Kreislauf-Risiko (hs-CRP)'), [1, 3], 'aha-crp'),
			humble('f', [undefined, 11.8]),
			humble('m', [0.1, 21])
		]
	},
	{
		id: 'esr',
		name: T('Erythrocyte sedimentation rate', 'Blutsenkung (BSG)'),
		aliases: ['ESR', 'BSG', 'BSR', 'Blutkörperchensenkungsgeschwindigkeit', 'Senkung'],
		unit: 'mm/h',
		decimals: 0,
		group: 'inflammation',
		related: ['crp'],
		refs: [
			female([undefined, 20], 'miller1983', { id: 'female-18', age: [18, 29] }),
			male([undefined, 15], 'miller1983', { id: 'male-18', age: [18, 29] }),
			female([undefined, 25], 'miller1983', { id: 'female-30', age: [30, 39] }),
			male([undefined, 20], 'miller1983', { id: 'male-30', age: [30, 39] }),
			female([undefined, 30], 'miller1983', { id: 'female-40', age: [40, 49] }),
			male([undefined, 25], 'miller1983', { id: 'male-40', age: [40, 49] }),
			female([undefined, 35], 'miller1983', { id: 'female-50', age: [50, 59] }),
			male([undefined, 30], 'miller1983', { id: 'male-50', age: [50, 59] }),
			female([undefined, 40], 'miller1983', { id: 'female-60', age: [60, 69] }),
			male([undefined, 35], 'miller1983', { id: 'male-60', age: [60, 69] }),
			female([undefined, 45], 'miller1983', { id: 'female-70', age: [70, 79] }),
			male([undefined, 40], 'miller1983', { id: 'male-70', age: [70, 79] }),
			female([undefined, 50], 'miller1983', { id: 'female-80', age: [80, 89] }),
			male([undefined, 45], 'miller1983', { id: 'male-80', age: [80, 89] }),
			female([undefined, 55], 'miller1983', { id: 'female-90', age: [90, 120] }),
			male([undefined, 50], 'miller1983', { id: 'male-90', age: [90, 120] })
		]
	}
];
