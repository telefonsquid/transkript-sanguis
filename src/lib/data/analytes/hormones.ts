import type { AnalyteDef } from '../types';
import { T, adult, context, female, male, target, transMen, transWomen } from './refs';

const ADULT: [number, number] = [18, 49];
const OLDER: [number, number] = [50, 120];

export const hormones: AnalyteDef[] = [
	{
		id: 'estradiol',
		name: T('Estradiol', 'Östradiol'),
		aliases: ['E2', 'Oestradiol', 'Estradiol (E2)', '17-beta-Estradiol', '17β-Östradiol'],
		unit: 'pg/ml',
		units: [
			{ unit: 'pmol/l', factor: 1 / 3.671 },
			{ unit: 'ng/l', factor: 1 }
		],
		si: { unit: 'pmol/l', factor: 3.671, decimals: 0 },
		decimals: 1,
		group: 'hormones',
		scale: 'log',
		primary: { feminizing: 'target-endo', masculinizing: 'trans-m' },
		related: ['testosterone', 'shbg', 'lh', 'fsh', 'prolactin'],
		refs: [
			target('target-endo', T('HRT target (Endocrine Society, WPATH)', 'HRT-Ziel (Endocrine Society, WPATH)'), [100, 200], 'endo2017', {
				therapy: 'feminizing',
				note: T('Physiological cis female level and the most widely used target. For injections it is meant as the lowest level before the next dose.', 'Physiologischer cis weiblicher Spiegel und das am weitesten verbreitete Ziel. Bei Injektionen als Tiefstwert vor der nächsten Dosis gemeint.')
			}),
			target('target-nhs', T('NHS GIC target', 'NHS-GIC-Ziel'), [109, 163], 'nhs-gic', { therapy: 'feminizing', note: T('400 to 600 pmol/l.', '400 bis 600 pmol/l.') }),
			target('target-aus', T('Australian target', 'Australisches Ziel'), [68, 163], 'cheung2019', { therapy: 'feminizing', note: T('250 to 600 pmol/l.', '250 bis 600 pmol/l.') }),
			context('mono', T('Monotherapy suppression zone', 'Suppressionsbereich ohne Antiandrogen'), [200, 500], 'tfs-intro', {
				therapy: 'feminizing',
				note: T(
					'Without an antiandrogen, estradiol around 200 pg/ml suppresses testosterone by roughly 90 %, around 500 pg/ml by roughly 95 %. A range where estradiol alone tends to do the antiandrogen’s job, not a dosing target.',
					'Ohne Antiandrogen senkt Östradiol um 200 pg/ml Testosteron um etwa 90 %, um 500 pg/ml um etwa 95 %. Ein Bereich, in dem Östradiol allein die Aufgabe des Antiandrogens übernimmt, kein Dosisziel.'
				)
			}),
			context('ev-cohort', T('EV 3 to 4 mg/week, observed', 'EV 3 bis 4 mg/Woche, beobachtet'), [100, 357], 'ev-mono2025', {
				therapy: 'feminizing',
				note: T('Where most people on 3 to 4 mg estradiol valerate weekly landed (76 to 78 %), median 232 pg/ml.', 'Wo die meisten mit 3 bis 4 mg Östradiolvalerat pro Woche lagen (76 bis 78 %), Median 232 pg/ml.')
			}),
			transWomen([20.7, 505], 'greene2021-tw', {
				note: T('Everyone on estrogen for 12 months or more, whatever the dose or draw timing. Describes the cohort, not a target. LC-MS/MS.', 'Alle mit mindestens 12 Monaten Östrogen, unabhängig von Dosis und Abnahmezeitpunkt. Beschreibt die Kohorte, kein Ziel. LC-MS/MS.')
			}),
			transMen([4.0, 77], 'greene2021-tm', { note: T('On testosterone for 12 months or more. Roche immunoassay.', 'Mindestens 12 Monate Testosteron. Roche-Immunoassay.') }),
			female([30.9, 90.4], 'roche-e2', { id: 'female-follicular', label: T('Cis women, follicular phase', 'Cis Frauen, Follikelphase') }),
			female([60.4, 533], 'roche-e2', { id: 'female-ovulation', label: T('Cis women, ovulation', 'Cis Frauen, Ovulation') }),
			female([60.4, 232], 'roche-e2', { id: 'female-luteal', label: T('Cis women, luteal phase', 'Cis Frauen, Lutealphase') }),
			female([undefined, 138], 'roche-e2', { id: 'female-post', label: T('Postmenopausal women', 'Frauen nach der Menopause'), note: T('Median below 5 pg/ml.', 'Median unter 5 pg/ml.') }),
			male([11.3, 43.2], 'roche-e2')
		]
	},
	{
		id: 'testosterone',
		name: T('Testosterone', 'Testosteron'),
		aliases: ['Testosteron gesamt', 'Total testosterone', 'Gesamttestosteron', 'TT'],
		unit: 'ng/ml',
		units: [
			{ unit: 'nmol/l', factor: 1 / 3.467 },
			{ unit: 'ng/dl', factor: 0.01 },
			{ unit: 'µg/l', factor: 1 }
		],
		si: { unit: 'nmol/l', factor: 3.467, decimals: 2 },
		decimals: 2,
		group: 'hormones',
		scale: 'log',
		primary: { feminizing: 'target-endo', masculinizing: 'target-endo-m' },
		related: ['estradiol', 'shbg', 'fai', 'free-t-calc', 'lh'],
		refs: [
			target('target-endo', T('HRT target (Endocrine Society)', 'HRT-Ziel (Endocrine Society)'), [undefined, 0.5], 'endo2017', {
				therapy: 'feminizing',
				note: T('Below 50 ng/dl, about 1.7 nmol/l.', 'Unter 50 ng/dl, etwa 1,7 nmol/l.')
			}),
			target('target-enigi', T('Suppression cutoff (ENIGI)', 'Suppressionsgrenze (ENIGI)'), [undefined, 0.58], 'kuijpers2021', {
				therapy: 'feminizing',
				note: T('2 nmol/l. In the study 10 mg cyproterone acetate suppressed as well as 100 mg.', '2 nmol/l. In der Studie unterdrückten 10 mg Cyproteronacetat so gut wie 100 mg.')
			}),
			target('target-nhs', T('NHS GIC target', 'NHS-GIC-Ziel'), [undefined, 0.87], 'nhs-gic', { therapy: 'feminizing', note: T('0 to 3 nmol/l.', '0 bis 3 nmol/l.') }),
			target('target-endo-m', T('HRT target (Endocrine Society)', 'HRT-Ziel (Endocrine Society)'), [3.2, 10], 'endo2017', {
				therapy: 'masculinizing',
				note: T('The normal physiological male range, 320 to 1000 ng/dl.', 'Der physiologische männliche Bereich, 320 bis 1000 ng/dl.')
			}),
			context('midcycle', T('Mid-interval aim for injections', 'Ziel zur Intervallmitte bei Injektionen'), [4, 7], 'endo2017', {
				therapy: 'masculinizing',
				note: T('400 to 700 ng/dl, measured midway between two injections of testosterone enanthate or cypionate.', '400 bis 700 ng/dl, gemessen in der Mitte zwischen zwei Injektionen von Testosteronenantat oder -cypionat.')
			}),
			transMen([1.58, 11.15], 'greene2021-tm', { note: T('On testosterone for 12 months or more. Roche immunoassay.', 'Mindestens 12 Monate Testosteron. Roche-Immunoassay.') }),
			female([0.084, 0.481], 'roche-testo', { age: ADULT, note: T('Age 20 to 49.', 'Alter 20 bis 49.') }),
			female([0.029, 0.408], 'roche-testo', { id: 'female-50', age: OLDER, note: T('Age 50 and older.', 'Ab 50 Jahren.') }),
			male([2.49, 8.36], 'roche-testo', { age: ADULT, note: T('Age 20 to 49.', 'Alter 20 bis 49.') }),
			male([1.93, 7.4], 'roche-testo', { id: 'male-50', age: OLDER, note: T('Age 50 and older.', 'Ab 50 Jahren.') })
		]
	},
	{
		id: 'free-t-calc',
		name: T('Free testosterone, calculated', 'Freies Testosteron, berechnet'),
		aliases: ['cFT', 'FTc', 'Calculated free testosterone', 'freies Testosteron (berechnet)'],
		unit: 'pg/ml',
		units: [
			{ unit: 'pmol/l', factor: 1 / 3.467 },
			{ unit: 'nmol/l', factor: 288.4 },
			{ unit: 'ng/dl', factor: 10 }
		],
		si: { unit: 'pmol/l', factor: 3.467, decimals: 1 },
		decimals: 1,
		group: 'hormones',
		scale: 'log',
		primary: { feminizing: 'female', masculinizing: 'male' },
		derived: T(
			'Vermeulen equation from total testosterone, SHBG and albumin (4.3 g/dl assumed when albumin was not measured).',
			'Vermeulen-Formel aus Gesamttestosteron, SHBG und Albumin (4,3 g/dl angenommen, wenn Albumin nicht gemessen wurde).'
		),
		related: ['testosterone', 'shbg', 'fai'],
		refs: [
			female([0.9, 9.5], 'roche-testo', { age: ADULT, note: T('Calculated, age 20 to 49 (0.003 to 0.033 nmol/l).', 'Berechnet, Alter 20 bis 49 (0,003 bis 0,033 nmol/l).') }),
			female([0.3, 5.8], 'roche-testo', { id: 'female-50', age: OLDER, note: T('Calculated, age 50 and older.', 'Berechnet, ab 50 Jahren.') }),
			male([57.1, 178.5], 'roche-testo', { age: ADULT, note: T('Calculated, age 20 to 49 (0.198 to 0.619 nmol/l).', 'Berechnet, Alter 20 bis 49 (0,198 bis 0,619 nmol/l).') }),
			male([47.0, 136.4], 'roche-testo', { id: 'male-50', age: OLDER, note: T('Calculated, age 50 and older.', 'Berechnet, ab 50 Jahren.') })
		]
	},
	{
		id: 'free-t',
		name: T('Free testosterone, measured', 'Freies Testosteron, gemessen'),
		aliases: ['FT', 'Free testosterone', 'freies Testosteron'],
		unit: 'pg/ml',
		units: [
			{ unit: 'pmol/l', factor: 1 / 3.467 },
			{ unit: 'nmol/l', factor: 288.4 },
			{ unit: 'ng/dl', factor: 10 }
		],
		si: { unit: 'pmol/l', factor: 3.467, decimals: 1 },
		decimals: 2,
		group: 'hormones',
		scale: 'log',
		related: ['free-t-calc', 'testosterone', 'shbg'],
		refs: []
	},
	{
		id: 'shbg',
		name: T('SHBG', 'SHBG'),
		aliases: ['Sex hormone binding globulin', 'Sexualhormon-bindendes Globulin'],
		unit: 'nmol/l',
		decimals: 1,
		group: 'hormones',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['testosterone', 'fai', 'free-t-calc', 'estradiol'],
		refs: [
			transWomen([32.7, 274], 'greene2021-tw', { note: T('On estrogen for 12 months or more.', 'Mindestens 12 Monate Östrogen.') }),
			transMen([10.1, 86.1], 'greene2021-tm', { note: T('On testosterone for 12 months or more.', 'Mindestens 12 Monate Testosteron.') }),
			female([24.6, 122], 'roche-testo', { age: ADULT, note: T('Age 20 to 49.', 'Alter 20 bis 49.') }),
			female([17.3, 125], 'roche-testo', { id: 'female-50', age: OLDER, note: T('Age 50 and older.', 'Ab 50 Jahren.') }),
			male([16.5, 55.9], 'roche-testo', { age: ADULT, note: T('Age 20 to 49.', 'Alter 20 bis 49.') }),
			male([19.3, 76.4], 'roche-testo', { id: 'male-50', age: OLDER, note: T('Age 50 and older.', 'Ab 50 Jahren.') })
		]
	},
	{
		id: 'fai',
		name: T('Free androgen index', 'Freier Androgenindex'),
		aliases: ['FAI', 'FTI', 'Free testosterone index', 'Androgenindex'],
		unit: '%',
		decimals: 1,
		group: 'hormones',
		scale: 'log',
		primary: { feminizing: 'female', masculinizing: 'male' },
		derived: T('100 × testosterone (nmol/l) ÷ SHBG (nmol/l), computed where the lab did not print it.', '100 × Testosteron (nmol/l) ÷ SHBG (nmol/l), berechnet, wo das Labor ihn nicht angibt.'),
		related: ['testosterone', 'shbg', 'free-t-calc'],
		refs: [
			female([0.297, 5.62], 'roche-testo', { age: ADULT, note: T('Age 20 to 49.', 'Alter 20 bis 49.') }),
			female([0.187, 3.63], 'roche-testo', { id: 'female-50', age: OLDER, note: T('Age 50 and older.', 'Ab 50 Jahren.') }),
			male([35, 92.6], 'roche-testo', { age: ADULT, note: T('Age 20 to 49.', 'Alter 20 bis 49.') }),
			male([24.3, 72.1], 'roche-testo', { id: 'male-50', age: OLDER, note: T('Age 50 and older.', 'Ab 50 Jahren.') })
		]
	},
	{
		id: 'dht',
		name: T('Dihydrotestosterone', 'Dihydrotestosteron'),
		aliases: ['DHT', '5α-DHT', '5-alpha-Dihydrotestosteron'],
		unit: 'pg/ml',
		units: [
			{ unit: 'nmol/l', factor: 290.4 },
			{ unit: 'ng/dl', factor: 10 },
			{ unit: 'ng/ml', factor: 1000 },
			{ unit: 'ng/l', factor: 1 }
		],
		si: { unit: 'nmol/l', factor: 1 / 290.4, decimals: 2 },
		decimals: 0,
		group: 'hormones',
		scale: 'log',
		related: ['testosterone'],
		refs: []
	},
	{
		id: 'lh',
		name: T('LH', 'LH'),
		aliases: ['Luteinizing hormone', 'Luteinisierendes Hormon', 'Lutropin'],
		unit: 'U/l',
		units: [
			{ unit: 'IU/l', factor: 1 },
			{ unit: 'mIU/ml', factor: 1 },
			{ unit: 'mU/ml', factor: 1 }
		],
		decimals: 1,
		group: 'hormones',
		scale: 'log',
		primary: { feminizing: 'trans-f', masculinizing: 'trans-m' },
		related: ['fsh', 'testosterone', 'estradiol'],
		refs: [
			transWomen([undefined, 40], 'greene2021-tw', {
				note: T(
					'On estrogen for 12 months or more, whatever the regimen or draw timing. Describes the cohort, not a target. With spironolactone up to 14, on estrogen alone up to 41. Roche immunoassay, the lower limit sits at the assay floor (0.09) and is left open.',
					'Mindestens 12 Monate Östrogen, unabhängig von Therapieschema und Abnahmezeitpunkt. Beschreibt die Kohorte, kein Ziel. Mit Spironolacton bis 14, mit Östrogen allein bis 41. Roche-Immunoassay, die Untergrenze liegt an der Messgrenze (0,09) und bleibt offen.'
				)
			}),
			transMen([undefined, 42], 'greene2021-tm', {
				note: T(
					'On testosterone for 12 months or more. Roche immunoassay, the lower limit lies below what the assay measures (<0.1) and is left open.',
					'Mindestens 12 Monate Testosteron. Roche-Immunoassay, die Untergrenze liegt unter der Messgrenze (<0,1) und bleibt offen.'
				)
			}),
			male([1.7, 8.6], 'roche-lh'),
			female([2.4, 12.6], 'roche-lh', { id: 'female-follicular', label: T('Cis women, follicular phase', 'Cis Frauen, Follikelphase') }),
			female([14, 95.6], 'roche-lh', { id: 'female-ovulation', label: T('Cis women, ovulation', 'Cis Frauen, Ovulation') }),
			female([1, 11.4], 'roche-lh', { id: 'female-luteal', label: T('Cis women, luteal phase', 'Cis Frauen, Lutealphase') }),
			female([7.7, 58.5], 'roche-lh', { id: 'female-post', label: T('Postmenopausal women', 'Frauen nach der Menopause') })
		]
	},
	{
		id: 'fsh',
		name: T('FSH', 'FSH'),
		aliases: ['Follicle stimulating hormone', 'Follikelstimulierendes Hormon', 'Follitropin'],
		unit: 'U/l',
		units: [
			{ unit: 'IU/l', factor: 1 },
			{ unit: 'mIU/ml', factor: 1 },
			{ unit: 'mU/ml', factor: 1 }
		],
		decimals: 1,
		group: 'hormones',
		scale: 'log',
		primary: { feminizing: 'trans-f', masculinizing: 'trans-m' },
		related: ['lh', 'estradiol', 'amh'],
		refs: [
			transWomen([undefined, 60], 'greene2021-tw', {
				note: T(
					'On estrogen for 12 months or more, whatever the regimen or draw timing. Describes the cohort, not a target. With spironolactone up to 14, on estrogen alone up to 80. Roche immunoassay, the lower limit sits at the assay floor (0.09) and is left open.',
					'Mindestens 12 Monate Östrogen, unabhängig von Therapieschema und Abnahmezeitpunkt. Beschreibt die Kohorte, kein Ziel. Mit Spironolacton bis 14, mit Östrogen allein bis 80. Roche-Immunoassay, die Untergrenze liegt an der Messgrenze (0,09) und bleibt offen.'
				)
			}),
			transMen([0.3, 28], 'greene2021-tm', { note: T('On testosterone for 12 months or more. Roche immunoassay.', 'Mindestens 12 Monate Testosteron. Roche-Immunoassay.') }),
			male([1.5, 12.4], 'roche-lh'),
			female([3.5, 12.5], 'roche-lh', { id: 'female-follicular', label: T('Cis women, follicular phase', 'Cis Frauen, Follikelphase') }),
			female([4.7, 21.5], 'roche-lh', { id: 'female-ovulation', label: T('Cis women, ovulation', 'Cis Frauen, Ovulation') }),
			female([1.7, 7.7], 'roche-lh', { id: 'female-luteal', label: T('Cis women, luteal phase', 'Cis Frauen, Lutealphase') }),
			female([25.8, 134.8], 'roche-lh', { id: 'female-post', label: T('Postmenopausal women', 'Frauen nach der Menopause') })
		]
	},
	{
		id: 'prolactin',
		name: T('Prolactin', 'Prolaktin'),
		aliases: ['PRL', 'Prolactin'],
		unit: 'ng/ml',
		units: [
			{ unit: 'µg/l', factor: 1 },
			{ unit: 'mIU/l', factor: 1 / 21.2 },
			{ unit: 'µIU/ml', factor: 1 / 21.2 },
			{ unit: 'mU/l', factor: 1 / 21.2 }
		],
		si: { unit: 'mIU/l', factor: 21.2, decimals: 0 },
		decimals: 1,
		group: 'hormones',
		primary: { feminizing: 'female', masculinizing: 'male' },
		related: ['estradiol', 'tsh'],
		refs: [
			transWomen([4.9, 32], 'greene2021-tw', { note: T('On estrogen for 12 months or more, a third of them with spironolactone.', 'Mindestens 12 Monate Östrogen, ein Drittel davon mit Spironolacton.') }),
			transWomen([4.7, 48.1], 'boekhout2023', {
				id: 'trans-f-cpa',
				label: T('Trans women after 12 months (Amsterdam)', 'Trans Frauen nach 12 Monaten (Amsterdam)'),
				note: T('0.10 to 1.02 U/l. Cohort treated with cyproterone acetate, which raises prolactin more.', '0,10 bis 1,02 U/l. Kohorte mit Cyproteronacetat, das Prolaktin stärker erhöht.')
			}),
			transMen([3.9, 29.4], 'greene2021-tm', { note: T('On testosterone for 12 months or more.', 'Mindestens 12 Monate Testosteron.') }),
			female([4.79, 23.3], 'roche-prl', { note: T('Not pregnant.', 'Nicht schwanger.') }),
			male([4.04, 15.2], 'roche-prl')
		]
	},
	{
		id: 'progesterone',
		name: T('Progesterone', 'Progesteron'),
		aliases: ['P4', 'Progesteron'],
		unit: 'ng/ml',
		units: [
			{ unit: 'nmol/l', factor: 1 / 3.18 },
			{ unit: 'µg/l', factor: 1 }
		],
		si: { unit: 'nmol/l', factor: 3.18, decimals: 2 },
		decimals: 2,
		group: 'hormones',
		scale: 'log',
		related: ['estradiol', 'lh'],
		refs: [
			transWomen([0.1, 3.1], 'greene2021-tw', { note: T('On estrogen for 12 months or more, 11 of the 93 also took progesterone.', 'Mindestens 12 Monate Östrogen, 11 der 93 nahmen zusätzlich Progesteron.') }),
			transMen([0.1, 0.5], 'greene2021-tm', { note: T('On testosterone for 12 months or more.', 'Mindestens 12 Monate Testosteron.') }),
			female([undefined, 0.193], 'roche-prog', { id: 'female-follicular', label: T('Cis women, follicular phase', 'Cis Frauen, Follikelphase') }),
			female([0.055, 4.14], 'roche-prog', { id: 'female-ovulation', label: T('Cis women, ovulation', 'Cis Frauen, Ovulation') }),
			female([4.11, 14.5], 'roche-prog', { id: 'female-luteal', label: T('Cis women, luteal phase', 'Cis Frauen, Lutealphase') }),
			female([undefined, 0.126], 'roche-prog', { id: 'female-post', label: T('Postmenopausal women', 'Frauen nach der Menopause') }),
			male([undefined, 0.149], 'roche-prog')
		]
	},
	{
		id: 'amh',
		name: T('AMH', 'AMH'),
		aliases: ['Anti-Müllerian hormone', 'Anti-Müller-Hormon'],
		unit: 'ng/ml',
		units: [
			{ unit: 'pmol/l', factor: 1 / 7.14 },
			{ unit: 'µg/l', factor: 1 }
		],
		si: { unit: 'pmol/l', factor: 7.14, decimals: 1 },
		decimals: 2,
		group: 'hormones',
		scale: 'log',
		related: ['fsh'],
		refs: [transMen([0.02, 14], 'greene2021-tm', { note: T('On testosterone for 12 months or more.', 'Mindestens 12 Monate Testosteron.') })]
	},
	{
		id: 'dhea-s',
		name: T('DHEA-S', 'DHEA-S'),
		aliases: ['DHEAS', 'Dehydroepiandrosterone sulfate', 'Dehydroepiandrosteronsulfat'],
		unit: 'µg/dl',
		units: [
			{ unit: 'µmol/l', factor: 36.85 },
			{ unit: 'mg/l', factor: 100 },
			{ unit: 'µg/ml', factor: 100 }
		],
		si: { unit: 'µmol/l', factor: 1 / 36.85, decimals: 2 },
		decimals: 0,
		group: 'adrenal',
		primary: { feminizing: 'trans-f', masculinizing: 'trans-m' },
		related: ['testosterone', 'cortisol'],
		refs: [
			transWomen([36.2, 469], 'greene2021-tw', { note: T('On estrogen for 12 months or more.', 'Mindestens 12 Monate Östrogen.') }),
			transMen([51, 642], 'greene2021-tm', { note: T('On testosterone for 12 months or more.', 'Mindestens 12 Monate Testosteron.') }),
			...dheasBands()
		]
	},
	{
		id: 'cortisol',
		name: T('Cortisol', 'Cortisol'),
		aliases: ['Kortisol', 'Cortisol basal', 'Serum cortisol'],
		unit: 'µg/dl',
		units: [
			{ unit: 'nmol/l', factor: 1 / 27.59 },
			{ unit: 'ng/ml', factor: 0.1 },
			{ unit: 'µg/l', factor: 0.1 }
		],
		si: { unit: 'nmol/l', factor: 27.59, decimals: 0 },
		decimals: 1,
		group: 'adrenal',
		related: ['dhea-s'],
		primary: { any: 'morning' },
		refs: [
			adult([6.02, 18.4], 'roche-cortisol', { id: 'morning', label: T('Adults, morning (6 to 10 am)', 'Erwachsene, morgens (6 bis 10 Uhr)'), note: T('5th to 95th percentile of 296 healthy adults. Estrogen raises the binding protein and with it total cortisol, so values on estrogen can sit higher.', '5. bis 95. Perzentile von 296 gesunden Erwachsenen. Östrogen erhöht das Bindungsprotein und damit das Gesamtcortisol, Werte unter Östrogen können daher höher liegen.') }),
			adult([2.68, 10.5], 'roche-cortisol', { id: 'afternoon', label: T('Adults, afternoon (4 to 8 pm)', 'Erwachsene, nachmittags (16 bis 20 Uhr)'), note: T('5th to 95th percentile of 300 healthy adults.', '5. bis 95. Perzentile von 300 gesunden Erwachsenen.') })
		]
	},
	{
		id: 'tsh',
		name: T('TSH', 'TSH'),
		aliases: ['TSH basal', 'Thyroid stimulating hormone', 'Thyreotropin', 'TSH (basal)'],
		unit: 'mU/l',
		units: [
			{ unit: 'µIU/ml', factor: 1 },
			{ unit: 'µU/ml', factor: 1 },
			{ unit: 'mIU/l', factor: 1 }
		],
		decimals: 2,
		group: 'thyroid',
		scale: 'log',
		related: ['ft4', 'ft3'],
		refs: [adult([0.27, 4.2], 'roche-tsh')]
	},
	{
		id: 'ft4',
		name: T('Free T4', 'Freies T4'),
		aliases: ['fT4', 'FT4', 'Free thyroxine', 'freies Thyroxin'],
		unit: 'ng/dl',
		units: [
			{ unit: 'pmol/l', factor: 1 / 12.87 },
			{ unit: 'ng/l', factor: 0.1 }
		],
		si: { unit: 'pmol/l', factor: 12.87, decimals: 1 },
		decimals: 2,
		group: 'thyroid',
		related: ['tsh', 'ft3'],
		refs: [adult([0.92, 1.68], 'roche-ft4', { note: T('11.9 to 21.6 pmol/l.', '11,9 bis 21,6 pmol/l.') })]
	},
	{
		id: 'ft3',
		name: T('Free T3', 'Freies T3'),
		aliases: ['fT3', 'FT3', 'Free triiodothyronine', 'freies Trijodthyronin'],
		unit: 'pg/ml',
		units: [
			{ unit: 'pmol/l', factor: 1 / 1.536 },
			{ unit: 'ng/l', factor: 1 }
		],
		si: { unit: 'pmol/l', factor: 1.536, decimals: 1 },
		decimals: 2,
		group: 'thyroid',
		related: ['tsh', 'ft4'],
		refs: [adult([2.0, 4.4], 'roche-ft3', { note: T('3.1 to 6.8 pmol/l.', '3,1 bis 6,8 pmol/l.') })]
	},
	{
		id: 'anti-tpo',
		name: T('TPO antibodies', 'TPO-Antikörper'),
		aliases: ['Anti-TPO', 'TPO-AK', 'Thyroid peroxidase antibodies', 'MAK'],
		unit: 'IU/ml',
		units: [
			{ unit: 'U/ml', factor: 1 },
			{ unit: 'kIU/l', factor: 1 },
			{ unit: 'kU/l', factor: 1 }
		],
		decimals: 0,
		group: 'thyroid',
		scale: 'log',
		related: ['tsh'],
		refs: [
			adult([undefined, 34], 'roche-antitpo', { note: T('Elecsys Anti-TPO, the assay many German labs run: 95 % of 208 healthy adults in Austria and Germany stay below 34. Other assays use other cut-offs, so a printed lab range wins.', 'Elecsys Anti-TPO, der Test vieler deutscher Labore: 95 % von 208 gesunden Erwachsenen in Österreich und Deutschland liegen unter 34. Andere Tests nutzen andere Grenzen, ein gedruckter Laborbereich hat daher Vorrang.') })
		]
	}
];

/** Roche DHEA-S bands by age, the only way this steadily falling value makes sense */
function dheasBands() {
	const bands: [number, number, number, number, number, number][] = [
		[20, 24, 148, 407, 211, 492],
		[25, 34, 98.8, 340, 160, 449],
		[35, 44, 60.9, 337, 88.9, 427],
		[45, 54, 35.4, 256, 44.3, 331],
		[55, 64, 18.9, 205, 51.7, 295],
		[65, 74, 9.4, 246, 33.6, 249],
		[75, 120, 12, 154, 16.2, 123]
	];
	return bands.flatMap(([from, to, fl, fh, ml, mh]) => {
		const span = to >= 120 ? `${from}+` : `${from}–${to}`;
		return [
			female([fl, fh], 'roche-dheas', { id: `female-${from}`, age: [from, to], label: T(`Cis women, ${span}`, `Cis Frauen, ${span}`) }),
			male([ml, mh], 'roche-dheas', { id: `male-${from}`, age: [from, to], label: T(`Cis men, ${span}`, `Cis Männer, ${span}`) })
		];
	});
}
