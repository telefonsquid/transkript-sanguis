import type { Analyte } from '../types';
import { T, adult, context, female, male, target, transMen, transWomen } from './refs';

const ADULT: [number, number] = [18, 49];
const OLDER: [number, number] = [50, 120];

export const hormones: Analyte[] = [
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
		info: {
			en: {
				what: 'The main estrogen. Labs measure 17β-estradiol, the same molecule feminizing HRT supplies. Estradiol valerate and cypionate are turned into estradiol in the body.',
				why: 'The central number for dosing feminizing HRT. On masculinizing HRT it shows whether testosterone has taken over from the ovaries.',
				high: 'Supraphysiological levels, most often shortly after an injection. Long-term very high levels are linked to a higher thrombosis risk.',
				low: 'Underdosing, poor absorption or a draw late in an injection interval. On feminizing HRT this can leave testosterone insufficiently suppressed, especially without an antiandrogen.',
				fem: 'Timing matters. After an estradiol valerate injection levels peak after about 2 days and fall over the rest of the interval, so only compare draws taken at similar timing. Oral estradiol is usually checked 4 to 6 hours after a dose. Without an antiandrogen, estradiol has to stay high enough to suppress testosterone on its own.',
				masc: 'Falls as testosterone suppresses the ovaries. Some testosterone is converted into estradiol, so values around the cis male range and the low cis female range are common. Ongoing bleeding with higher estradiol usually means testosterone is not yet suppressive enough.',
				note: 'Conversion: 1 pg/ml = 3.671 pmol/l. Immunoassays read unreliably below about 20 pg/ml.'
			},
			de: {
				what: 'Das wichtigste Östrogen. Gemessen wird 17β-Östradiol, dasselbe Molekül, das feminisierende HRT zuführt. Östradiolvalerat und -cypionat werden im Körper zu Östradiol umgewandelt.',
				why: 'Der zentrale Wert für die Dosierung feminisierender HRT. Unter maskulinisierender HRT zeigt er, ob Testosteron die Eierstöcke unterdrückt.',
				high: 'Übernatürlich hohe Spiegel, meist kurz nach einer Injektion. Dauerhaft sehr hohe Werte gehen mit einem höheren Thromboserisiko einher.',
				low: 'Zu niedrige Dosis, schlechte Aufnahme oder eine Abnahme spät im Injektionsintervall. Unter feminisierender HRT kann Testosteron dann unzureichend unterdrückt sein, besonders ohne Antiandrogen.',
				fem: 'Der Zeitpunkt zählt. Nach einer Östradiolvalerat-Injektion ist der Spiegel nach etwa 2 Tagen am höchsten und fällt dann bis zur nächsten Spritze ab. Vergleiche daher nur Abnahmen mit ähnlichem Abstand zur Injektion. Orales Östradiol wird meist 4 bis 6 Stunden nach der Einnahme kontrolliert. Ohne Antiandrogen muss Östradiol hoch genug bleiben, um Testosteron allein zu unterdrücken.',
				masc: 'Sinkt, sobald Testosteron die Eierstöcke unterdrückt. Ein Teil des Testosterons wird zu Östradiol umgewandelt, Werte im Bereich von cis Männern oder im unteren cis weiblichen Bereich sind daher häufig. Anhaltende Blutungen bei höherem Östradiol sprechen meist für eine noch nicht ausreichende Testosteronwirkung.',
				note: 'Umrechnung: 1 pg/ml = 3,671 pmol/l. Immunoassays messen unter etwa 20 pg/ml unzuverlässig.'
			}
		},
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
		info: {
			en: {
				what: 'The main androgen. Made mostly in the testes under the control of LH, in smaller amounts by the ovaries and adrenal glands.',
				why: 'On feminizing HRT it shows whether suppression works. On masculinizing HRT it is the dosing target.',
				high: 'On feminizing HRT: incomplete suppression, missed antiandrogen doses, or estradiol too low to suppress on its own. On masculinizing HRT: dose too high or a draw soon after an injection.',
				low: 'Expected on feminizing HRT. On masculinizing HRT: underdosing, a draw late in the injection interval, or poor gel absorption.',
				fem: 'Should fall into the cis female range. Values below it are common with cyproterone acetate and are not harmful in themselves. On estradiol alone suppression depends on estradiol staying high across the whole injection interval.',
				masc: 'The goal is the physiological male range. For injections of testosterone enanthate or cypionate the level is usually checked midway between injections. For gels the timing after application matters less, but skin contact before the draw can falsely raise values from a fingertip or arm the gel was applied to.',
				note: 'Conversion: 1 ng/ml = 3.467 nmol/l = 100 ng/dl.'
			},
			de: {
				what: 'Das wichtigste Androgen. Wird vor allem in den Hoden unter Steuerung durch LH gebildet, in kleineren Mengen auch in Eierstöcken und Nebennieren.',
				why: 'Unter feminisierender HRT zeigt es, ob die Unterdrückung wirkt. Unter maskulinisierender HRT ist es das Dosisziel.',
				high: 'Unter feminisierender HRT: unvollständige Unterdrückung, vergessene Antiandrogene oder zu wenig Östradiol, um allein zu unterdrücken. Unter maskulinisierender HRT: zu hohe Dosis oder Abnahme kurz nach einer Injektion.',
				low: 'Unter feminisierender HRT erwartet. Unter maskulinisierender HRT: zu niedrige Dosis, Abnahme spät im Injektionsintervall oder schlechte Aufnahme eines Gels.',
				fem: 'Sollte in den cis weiblichen Bereich fallen. Werte darunter sind mit Cyproteronacetat häufig und an sich nicht schädlich. Mit Östradiol allein hängt die Unterdrückung davon ab, dass Östradiol über das ganze Injektionsintervall hoch genug bleibt.',
				masc: 'Ziel ist der physiologische männliche Bereich. Bei Injektionen von Testosteronenantat oder -cypionat wird meist in der Mitte zwischen zwei Spritzen gemessen. Bei Gelen spielt der Zeitpunkt eine kleinere Rolle, aber Gel auf Haut in der Nähe der Einstichstelle kann Werte falsch erhöhen.',
				note: 'Umrechnung: 1 ng/ml = 3,467 nmol/l = 100 ng/dl.'
			}
		},
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
		info: {
			en: {
				what: 'The share of testosterone that is bound neither to SHBG nor to albumin, estimated from total testosterone and SHBG.',
				why: 'Only free testosterone acts on tissues. When SHBG shifts, as it does on either HRT, the free fraction says more than the total.',
				high: 'More active androgen: high total testosterone, low SHBG.',
				low: 'Little active androgen: effective suppression on feminizing HRT, or high SHBG.',
				fem: 'Should settle in the cis female range. Rising SHBG on oral estradiol pushes it down further.',
				masc: 'Should reach the cis male range. Low SHBG on testosterone raises the free share.',
				note: 'Computed with the method recommended by the ISSAM calculator. Direct immunoassays for free testosterone measure poorly and are not comparable.'
			},
			de: {
				what: 'Der Anteil des Testosterons, der weder an SHBG noch an Albumin gebunden ist, geschätzt aus Gesamttestosteron und SHBG.',
				why: 'Nur freies Testosteron wirkt im Gewebe. Wenn sich SHBG verschiebt, wie unter beiden HRT-Formen, sagt der freie Anteil mehr als der Gesamtwert.',
				high: 'Mehr wirksames Androgen: hohes Gesamttestosteron, niedriges SHBG.',
				low: 'Wenig wirksames Androgen: wirksame Unterdrückung unter feminisierender HRT oder hohes SHBG.',
				fem: 'Sollte sich im cis weiblichen Bereich einpendeln. Steigendes SHBG unter oralem Östradiol drückt es weiter.',
				masc: 'Sollte den cis männlichen Bereich erreichen. Niedriges SHBG unter Testosteron erhöht den freien Anteil.',
				note: 'Berechnet nach der Methode des ISSAM-Rechners. Direkte Immunoassays für freies Testosteron messen schlecht und sind nicht vergleichbar.'
			}
		},
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
		info: {
			en: {
				what: 'Free testosterone as measured by the lab, by direct immunoassay or by equilibrium dialysis.',
				why: 'Same purpose as the calculated value. Only compare values from the same method.',
				note: 'Direct immunoassays are known to be unreliable. Values from equilibrium dialysis or mass spectrometry are the reference, and the calculated value tracks them closely.'
			},
			de: {
				what: 'Vom Labor gemessenes freies Testosteron, per direktem Immunoassay oder Gleichgewichtsdialyse.',
				why: 'Gleicher Zweck wie der berechnete Wert. Vergleiche nur Werte derselben Methode.',
				note: 'Direkte Immunoassays gelten als unzuverlässig. Gleichgewichtsdialyse oder Massenspektrometrie sind die Referenz, der berechnete Wert folgt ihnen gut.'
			}
		},
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
		info: {
			en: {
				what: 'Sex hormone binding globulin, a liver protein that carries testosterone and estradiol in the blood. Hormone bound to it is inactive.',
				why: 'Needed to judge how much testosterone is actually available to tissues.',
				high: 'Estrogens raise SHBG, oral estradiol much more than injections or patches because it passes the liver first. Also an overactive thyroid or liver disease.',
				low: 'Androgens, insulin resistance, obesity and an underactive thyroid lower it.',
				fem: 'Typically rises into or above the cis female range. A drop after switching from oral to injected or transdermal estradiol is expected.',
				masc: 'Falls toward the cis male range, which raises the free share of testosterone.'
			},
			de: {
				what: 'Sexualhormon-bindendes Globulin, ein Eiweiß aus der Leber, das Testosteron und Östradiol im Blut transportiert. Daran gebundenes Hormon ist inaktiv.',
				why: 'Nötig, um einzuschätzen, wie viel Testosteron im Gewebe tatsächlich verfügbar ist.',
				high: 'Östrogene erhöhen SHBG, orales Östradiol deutlich stärker als Spritzen oder Pflaster, weil es zuerst die Leber passiert. Außerdem Schilddrüsenüberfunktion oder Lebererkrankungen.',
				low: 'Androgene, Insulinresistenz, Übergewicht und Schilddrüsenunterfunktion senken es.',
				fem: 'Steigt meist in oder über den cis weiblichen Bereich. Ein Abfall nach dem Wechsel von oralem auf gespritztes oder transdermales Östradiol ist zu erwarten.',
				masc: 'Sinkt Richtung cis männlicher Bereich, wodurch der freie Anteil des Testosterons steigt.'
			}
		},
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
		info: {
			en: {
				what: '100 × total testosterone (nmol/l) ÷ SHBG (nmol/l). A rough estimate of the testosterone that SHBG does not hold back.',
				why: 'Tracks androgen effect better than total testosterone when SHBG is shifted.',
				high: 'More free androgen: high testosterone, or low SHBG.',
				low: 'Little free androgen.',
				fem: 'Should settle in the cis female range.',
				masc: 'Should reach the cis male range.',
				note: 'Works poorly when SHBG is very low. The calculated free testosterone is the better estimate.'
			},
			de: {
				what: '100 × Gesamttestosteron (nmol/l) ÷ SHBG (nmol/l). Eine grobe Schätzung des Testosterons, das SHBG nicht bindet.',
				why: 'Bildet die Androgenwirkung besser ab als das Gesamttestosteron, wenn SHBG verschoben ist.',
				high: 'Mehr freies Androgen: hohes Testosteron oder niedriges SHBG.',
				low: 'Wenig freies Androgen.',
				fem: 'Sollte sich im cis weiblichen Bereich einpendeln.',
				masc: 'Sollte den cis männlichen Bereich erreichen.',
				note: 'Funktioniert bei sehr niedrigem SHBG schlecht. Das berechnete freie Testosteron ist die bessere Schätzung.'
			}
		},
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
		info: {
			en: {
				what: 'The strongest androgen, made from testosterone by the enzyme 5α-reductase, mainly in skin, hair follicles and the prostate.',
				why: 'Drives body hair, scalp hair loss and acne.',
				high: 'High testosterone, or strong local conversion.',
				low: 'Low testosterone, or a 5α-reductase inhibitor such as finasteride or dutasteride.',
				fem: 'Falls with testosterone. 5α-reductase inhibitors lower it further and are sometimes used against scalp hair loss.',
				masc: 'Rises with testosterone and drives facial and body hair, and in some people scalp hair loss and acne.',
				note: 'Only measured reliably by mass spectrometry.'
			},
			de: {
				what: 'Das stärkste Androgen, wird durch das Enzym 5α-Reduktase aus Testosteron gebildet, vor allem in Haut, Haarwurzeln und Prostata.',
				why: 'Treibt Körperbehaarung, Haarausfall am Kopf und Akne.',
				high: 'Hohes Testosteron oder starke Umwandlung im Gewebe.',
				low: 'Niedriges Testosteron oder ein 5α-Reduktase-Hemmer wie Finasterid oder Dutasterid.',
				fem: 'Sinkt mit dem Testosteron. 5α-Reduktase-Hemmer senken es weiter und werden manchmal gegen Haarausfall eingesetzt.',
				masc: 'Steigt mit dem Testosteron und treibt Bart- und Körperbehaarung, bei manchen auch Haarausfall und Akne.',
				note: 'Nur per Massenspektrometrie zuverlässig messbar.'
			}
		},
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
		info: {
			en: {
				what: 'Pituitary hormone that tells the testes or ovaries to make sex hormones.',
				why: 'Estradiol, testosterone and antiandrogens like cyproterone acetate switch this signal off. Suppressed LH confirms that the brain side of the hormone loop is shut down.',
				high: 'The pituitary is pushing: little or no HRT, or the gonads are gone or failing. After gonadectomy LH climbs unless hormone therapy holds it down.',
				low: 'Expected on effective HRT. A value printed as "<0.1" means below what the assay can detect.',
				fem: 'Falls on estradiol and especially with cyproterone acetate. Spironolactone suppresses it less.',
				masc: 'Falls on adequate testosterone doses.'
			},
			de: {
				what: 'Hormon der Hirnanhangsdrüse, das Hoden oder Eierstöcke zur Hormonbildung anregt.',
				why: 'Östradiol, Testosteron und Antiandrogene wie Cyproteronacetat schalten dieses Signal ab. Ein unterdrücktes LH bestätigt, dass die Steuerung vom Gehirn her abgeschaltet ist.',
				high: 'Die Hirnanhangsdrüse treibt an: wenig oder keine HRT, oder die Keimdrüsen fehlen oder arbeiten nicht. Nach einer Gonadektomie steigt LH, solange die Hormontherapie es nicht bremst.',
				low: 'Unter wirksamer HRT erwartet. Ein Wert wie "<0,1" liegt unter der Nachweisgrenze.',
				fem: 'Sinkt unter Östradiol und besonders mit Cyproteronacetat. Spironolacton unterdrückt es weniger.',
				masc: 'Sinkt bei ausreichender Testosterondosis.'
			}
		},
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
		info: {
			en: {
				what: 'Pituitary hormone that drives sperm or egg development.',
				why: 'Suppressed alongside LH on HRT. Together they show whether the hormone loop is switched off.',
				high: 'Pituitary drive is on: no HRT, menopause, or the gonads are gone or failing.',
				low: 'Expected on effective HRT.',
				note: 'mIU/ml, U/l and IU/l are the same number.'
			},
			de: {
				what: 'Hormon der Hirnanhangsdrüse, das die Spermien- oder Eizellreifung antreibt.',
				why: 'Wird unter HRT zusammen mit LH unterdrückt. Beide zusammen zeigen, ob der Regelkreis abgeschaltet ist.',
				high: 'Die Hirnanhangsdrüse treibt an: keine HRT, Menopause, oder die Keimdrüsen fehlen oder arbeiten nicht.',
				low: 'Unter wirksamer HRT erwartet.',
				note: 'mIU/ml, U/l und IU/l sind dieselbe Zahl.'
			}
		},
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
		info: {
			en: {
				what: 'Pituitary hormone best known for milk production.',
				why: 'Estradiol and especially cyproterone acetate raise prolactin. Monitoring catches rare but relevant problems such as a prolactin producing pituitary adenoma.',
				high: 'Estrogen, cyproterone acetate, some psychiatric drugs, stress or a difficult blood draw, an underactive thyroid, rarely a prolactinoma. Very high or steadily rising values need a closer look.',
				low: 'Rarely meaningful.',
				fem: 'A rise within or slightly above the cis female range is common. Guidelines now favour low cyproterone acetate doses (WPATH SOC 8: 10 mg or less), partly for this reason.',
				masc: 'Usually unchanged or slightly lower on testosterone.',
				note: 'Conversion (Roche assay): 1 ng/ml ≈ 21.2 mIU/l. Other assays use slightly different factors.'
			},
			de: {
				what: 'Hormon der Hirnanhangsdrüse, bekannt für die Milchbildung.',
				why: 'Östradiol und besonders Cyproteronacetat erhöhen Prolaktin. Die Kontrolle erkennt seltene, aber relevante Probleme wie ein prolaktinbildendes Hypophysenadenom.',
				high: 'Östrogen, Cyproteronacetat, manche Psychopharmaka, Stress oder eine schwierige Blutabnahme, Schilddrüsenunterfunktion, selten ein Prolaktinom. Sehr hohe oder stetig steigende Werte sollten abgeklärt werden.',
				low: 'Selten von Bedeutung.',
				fem: 'Ein Anstieg innerhalb oder leicht über dem cis weiblichen Bereich ist häufig. Leitlinien empfehlen inzwischen niedrige Cyproteronacetat-Dosen (WPATH SOC 8: 10 mg oder weniger), auch aus diesem Grund.',
				masc: 'Unter Testosteron meist unverändert oder etwas niedriger.',
				note: 'Umrechnung (Roche-Test): 1 ng/ml ≈ 21,2 mIU/l. Andere Tests nutzen leicht abweichende Faktoren.'
			}
		},
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
		info: {
			en: {
				what: 'Hormone of the second half of the menstrual cycle, made by the corpus luteum after ovulation.',
				why: 'Confirms ovulation in people with a cycle. On feminizing HRT some people add progesterone, and the value shows whether and how much arrives in the blood.',
				high: 'Luteal phase, pregnancy, or progesterone supplementation.',
				low: 'No ovulation, or no progesterone taken.',
				fem: 'There is no agreed target for progesterone in feminizing HRT. Blood levels after oral progesterone swing strongly with the time since the dose, and some immunoassays also pick up its breakdown products.',
				masc: 'Stays low once testosterone stops ovulation.'
			},
			de: {
				what: 'Hormon der zweiten Zyklushälfte, gebildet vom Gelbkörper nach dem Eisprung.',
				why: 'Bestätigt bei Menschen mit Zyklus den Eisprung. Unter feminisierender HRT nehmen manche zusätzlich Progesteron, der Wert zeigt, ob und wie viel davon im Blut ankommt.',
				high: 'Lutealphase, Schwangerschaft oder Progesteron-Einnahme.',
				low: 'Kein Eisprung oder kein Progesteron eingenommen.',
				fem: 'Für Progesteron in feminisierender HRT gibt es kein vereinbartes Ziel. Nach oraler Einnahme schwanken die Blutwerte stark mit dem Abstand zur Dosis, und manche Immunoassays erfassen auch Abbauprodukte.',
				masc: 'Bleibt niedrig, sobald Testosteron den Eisprung verhindert.'
			}
		},
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
		info: {
			en: {
				what: 'Hormone from the small follicles in the ovaries, or from the Sertoli cells in the testes.',
				why: 'In people with ovaries it reflects the egg reserve and is used in fertility counselling.',
				high: 'Many small follicles, for example with polycystic ovaries.',
				low: 'Small egg reserve, which falls with age.',
				masc: 'Stays measurable on testosterone and falls only moderately, so it is used when fertility preservation is discussed.',
				note: 'Strongly age dependent, cis female ranges are not given here for that reason.'
			},
			de: {
				what: 'Hormon aus den kleinen Follikeln der Eierstöcke oder den Sertoli-Zellen der Hoden.',
				why: 'Bei Menschen mit Eierstöcken spiegelt es die Eizellreserve und wird in der Kinderwunschberatung genutzt.',
				high: 'Viele kleine Follikel, zum Beispiel bei polyzystischen Ovarien.',
				low: 'Geringe Eizellreserve, sinkt mit dem Alter.',
				masc: 'Bleibt unter Testosteron messbar und sinkt nur mäßig, deshalb wird es genutzt, wenn Fertilitätserhalt besprochen wird.',
				note: 'Stark altersabhängig, daher sind hier keine cis weiblichen Bereiche angegeben.'
			}
		},
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
		info: {
			en: {
				what: 'Androgen precursor made almost only by the adrenal glands.',
				why: 'Tells adrenal androgens apart from gonadal ones, for example when acne or hair growth persist.',
				high: 'Adrenal overactivity, congenital adrenal hyperplasia, DHEA supplements, rarely an adrenal tumour.',
				low: 'Age, adrenal insufficiency, glucocorticoid medication.',
				fem: 'Not suppressed by estradiol or antiandrogens, so it stays in the cis male range and falls with age like in everyone.',
				masc: 'Not affected much by testosterone.',
				note: 'Falls steadily with age, so only age matched ranges make sense.'
			},
			de: {
				what: 'Androgen-Vorstufe, die fast nur in den Nebennieren gebildet wird.',
				why: 'Unterscheidet Androgene aus den Nebennieren von denen aus den Keimdrüsen, etwa wenn Akne oder Haarwuchs anhalten.',
				high: 'Nebennierenüberfunktion, adrenogenitales Syndrom, DHEA-Präparate, selten ein Nebennierentumor.',
				low: 'Alter, Nebenniereninsuffizienz, Kortison-Medikamente.',
				fem: 'Wird von Östradiol und Antiandrogenen nicht unterdrückt, bleibt daher im cis männlichen Bereich und sinkt wie bei allen mit dem Alter.',
				masc: 'Wird von Testosteron kaum beeinflusst.',
				note: 'Sinkt stetig mit dem Alter, sinnvoll sind nur altersgerechte Bereiche.'
			}
		},
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
		info: {
			en: {
				what: 'The main stress hormone from the adrenal glands.',
				why: 'Screens for adrenal over or underactivity.',
				high: 'Morning peak, stress, illness, oral estrogen (it raises the binding protein), rarely Cushing syndrome.',
				low: 'Evening or night draw, glucocorticoid medication, rarely adrenal insufficiency.',
				fem: 'Oral estradiol raises cortisol binding globulin and with it total cortisol, without more active hormone.',
				note: 'Follows a strong daily rhythm with a peak in the early morning. Only compare draws taken at a similar time of day.'
			},
			de: {
				what: 'Das wichtigste Stresshormon der Nebennieren.',
				why: 'Suchtest auf Über- oder Unterfunktion der Nebennieren.',
				high: 'Morgendliches Maximum, Stress, Krankheit, orales Östrogen (erhöht das Bindungseiweiß), selten ein Cushing-Syndrom.',
				low: 'Abnahme am Abend oder nachts, Kortison-Medikamente, selten Nebenniereninsuffizienz.',
				fem: 'Orales Östradiol erhöht das cortisolbindende Globulin und damit das Gesamtcortisol, ohne mehr wirksames Hormon.',
				note: 'Folgt einem starken Tagesrhythmus mit Maximum am frühen Morgen. Vergleiche nur Abnahmen zu ähnlicher Uhrzeit.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Pituitary signal that drives the thyroid. The most sensitive single test of thyroid function.',
				why: 'Screens for an over or underactive thyroid.',
				high: 'Underactive thyroid, or recovery after illness.',
				low: 'Overactive thyroid, thyroid hormone medication, or a suppressed pituitary.',
				fem: 'Oral estrogen raises the protein that carries thyroid hormone. With a healthy thyroid TSH stays normal, but people already taking levothyroxine may need a dose check.',
				note: 'µIU/ml, µU/ml and mU/l are the same number.'
			},
			de: {
				what: 'Signal der Hirnanhangsdrüse, das die Schilddrüse antreibt. Der empfindlichste Einzeltest der Schilddrüsenfunktion.',
				why: 'Suchtest auf Schilddrüsenüber- oder -unterfunktion.',
				high: 'Schilddrüsenunterfunktion oder Erholung nach einer Erkrankung.',
				low: 'Schilddrüsenüberfunktion, Schilddrüsenhormon-Tabletten oder eine unterdrückte Hirnanhangsdrüse.',
				fem: 'Orales Östrogen erhöht das Transporteiweiß für Schilddrüsenhormon. Bei gesunder Schilddrüse bleibt TSH normal, wer schon Levothyroxin nimmt, sollte die Dosis prüfen lassen.',
				note: 'µIU/ml, µU/ml und mU/l sind dieselbe Zahl.'
			}
		},
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
		info: {
			en: {
				what: 'The unbound, active part of the main thyroid hormone.',
				why: 'Read together with TSH to tell where a thyroid problem sits.',
				high: 'Overactive thyroid or too much thyroid medication.',
				low: 'Underactive thyroid.'
			},
			de: {
				what: 'Der ungebundene, wirksame Anteil des wichtigsten Schilddrüsenhormons.',
				why: 'Wird zusammen mit TSH gelesen, um einzuordnen, wo ein Schilddrüsenproblem liegt.',
				high: 'Schilddrüsenüberfunktion oder zu viel Schilddrüsenhormon.',
				low: 'Schilddrüsenunterfunktion.'
			}
		},
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
		info: {
			en: {
				what: 'The unbound form of the most active thyroid hormone, mostly converted from T4 in the tissues.',
				why: 'Adds information when TSH is low, or when an overactive thyroid is suspected.',
				high: 'Overactive thyroid.',
				low: 'Underactive thyroid, or reduced conversion during illness or fasting.'
			},
			de: {
				what: 'Die ungebundene Form des wirksamsten Schilddrüsenhormons, meist im Gewebe aus T4 gebildet.',
				why: 'Ergänzt die Beurteilung bei niedrigem TSH oder bei Verdacht auf eine Überfunktion.',
				high: 'Schilddrüsenüberfunktion.',
				low: 'Schilddrüsenunterfunktion oder verminderte Umwandlung bei Krankheit oder Fasten.'
			}
		},
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
		info: {
			en: {
				what: 'Antibodies against the enzyme that makes thyroid hormone.',
				why: 'Detects autoimmune thyroid disease, mainly Hashimoto thyroiditis.',
				high: 'Autoimmune thyroiditis, often years before the thyroid function changes. Also found in some healthy people.',
				note: 'Cutoffs depend strongly on the assay, use the lab range.'
			},
			de: {
				what: 'Antikörper gegen das Enzym, das Schilddrüsenhormon bildet.',
				why: 'Zeigt eine autoimmune Schilddrüsenerkrankung an, vor allem Hashimoto-Thyreoiditis.',
				high: 'Autoimmunthyreoiditis, oft Jahre bevor sich die Schilddrüsenfunktion ändert. Auch bei manchen Gesunden.',
				note: 'Grenzwerte hängen stark vom Test ab, nutze den Laborbereich.'
			}
		},
		refs: []
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
