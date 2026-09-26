import type { AnalyteDef } from '../types';
import { T, adult, clinical, female, male, transWomen } from './refs';

export const nutrients: AnalyteDef[] = [
	{
		id: 'iron',
		name: T('Iron', 'Eisen'),
		aliases: ['Fe', 'Serum iron', 'Serumeisen', 'Eisen im Serum'],
		unit: 'µg/dl',
		units: [{ unit: 'µmol/l', factor: 5.585 }],
		si: { unit: 'µmol/l', factor: 0.1791, decimals: 1 },
		decimals: 0,
		group: 'iron',
		related: ['ferritin', 'transferrin', 'tsat', 'hemoglobin'],
		refs: [
			adult([33, 193], 'roche-iron', { note: T('5.83 to 34.5 µmol/l.', '5,83 bis 34,5 µmol/l.') }),
			female([37, 145], 'nhanes-biopro'),
			male([59, 158], 'nhanes-biopro')
		]
	},
	{
		id: 'ferritin',
		name: T('Ferritin', 'Ferritin'),
		aliases: ['Ferritin (Serum)'],
		unit: 'ng/ml',
		units: [
			{ unit: 'µg/l', factor: 1 },
			{ unit: 'pmol/l', factor: 1 / 2.247 }
		],
		decimals: 0,
		group: 'iron',
		scale: 'log',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['iron', 'tsat', 'hemoglobin', 'crp'],
		refs: [
			female([13, 150], 'roche-ferritin'),
			male([30, 400], 'roche-ferritin'),
			clinical('who', T('Iron deficiency below (WHO)', 'Eisenmangel darunter (WHO)'), [15, undefined], 'who-ferritin2020', {
				note: T('Adults without inflammation. With inflammation WHO uses 70 µg/l.', 'Erwachsene ohne Entzündung. Bei Entzündung nutzt die WHO 70 µg/l.')
			})
		]
	},
	{
		id: 'transferrin',
		name: T('Transferrin', 'Transferrin'),
		aliases: ['Trf'],
		unit: 'mg/dl',
		units: [{ unit: 'g/l', factor: 100 }],
		si: { unit: 'g/l', factor: 0.01, decimals: 2 },
		decimals: 0,
		group: 'iron',
		related: ['tsat', 'iron', 'ferritin'],
		refs: [
			adult([200, 360], 'roche-trsf', { note: T('2.0 to 3.6 g/l.', '2,0 bis 3,6 g/l.') })
		]
	},
	{
		id: 'tsat',
		name: T('Transferrin saturation', 'Transferrinsättigung'),
		aliases: ['TSAT', 'TfS', 'Transferrin-Sättigung', 'Eisensättigung'],
		unit: '%',
		decimals: 0,
		group: 'iron',
		derived: T('Iron (µg/dl) × 70.9 ÷ transferrin (mg/dl), computed where the lab did not print it.', 'Eisen (µg/dl) × 70,9 ÷ Transferrin (mg/dl), berechnet, wo das Labor sie nicht angibt.'),
		related: ['iron', 'transferrin', 'ferritin'],
		refs: [
			clinical('deficiency', T('Iron deficiency below', 'Eisenmangel darunter'), [20, undefined], 'esc-hf2021'),
			clinical('overload', T('Check for iron overload above', 'Eisenüberladung abklären darüber'), [undefined, 45], 'easl2022')
		]
	},
	{
		id: 'vitamin-d',
		name: T('Vitamin D (25-OH)', 'Vitamin D (25-OH)'),
		aliases: ['25-OH-Vitamin D', '25(OH)D', '25-Hydroxyvitamin D', 'Calcidiol', 'Vitamin D3 (25-OH)', '25-OH-D3'],
		unit: 'ng/ml',
		units: [
			{ unit: 'nmol/l', factor: 1 / 2.496 },
			{ unit: 'µg/l', factor: 1 }
		],
		si: { unit: 'nmol/l', factor: 2.496, decimals: 0 },
		decimals: 1,
		group: 'vitamins',
		primary: { any: 'iom-sufficient' },
		related: ['calcium', 'alp', 'phosphate'],
		refs: [
			clinical('iom-deficient', T('Risk of deficiency below (IOM)', 'Mangelrisiko darunter (IOM)'), [12, undefined], 'iom2011', { note: T('Below 30 nmol/l.', 'Unter 30 nmol/l.') }),
			clinical('iom-sufficient', T('Sufficient for bone health (IOM)', 'Ausreichend für die Knochen (IOM)'), [20, 50], 'iom2011', {
				note: T('50 nmol/l covers nearly everyone. Above 50 ng/ml (125 nmol/l) no added benefit and possible harm.', '50 nmol/l reichen für fast alle. Über 50 ng/ml (125 nmol/l) kein Zusatznutzen und mögliche Schäden.')
			}),
			clinical('es2011', T('Preferred level, Endocrine Society 2011', 'Bevorzugter Wert, Endocrine Society 2011'), [30, undefined], 'endo-vitd2011', {
				note: T('75 nmol/l. Withdrawn in the 2024 guideline, still printed by many labs.', '75 nmol/l. In der Leitlinie von 2024 zurückgezogen, von vielen Laboren noch angegeben.')
			})
		]
	},
	{
		id: 'b12',
		name: T('Vitamin B12', 'Vitamin B12'),
		aliases: ['B12', 'Cobalamin', 'Cobalamin (B12)', 'Vitamin B 12'],
		unit: 'pg/ml',
		units: [
			{ unit: 'pmol/l', factor: 1.355 },
			{ unit: 'ng/l', factor: 1 }
		],
		si: { unit: 'pmol/l', factor: 1 / 1.355, decimals: 0 },
		decimals: 0,
		group: 'vitamins',
		scale: 'log',
		primary: { any: 'adult' },
		related: ['folate', 'mcv', 'homocysteine'],
		refs: [
			adult([232, 1245], 'roche-b12', { note: T('171 to 919 pmol/l.', '171 bis 919 pmol/l.') }),
			clinical('bsh', T('Deficiency likely below (BSH)', 'Mangel wahrscheinlich darunter (BSH)'), [200, undefined], 'bsh-b12', { note: T('148 pmol/l.', '148 pmol/l.') })
		]
	},
	{
		id: 'folate',
		name: T('Folate', 'Folsäure'),
		aliases: ['Folic acid', 'Folat', 'Folsäure im Serum', 'Vitamin B9'],
		unit: 'ng/ml',
		units: [
			{ unit: 'nmol/l', factor: 1 / 2.266 },
			{ unit: 'µg/l', factor: 1 }
		],
		si: { unit: 'nmol/l', factor: 2.266, decimals: 1 },
		decimals: 1,
		group: 'vitamins',
		primary: { any: 'who' },
		related: ['b12', 'mcv', 'homocysteine'],
		refs: [clinical('who', T('Deficiency below (WHO)', 'Mangel darunter (WHO)'), [4, undefined], 'who-folate2015', { note: T('10 nmol/l.', '10 nmol/l.') })]
	},
	{
		id: 'homocysteine',
		name: T('Homocysteine', 'Homocystein'),
		aliases: ['Hcy', 'HCY'],
		unit: 'µmol/l',
		decimals: 1,
		group: 'vitamins',
		related: ['b12', 'folate'],
		refs: [
			female([undefined, 10.4], 'selhub1999', { age: [20, 59], note: T('95th percentile of vitamin replete women aged 20 to 39 in NHANES III. Limits rise with age.', '95. Perzentile vitaminversorgter Frauen zwischen 20 und 39 in NHANES III. Die Grenzen steigen mit dem Alter.') }),
			male([undefined, 11.4], 'selhub1999', { age: [20, 59], note: T('95th percentile of vitamin replete men aged 20 to 39 in NHANES III. Limits rise with age.', '95. Perzentile vitaminversorgter Männer zwischen 20 und 39 in NHANES III. Die Grenzen steigen mit dem Alter.') }),
			female([4.9, 11.6], 'selhub1999', { id: 'female-60', age: [60, 120], note: T('5th to 95th percentile of vitamin replete women from 60.', '5. bis 95. Perzentile vitaminversorgter Frauen ab 60.') }),
			male([5.9, 15.3], 'selhub1999', { id: 'male-60', age: [60, 120], note: T('5th to 95th percentile of vitamin replete men from 60.', '5. bis 95. Perzentile vitaminversorgter Männer ab 60.') })
		]
	},
	{
		id: 'psa',
		name: T('PSA', 'PSA'),
		aliases: ['Total PSA', 'PSA gesamt', 'Prostate-specific antigen', 'Prostataspezifisches Antigen', 'tPSA'],
		unit: 'ng/ml',
		units: [{ unit: 'µg/l', factor: 1 }],
		decimals: 2,
		group: 'prostate',
		scale: 'log',
		primary: { feminizing: 'trans-f' },
		refs: [
			transWomen([undefined, 0.6], 'nikahd2024', {
				label: T('Trans women on estrogen, 95th percentile', 'Trans Frauen unter Östrogen, 95. Perzentile'),
				note: T('Median 0.02 ng/ml in 210 trans women, fifty times lower than in cis men of the same age.', 'Median 0,02 ng/ml bei 210 trans Frauen, fünfzigmal niedriger als bei gleichaltrigen cis Männern.')
			})
		]
	},
	{
		id: 'weight',
		name: T('Body weight', 'Körpergewicht'),
		aliases: ['Weight', 'Gewicht'],
		unit: 'kg',
		units: [{ unit: 'lb', factor: 0.4536 }],
		decimals: 1,
		group: 'body',
		related: ['bmi'],
		refs: []
	},
	{
		id: 'bmi',
		name: T('BMI', 'BMI'),
		aliases: ['Body mass index', 'Body-Mass-Index'],
		unit: 'kg/m²',
		decimals: 1,
		group: 'body',
		primary: { any: 'who' },
		derived: T('Weight ÷ height², using the height stored in the profile.', 'Gewicht ÷ Größe², mit der im Profil hinterlegten Größe.'),
		related: ['weight'],
		refs: [clinical('who', T('Normal weight (WHO)', 'Normalgewicht (WHO)'), [18.5, 25], 'who-bmi', { note: T('18.5 to 24.9.', '18,5 bis 24,9.') })]
	}
];

