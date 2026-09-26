import type { AnalyteDef } from '../types';
import { T, adult, clinical, context, female, male, transMen, transWomen } from './refs';

const PER_NL = [
	{ unit: 'G/l', factor: 1 },
	{ unit: '10^9/l', factor: 1 },
	{ unit: '/µl', factor: 0.001 },
	{ unit: 'Tsd/µl', factor: 1 },
	{ unit: '10^3/µl', factor: 1 }
];

export const blood: AnalyteDef[] = [
	{
		id: 'leukocytes',
		name: T('White blood cells', 'Leukozyten'),
		aliases: ['WBC', 'Leukocytes', 'Leukos', 'Weiße Blutkörperchen'],
		unit: '/nl',
		units: PER_NL,
		decimals: 1,
		group: 'blood-count',
		related: ['neutrophils-abs', 'lymphocytes-abs', 'crp'],
		refs: [adult([3.4, 9.6], 'mayo-cbc')]
	},
	{
		id: 'erythrocytes',
		name: T('Red blood cells', 'Erythrozyten'),
		aliases: ['RBC', 'Erythrocytes', 'Erys', 'Rote Blutkörperchen'],
		unit: '/pl',
		units: [
			{ unit: 'T/l', factor: 1 },
			{ unit: '10^12/l', factor: 1 },
			{ unit: 'Mio/µl', factor: 1 },
			{ unit: '10^6/µl', factor: 1 }
		],
		decimals: 2,
		group: 'blood-count',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['hemoglobin', 'hematocrit', 'mcv'],
		refs: [
			female([3.92, 5.13], 'mayo-cbc'), male([4.35, 5.65], 'mayo-cbc'),
			transWomen([3.92, 5.13], 'greene2019', { note: T('Values after 12 months or more on estradiol matched cis women, so the cis female range applies.', 'Nach mindestens 12 Monaten Östradiol lagen die Werte wie bei cis Frauen, daher gilt der cis weibliche Bereich.') }),
			transMen([4.35, 5.65], 'greene2019', { note: T('Values after 12 months or more on testosterone matched cis men, so the cis male range applies.', 'Nach mindestens 12 Monaten Testosteron lagen die Werte wie bei cis Männern, daher gilt der cis männliche Bereich.') })
		]
	},
	{
		id: 'hemoglobin',
		name: T('Hemoglobin', 'Hämoglobin'),
		aliases: ['Hb', 'Haemoglobin', 'HGB', 'Hämoglobin'],
		unit: 'g/dl',
		units: [
			{ unit: 'g/l', factor: 0.1 },
			{ unit: 'mmol/l', factor: 1.611 }
		],
		si: { unit: 'g/l', factor: 10, decimals: 0 },
		decimals: 1,
		group: 'blood-count',
		primary: { feminizing: 'trans-f', masculinizing: 'trans-m' },
		related: ['hematocrit', 'erythrocytes', 'ferritin'],
		refs: [
			transWomen([12.2, 15.8], 'boekhout2023', { note: T('After 12 months of HRT (7.6 to 9.8 mmol/l).', 'Nach 12 Monaten HRT (7,6 bis 9,8 mmol/l).') }),
			transMen([11.9, 17.2], 'boekhout2023', { note: T('After 12 months of HRT (7.4 to 10.7 mmol/l).', 'Nach 12 Monaten HRT (7,4 bis 10,7 mmol/l).') }),
			female([11.6, 15.0], 'mayo-cbc'),
			male([13.2, 16.6], 'mayo-cbc'),
			clinical('who-f', T('Anaemia below this, women (WHO)', 'Anämie darunter, Frauen (WHO)'), [12, undefined], 'who-hb2024'),
			clinical('who-m', T('Anaemia below this, men (WHO)', 'Anämie darunter, Männer (WHO)'), [13, undefined], 'who-hb2024')
		]
	},
	{
		id: 'hematocrit',
		name: T('Hematocrit', 'Hämatokrit'),
		aliases: ['Hkt', 'Hct', 'Haematokrit', 'HCT', 'Hk'],
		unit: '%',
		units: [
			{ unit: 'l/l', factor: 100 },
			{ unit: 'fraction', factor: 100 }
		],
		si: { unit: 'l/l', factor: 0.01, decimals: 3 },
		decimals: 1,
		group: 'blood-count',
		primary: { feminizing: 'trans-f', masculinizing: 'trans-m' },
		related: ['hemoglobin', 'erythrocytes', 'mcv'],
		refs: [
			transWomen([35, 46], 'boekhout2023', { note: T('After 12 months of HRT.', 'Nach 12 Monaten HRT.') }),
			transMen([38, 52], 'boekhout2023', { note: T('After 12 months of HRT.', 'Nach 12 Monaten HRT.') }),
			clinical('erythrocytosis', T('Erythrocytosis above this', 'Erythrozytose darüber'), [undefined, 50], 'madsen2021', {
				therapy: 'masculinizing',
				note: T('Reached by 11 % of trans men over up to 20 years on testosterone.', 'Bei 11 % der trans Männer innerhalb von bis zu 20 Jahren Testosteron erreicht.')
			}),
			clinical('hold', T('Pause or reduce testosterone above this', 'Testosteron pausieren oder senken darüber'), [undefined, 54], 'bhasin2018', {
				therapy: 'masculinizing',
				note: T('Endocrine Society threshold from the testosterone therapy guideline for cis men.', 'Grenze der Endocrine Society aus der Leitlinie zur Testosterontherapie bei cis Männern.')
			}),
			female([35.5, 44.9], 'mayo-cbc'),
			male([38.3, 48.6], 'mayo-cbc')
		]
	},
	{
		id: 'mcv',
		name: T('MCV', 'MCV'),
		aliases: ['Mean corpuscular volume', 'Mittleres Erythrozytenvolumen', 'MCV (Ery-Volumen)'],
		unit: 'fl',
		units: [{ unit: 'fL', factor: 1 }],
		decimals: 1,
		group: 'blood-count',
		related: ['mch', 'mchc', 'hematocrit'],
		refs: [adult([78.2, 97.9], 'mayo-cbc')]
	},
	{
		id: 'mch',
		name: T('MCH', 'MCH'),
		aliases: ['Mean corpuscular hemoglobin', 'HbE', 'Hb-E', 'MCH (HbE)'],
		unit: 'pg',
		units: [{ unit: 'fmol', factor: 1.611 }],
		decimals: 1,
		group: 'blood-count',
		related: ['mcv', 'mchc'],
		refs: [
			adult([27, 32], 'arbiol2018', { note: T('Sysmex XN, 188 healthy adults in Barcelona.', 'Sysmex XN, 188 gesunde Erwachsene in Barcelona.') })
		]
	},
	{
		id: 'mchc',
		name: T('MCHC', 'MCHC'),
		aliases: ['Mean corpuscular hemoglobin concentration', 'MCHC (Hb-Konz.)'],
		unit: 'g/dl',
		units: [
			{ unit: 'g/l', factor: 0.1 },
			{ unit: 'mmol/l', factor: 1.611 }
		],
		si: { unit: 'g/l', factor: 10, decimals: 0 },
		decimals: 1,
		group: 'blood-count',
		related: ['mcv', 'mch'],
		refs: [
			female([32.0, 35.1], 'almeida2026', { note: T('1,314 healthy women in Brazil (ELSA-Brasil).', '1.314 gesunde Frauen in Brasilien (ELSA-Brasil).') }),
			male([32.3, 35.7], 'almeida2026', { note: T('1,103 healthy men in Brazil (ELSA-Brasil).', '1.103 gesunde Männer in Brasilien (ELSA-Brasil).') }),
			transWomen([32.0, 35.1], 'greene2019', { note: T('Values after 12 months or more on estradiol matched cis women, so the cis female range applies.', 'Nach mindestens 12 Monaten Östradiol lagen die Werte wie bei cis Frauen, daher gilt der cis weibliche Bereich.') }),
			transMen([32.3, 35.7], 'greene2019', { note: T('Values after 12 months or more on testosterone matched cis men, so the cis male range applies.', 'Nach mindestens 12 Monaten Testosteron lagen die Werte wie bei cis Männern, daher gilt der cis männliche Bereich.') })
		]
	},
	{
		id: 'rdw',
		name: T('RDW', 'RDW'),
		aliases: ['Red cell distribution width', 'RDW-CV', 'Erythrozytenverteilungsbreite', 'EVB'],
		unit: '%',
		decimals: 1,
		group: 'blood-count',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['mcv'],
		refs: [
			female([12.2, 16.1], 'mayo-cbc'), male([11.8, 14.5], 'mayo-cbc'),
			transWomen([12.2, 16.1], 'greene2019', { note: T('Values after 12 months or more on estradiol matched cis women, so the cis female range applies.', 'Nach mindestens 12 Monaten Östradiol lagen die Werte wie bei cis Frauen, daher gilt der cis weibliche Bereich.') }),
			transMen([11.8, 14.5], 'greene2019', { note: T('Values after 12 months or more on testosterone matched cis men, so the cis male range applies.', 'Nach mindestens 12 Monaten Testosteron lagen die Werte wie bei cis Männern, daher gilt der cis männliche Bereich.') })
		]
	},
	{
		id: 'platelets',
		name: T('Platelets', 'Thrombozyten'),
		aliases: ['PLT', 'Thrombocytes', 'Thrombos', 'Blutplättchen'],
		unit: '/nl',
		units: PER_NL,
		decimals: 0,
		group: 'blood-count',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['mpv'],
		refs: [
			female([157, 371], 'mayo-cbc'), male([135, 317], 'mayo-cbc'),
			transWomen([157, 371], 'greene2019', { note: T('Values after 12 months or more on estradiol matched cis women, so the cis female range applies.', 'Nach mindestens 12 Monaten Östradiol lagen die Werte wie bei cis Frauen, daher gilt der cis weibliche Bereich.') }),
			transMen([135, 317], 'greene2019', { note: T('Values after 12 months or more on testosterone matched cis men, so the cis male range applies.', 'Nach mindestens 12 Monaten Testosteron lagen die Werte wie bei cis Männern, daher gilt der cis männliche Bereich.') })
		]
	},
	{
		id: 'mpv',
		name: T('MPV', 'MPV'),
		aliases: ['Mean platelet volume', 'Mittleres Thrombozytenvolumen'],
		unit: 'fl',
		units: [{ unit: 'fL', factor: 1 }],
		decimals: 1,
		group: 'blood-count',
		related: ['platelets'],
		refs: [
			adult([9.7, 13.2], 'arbiol2018', { note: T('Sysmex XN. Analysers size platelets differently, so a printed lab range wins.', 'Sysmex XN. Analysegeräte messen die Plättchengröße unterschiedlich, ein gedruckter Laborbereich hat daher Vorrang.') })
		]
	},
	{
		id: 'nrbc',
		name: T('Nucleated red cells', 'Normoblasten'),
		aliases: ['NRBC', 'NRBC %'],
		unit: '/100 WBC',
		units: [{ unit: '%', factor: 1 }],
		decimals: 1,
		group: 'blood-count',
		refs: [
			adult([undefined, 0.01], 'arbiol2018', { note: T('Healthy adults have practically none in their blood.', 'Gesunde Erwachsene haben praktisch keine im Blut.') })
		]
	},
	{
		id: 'nrbc-abs',
		name: T('Nucleated red cells, absolute', 'Normoblasten, absolut'),
		aliases: ['NRBC absolut'],
		unit: '/nl',
		units: PER_NL,
		decimals: 2,
		group: 'blood-count',
		refs: []
	},
	...differential(),
	{
		id: 'quick',
		name: T('Prothrombin time (Quick)', 'Quick-Wert'),
		aliases: ['Quick', 'Thromboplastinzeit', 'TPZ', 'PT %', 'Prothrombin ratio'],
		unit: '%',
		decimals: 0,
		group: 'coagulation',
		related: ['inr', 'aptt'],
		refs: [
			adult([74.4, 120], 'ulm-tpz', { note: T('Roche reagent on cobas t. The percentage depends on the reagent, the INR does not.', 'Roche-Reagenz auf cobas t. Der Prozentwert hängt vom Reagenz ab, die INR nicht.') })
		]
	},
	{
		id: 'inr',
		name: T('INR', 'INR'),
		aliases: ['International normalized ratio', 'PT-INR'],
		unit: 'ratio',
		decimals: 2,
		group: 'coagulation',
		related: ['quick'],
		primary: { any: 'adult' },
		refs: [
			adult([0.9, 1.1], 'hhu-inr'),
			context('vka', T('Target on vitamin K antagonists', 'Ziel unter Vitamin-K-Antagonisten'), [2.0, 3.0], 'ulm-tpz', { note: T('For most reasons such as thrombosis or atrial fibrillation. Some mechanical heart valves need 2.5 to 3.5.', 'Für die meisten Gründe wie Thrombose oder Vorhofflimmern. Manche mechanischen Herzklappen brauchen 2,5 bis 3,5.') })
		]
	},
	{
		id: 'aptt',
		name: T('aPTT', 'aPTT'),
		aliases: ['PTT', 'Activated partial thromboplastin time', 'partielle Thromboplastinzeit'],
		unit: 's',
		units: [{ unit: 'sec', factor: 1 }],
		decimals: 1,
		group: 'coagulation',
		related: ['quick'],
		refs: [
			adult([23.9, 33.2], 'ulm-aptt', { note: T('Roche reagent on cobas t. The seconds depend a lot on the reagent, so a printed lab range wins.', 'Roche-Reagenz auf cobas t. Die Sekunden hängen stark vom Reagenz ab, ein gedruckter Laborbereich hat daher Vorrang.') })
		]
	},
	{
		id: 'fibrinogen',
		name: T('Fibrinogen', 'Fibrinogen'),
		aliases: ['Fibrinogen (Clauss)', 'Factor I'],
		unit: 'mg/dl',
		units: [{ unit: 'g/l', factor: 100 }],
		si: { unit: 'g/l', factor: 0.01, decimals: 2 },
		decimals: 0,
		group: 'coagulation',
		related: ['d-dimer', 'crp'],
		refs: [
			adult([193, 412], 'ulm-fib', { note: T('1.93 to 4.12 g/l, Clauss method on Roche cobas t, as given in the Roche package insert.', '1,93 bis 4,12 g/l, Clauss-Methode auf Roche cobas t, laut Roche-Packungsbeilage.') })
		]
	},
	{
		id: 'd-dimer',
		name: T('D-dimer', 'D-Dimer'),
		aliases: ['D-Dimere', 'D-Dimer'],
		unit: 'mg/l FEU',
		units: [
			{ unit: 'mg/l', factor: 1 },
			{ unit: 'µg/ml', factor: 1 },
			{ unit: 'µg/ml FEU', factor: 1 },
			{ unit: 'µg/l', factor: 0.001 },
			{ unit: 'µg/l FEU', factor: 0.001 },
			{ unit: 'ng/ml', factor: 0.001 },
			{ unit: 'ng/ml FEU', factor: 0.001 }
		],
		decimals: 2,
		group: 'coagulation',
		scale: 'log',
		related: ['fibrinogen'],
		refs: [
			clinical('esc', T('Exclusion cutoff (ESC)', 'Ausschlussgrenze (ESC)'), [undefined, 0.5], 'esc-pe2019', {
				note: T('Above age 50 an age adjusted cutoff of age × 0.01 mg/l is used.', 'Ab 50 Jahren wird eine altersangepasste Grenze von Alter × 0,01 mg/l genutzt.')
			})
		]
	}
];

function differential(): AnalyteDef[] {
	const cells = [
		{
			id: 'neutrophils',
			name: T('Neutrophils', 'Neutrophile'),
			aliases: ['Neutro', 'Segmentkernige', 'Neutrophile Granulozyten'],
			abs: [1.56, 6.45] as [number, number],
			pct: [37.1, 68.4] as [number, number]
		},
		{
			id: 'lymphocytes',
			name: T('Lymphocytes', 'Lymphozyten'),
			aliases: ['Lympho', 'Lymphos'],
			abs: [0.95, 3.07] as [number, number],
			pct: [21, 50] as [number, number]
		},
		{
			id: 'monocytes',
			name: T('Monocytes', 'Monozyten'),
			aliases: ['Mono', 'Monos'],
			abs: [0.26, 0.81] as [number, number],
			pct: [5.1, 11.2] as [number, number]
		},
		{
			id: 'eosinophils',
			name: T('Eosinophils', 'Eosinophile'),
			aliases: ['Eos', 'Eosinophile Granulozyten'],
			abs: [0.03, 0.48] as [number, number],
			pct: [0.4, 6.6] as [number, number]
		},
		{
			id: 'basophils',
			name: T('Basophils', 'Basophile'),
			aliases: ['Baso', 'Basophile Granulozyten'],
			abs: [0.01, 0.08] as [number, number],
			pct: [0.2, 1.3] as [number, number]
		},
		{
			id: 'ig',
			name: T('Immature granulocytes', 'Unreife Granulozyten'),
			aliases: ['IG', 'Immature Granulozyten'],
			abs: [0.01, 0.04] as [number, number],
			pct: [0.1, 0.6] as [number, number],
			source: 'isiklar2026'
		}
	];

	return cells.flatMap((c): AnalyteDef[] => [
		{
			id: `${c.id}-pct`,
			name: T(`${c.name.en} %`, `${c.name.de} %`),
			aliases: c.aliases.map((a) => `${a} %`),
			unit: '%',
			decimals: 1,
			group: 'differential',
			related: [`${c.id}-abs`, 'leukocytes'],
			refs: [adult(c.pct, c.source ?? 'arbiol2018')]
		},
		{
			id: `${c.id}-abs`,
			name: T(`${c.name.en}, absolute`, `${c.name.de}, absolut`),
			aliases: c.aliases.map((a) => `${a} absolut`),
			unit: '/nl',
			units: PER_NL,
			decimals: 2,
			group: 'differential',
			related: [`${c.id}-pct`, 'leukocytes'],
			refs: [adult(c.abs, c.source ?? 'mayo-cbc')]
		}
	]);
}
