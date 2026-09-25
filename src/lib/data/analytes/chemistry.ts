import type { Analyte, Reference, Text } from '../types';
import { T, clinical, female, male, transMen, transWomen } from './refs';

const KDIGO: Reference[] = [
	clinical('kdigo-g1', T('Normal (KDIGO G1)', 'Normal (KDIGO G1)'), [90, undefined], 'kdigo2012'),
	clinical('kdigo-g2', T('Mildly decreased (KDIGO G2)', 'Leicht vermindert (KDIGO G2)'), [60, 90], 'kdigo2012', {
		note: T('Only counts as kidney disease together with other signs of kidney damage.', 'Gilt nur zusammen mit anderen Zeichen einer Nierenschädigung als Nierenerkrankung.')
	})
];

const EGFR_HRT = T(
	'The equation needs a sex. On HRT creatinine sits between the cis male and cis female ranges, so the truth lies somewhere between the two computed curves. Watch the trend rather than a single number. Cystatin C depends much less on muscle mass and is often suggested as the more reliable check on HRT.',
	'Die Formel braucht ein Geschlecht. Unter HRT liegt Kreatinin zwischen dem cis männlichen und dem cis weiblichen Bereich, der wahre Wert liegt also irgendwo zwischen den beiden berechneten Kurven. Achte auf den Verlauf statt auf einen Einzelwert. Cystatin C hängt viel weniger von der Muskelmasse ab und gilt unter HRT oft als verlässlichere Kontrolle.'
);

const LIVER = T(
	'Oral estradiol, cyproterone acetate and bicalutamide are processed by the liver, so liver values are checked on feminizing HRT. Liver injury from cyproterone acetate is mostly reported at doses far above the ones used for HRT.',
	'Orales Östradiol, Cyproteronacetat und Bicalutamid werden über die Leber verarbeitet, daher werden Leberwerte unter feminisierender HRT kontrolliert. Leberschäden durch Cyproteronacetat sind vor allem bei Dosen weit über denen der HRT beschrieben.'
);

const LIVER_MASC = T(
	'Liver enzymes shift toward the cis male range on testosterone. Clear rises are uncommon with injections or gels.',
	'Leberenzyme verschieben sich unter Testosteron Richtung cis männlicher Bereich. Deutliche Anstiege sind bei Spritzen oder Gelen selten.'
);

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

export const chemistry: Analyte[] = [
	{
		id: 'sodium',
		name: T('Sodium', 'Natrium'),
		aliases: ['Na', 'Na+'],
		unit: 'mmol/l',
		units: [{ unit: 'mEq/l', factor: 1 }],
		decimals: 0,
		group: 'electrolytes',
		related: ['potassium', 'chloride'],
		info: {
			en: {
				what: 'The main salt in blood and the fluid around cells.',
				why: 'Reflects water balance more than salt intake.',
				high: 'Too little water: dehydration, heavy sweating.',
				low: 'Too much water relative to salt: drinking a lot, some medications, hormonal causes.'
			},
			de: {
				what: 'Das wichtigste Salz im Blut und in der Flüssigkeit um die Zellen.',
				why: 'Spiegelt eher den Wasserhaushalt als die Salzaufnahme.',
				high: 'Zu wenig Wasser: Flüssigkeitsmangel, starkes Schwitzen.',
				low: 'Zu viel Wasser im Verhältnis zu Salz: sehr viel Trinken, manche Medikamente, hormonelle Ursachen.'
			}
		},
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
		info: {
			en: {
				what: 'The main salt inside cells. Small shifts in the blood matter for heart and muscle.',
				why: 'Kept in a tight range by the kidneys.',
				high: 'Kidney problems, some drugs (spironolactone, ACE inhibitors), or falsely high from a squeezed or delayed sample.',
				low: 'Vomiting, diarrhoea, diuretics.',
				fem: 'Spironolactone, a common antiandrogen, can raise potassium, so guidelines ask for regular checks while taking it. Cyproterone acetate and bicalutamide do not.'
			},
			de: {
				what: 'Das wichtigste Salz in den Zellen. Kleine Verschiebungen im Blut wirken auf Herz und Muskeln.',
				why: 'Wird von den Nieren in einem engen Bereich gehalten.',
				high: 'Nierenprobleme, manche Medikamente (Spironolacton, ACE-Hemmer) oder falsch hoch durch gestaute oder zu lange gelagerte Proben.',
				low: 'Erbrechen, Durchfall, Entwässerungsmittel.',
				fem: 'Spironolacton, ein verbreitetes Antiandrogen, kann Kalium erhöhen, daher fordern Leitlinien regelmäßige Kontrollen während der Einnahme. Cyproteronacetat und Bicalutamid tun das nicht.'
			}
		},
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
		info: {
			en: {
				what: 'The main negatively charged salt in blood, moves with sodium.',
				why: 'Helps read acid base and water balance.',
				high: 'Dehydration, some kidney conditions, large amounts of saline.',
				low: 'Vomiting, diuretics.'
			},
			de: {
				what: 'Das wichtigste negativ geladene Salz im Blut, bewegt sich mit Natrium.',
				why: 'Hilft, Säure-Basen- und Wasserhaushalt einzuordnen.',
				high: 'Flüssigkeitsmangel, manche Nierenerkrankungen, große Mengen Kochsalzlösung.',
				low: 'Erbrechen, Entwässerungsmittel.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Total calcium, about half of it bound to albumin.',
				why: 'Bone metabolism, parathyroid and vitamin D status.',
				high: 'Overactive parathyroid, too much vitamin D, dehydration.',
				low: 'Vitamin D deficiency, low albumin, underactive parathyroid.'
			},
			de: {
				what: 'Gesamtcalcium, etwa die Hälfte davon an Albumin gebunden.',
				why: 'Knochenstoffwechsel, Nebenschilddrüse und Vitamin-D-Versorgung.',
				high: 'Nebenschilddrüsenüberfunktion, zu viel Vitamin D, Flüssigkeitsmangel.',
				low: 'Vitamin-D-Mangel, niedriges Albumin, Nebenschilddrüsenunterfunktion.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Mineral needed for muscles, nerves and hundreds of enzymes.',
				why: 'Checked with cramps, heart rhythm problems or low potassium and calcium.',
				high: 'Reduced kidney function, magnesium supplements.',
				low: 'Diarrhoea, alcohol, diuretics, proton pump inhibitors.',
				note: 'Blood holds only 1 % of the body’s magnesium, a normal value does not rule out a deficit.'
			},
			de: {
				what: 'Mineral für Muskeln, Nerven und hunderte Enzyme.',
				why: 'Wird bei Krämpfen, Herzrhythmusstörungen oder niedrigem Kalium und Calcium geprüft.',
				high: 'Verminderte Nierenfunktion, Magnesiumpräparate.',
				low: 'Durchfall, Alkohol, Entwässerungsmittel, Protonenpumpenhemmer.',
				note: 'Im Blut ist nur 1 % des Körpermagnesiums, ein normaler Wert schließt einen Mangel nicht aus.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Mineral stored in bone together with calcium.',
				why: 'Bone metabolism, kidney function and parathyroid status.',
				high: 'Reduced kidney function, underactive parathyroid.',
				low: 'Overactive parathyroid, vitamin D deficiency, malnutrition.'
			},
			de: {
				what: 'Mineral, das zusammen mit Calcium im Knochen gespeichert wird.',
				why: 'Knochenstoffwechsel, Nierenfunktion und Nebenschilddrüse.',
				high: 'Verminderte Nierenfunktion, Nebenschilddrüsenunterfunktion.',
				low: 'Nebenschilddrüsenüberfunktion, Vitamin-D-Mangel, Mangelernährung.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'A waste product of muscle, cleared by the kidneys.',
				why: 'Standard marker of kidney function. Because it depends on muscle mass it also mirrors body composition.',
				high: 'Reduced kidney filtration, dehydration, lots of muscle, creatine supplements, a big meat meal before the draw.',
				low: 'Low muscle mass. Usually harmless.',
				fem: 'Muscle mass drops on feminizing HRT, so creatinine drifts down, but trans women after 12 months still sit around the cis male range. A value above the cis female range is not automatically a kidney problem.',
				masc: 'Rises with muscle mass on testosterone and reaches the cis male range. A value above the cis female range is expected.'
			},
			de: {
				what: 'Ein Abbauprodukt der Muskeln, wird über die Nieren ausgeschieden.',
				why: 'Standardmarker der Nierenfunktion. Da er von der Muskelmasse abhängt, spiegelt er auch die Körperzusammensetzung.',
				high: 'Verminderte Nierenfiltration, Flüssigkeitsmangel, viel Muskulatur, Kreatin-Präparate, eine große Fleischmahlzeit vor der Abnahme.',
				low: 'Geringe Muskelmasse. Meist harmlos.',
				fem: 'Unter feminisierender HRT sinkt die Muskelmasse und damit langsam das Kreatinin, trans Frauen liegen nach 12 Monaten aber noch etwa im cis männlichen Bereich. Ein Wert über dem cis weiblichen Bereich ist nicht automatisch ein Nierenproblem.',
				masc: 'Steigt unter Testosteron mit der Muskelmasse und erreicht den cis männlichen Bereich. Ein Wert über dem cis weiblichen Bereich ist zu erwarten.'
			}
		},
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
		info: {
			en: {
				what: 'Estimated glomerular filtration rate: how much blood the kidneys filter per minute, calculated by the lab from creatinine, age and the sex on file.',
				why: 'The usual way to stage kidney function.',
				high: 'Not a concern. Many labs cap the printed value at ">90".',
				low: 'Below 60 for three months or longer defines chronic kidney disease.',
				fem: `${EGFR_HRT.en} The printed value jumps whenever the lab changes the sex on file, which is not a kidney change.`,
				masc: `${EGFR_HRT.en} The printed value jumps whenever the lab changes the sex on file, which is not a kidney change.`
			},
			de: {
				what: 'Geschätzte glomeruläre Filtrationsrate: wie viel Blut die Nieren pro Minute filtern, vom Labor aus Kreatinin, Alter und hinterlegtem Geschlecht berechnet.',
				why: 'Der übliche Weg, die Nierenfunktion einzustufen.',
				high: 'Unbedenklich. Viele Labore geben höchstens ">90" an.',
				low: 'Unter 60 über drei Monate oder länger definiert eine chronische Nierenerkrankung.',
				fem: `${EGFR_HRT.de} Der angegebene Wert springt, sobald das Labor das hinterlegte Geschlecht ändert, ohne dass sich an der Niere etwas ändert.`,
				masc: `${EGFR_HRT.de} Der angegebene Wert springt, sobald das Labor das hinterlegte Geschlecht ändert, ohne dass sich an der Niere etwas ändert.`
			}
		},
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
		info: {
			en: {
				what: 'eGFR recomputed from every creatinine value with the female CKD-EPI 2009 equation, the one most German labs use.',
				why: 'Makes all draws comparable, whatever sex the lab had on file.',
				fem: EGFR_HRT.en,
				masc: EGFR_HRT.en
			},
			de: {
				what: 'eGFR aus jedem Kreatininwert neu berechnet, mit der weiblichen CKD-EPI-2009-Formel, die die meisten deutschen Labore nutzen.',
				why: 'Macht alle Abnahmen vergleichbar, egal welches Geschlecht das Labor hinterlegt hatte.',
				fem: EGFR_HRT.de,
				masc: EGFR_HRT.de
			}
		},
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
		info: {
			en: {
				what: 'eGFR recomputed from every creatinine value with the male CKD-EPI 2009 equation.',
				why: 'Makes all draws comparable, whatever sex the lab had on file.',
				fem: EGFR_HRT.en,
				masc: EGFR_HRT.en
			},
			de: {
				what: 'eGFR aus jedem Kreatininwert neu berechnet, mit der männlichen CKD-EPI-2009-Formel.',
				why: 'Macht alle Abnahmen vergleichbar, egal welches Geschlecht das Labor hinterlegt hatte.',
				fem: EGFR_HRT.de,
				masc: EGFR_HRT.de
			}
		},
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
		info: {
			en: {
				what: 'A small protein made by all cells at a steady rate and cleared by the kidneys.',
				why: 'Kidney marker that depends far less on muscle mass than creatinine.',
				high: 'Reduced kidney filtration. Also thyroid overactivity, high dose cortisone, inflammation.',
				low: 'Not a concern.',
				fem: 'Useful when creatinine is hard to read because muscle mass is changing.',
				masc: 'Useful when creatinine is hard to read because muscle mass is changing.'
			},
			de: {
				what: 'Ein kleines Eiweiß, das alle Zellen gleichmäßig bilden und die Nieren ausscheiden.',
				why: 'Nierenmarker, der viel weniger von der Muskelmasse abhängt als Kreatinin.',
				high: 'Verminderte Nierenfiltration. Außerdem Schilddrüsenüberfunktion, hochdosiertes Kortison, Entzündung.',
				low: 'Unbedenklich.',
				fem: 'Hilfreich, wenn Kreatinin schwer zu deuten ist, weil sich die Muskelmasse ändert.',
				masc: 'Hilfreich, wenn Kreatinin schwer zu deuten ist, weil sich die Muskelmasse ändert.'
			}
		},
		refs: []
	},
	{
		id: 'egfr-cys-f',
		name: T('eGFR from cystatin C, female', 'eGFR aus Cystatin C, weiblich'),
		unit: 'ml/min/1.73 m²',
		decimals: 1,
		group: 'kidney',
		derived: T('CKD-EPI 2012 cystatin C equation, female factor 0.932.', 'CKD-EPI-2012-Formel für Cystatin C, weiblicher Faktor 0,932.'),
		related: ['egfr-cys-m', 'cystatin-c', 'egfr-f'],
		info: {
			en: {
				what: 'eGFR computed from cystatin C and age. The sex term changes the result by only about 7 %.',
				why: 'A kidney estimate that is barely affected by muscle mass.'
			},
			de: {
				what: 'eGFR aus Cystatin C und Alter berechnet. Der Geschlechtsterm ändert das Ergebnis nur um etwa 7 %.',
				why: 'Eine Nierenschätzung, die kaum von der Muskelmasse beeinflusst wird.'
			}
		},
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
		info: {
			en: {
				what: 'eGFR computed from cystatin C and age with the male coefficient.',
				why: 'A kidney estimate that is barely affected by muscle mass.'
			},
			de: {
				what: 'eGFR aus Cystatin C und Alter mit dem männlichen Koeffizienten.',
				why: 'Eine Nierenschätzung, die kaum von der Muskelmasse beeinflusst wird.'
			}
		},
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
		info: {
			en: {
				what: 'Waste product of protein breakdown, cleared by the kidneys.',
				why: 'Kidney function and hydration, read together with creatinine.',
				high: 'Dehydration, high protein intake, reduced kidney function, bleeding in the gut.',
				low: 'Low protein intake, liver disease, lots of fluids.',
				note: 'Not the same as urea nitrogen (BUN): urea = BUN × 2.14.'
			},
			de: {
				what: 'Abbauprodukt von Eiweiß, wird über die Nieren ausgeschieden.',
				why: 'Nierenfunktion und Flüssigkeitshaushalt, zusammen mit Kreatinin gelesen.',
				high: 'Flüssigkeitsmangel, viel Eiweiß in der Nahrung, verminderte Nierenfunktion, Blutung im Magen-Darm-Trakt.',
				low: 'Wenig Eiweiß in der Nahrung, Lebererkrankung, viel Flüssigkeit.',
				note: 'Nicht dasselbe wie Harnstoff-Stickstoff (BUN): Harnstoff = BUN × 2,14.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'End product of purine breakdown, from the body’s own cells and from food such as meat, beer and fructose.',
				why: 'High levels cause gout and kidney stones.',
				high: 'Purine rich diet, alcohol, fructose, dehydration, reduced kidney function, some diuretics.',
				low: 'Rarely meaningful.',
				fem: 'Estrogen helps the kidneys excrete uric acid, one reason cis women have lower levels. It tends to fall on HRT.',
				masc: 'Tends to rise toward the cis male range on testosterone.'
			},
			de: {
				what: 'Endprodukt des Purinabbaus, aus körpereigenen Zellen und aus Nahrung wie Fleisch, Bier und Fruchtzucker.',
				why: 'Hohe Werte verursachen Gicht und Nierensteine.',
				high: 'Purinreiche Ernährung, Alkohol, Fruchtzucker, Flüssigkeitsmangel, verminderte Nierenfunktion, manche Entwässerungsmittel.',
				low: 'Selten von Bedeutung.',
				fem: 'Östrogen hilft den Nieren, Harnsäure auszuscheiden, ein Grund für die niedrigeren Werte bei cis Frauen. Sinkt unter HRT meist.',
				masc: 'Steigt unter Testosteron meist Richtung cis männlicher Bereich.'
			}
		},
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
		info: {
			en: {
				what: 'Enzyme found mainly inside liver cells. Leaks into the blood when they are damaged.',
				why: 'The most liver specific routine marker.',
				high: 'Fatty liver, alcohol, medications, viral hepatitis, hard exercise in the days before the draw.',
				low: 'Not meaningful.',
				fem: LIVER.en,
				masc: LIVER_MASC.en
			},
			de: {
				what: 'Enzym, das vor allem in Leberzellen vorkommt. Gelangt ins Blut, wenn diese geschädigt werden.',
				why: 'Der leberspezifischste Routinewert.',
				high: 'Fettleber, Alkohol, Medikamente, Virushepatitis, harter Sport in den Tagen vor der Abnahme.',
				low: 'Ohne Bedeutung.',
				fem: LIVER.de,
				masc: LIVER_MASC.de
			}
		},
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
		info: {
			en: {
				what: 'Enzyme in liver, heart and skeletal muscle, so less liver specific than ALT.',
				why: 'Read together with ALT. AST clearly above ALT points more toward muscle or alcohol.',
				high: 'Liver damage, muscle strain or injury, alcohol.',
				low: 'Not meaningful.',
				fem: LIVER.en,
				masc: LIVER_MASC.en
			},
			de: {
				what: 'Enzym in Leber, Herz und Skelettmuskel, daher weniger leberspezifisch als ALT.',
				why: 'Wird zusammen mit ALT gelesen. AST deutlich über ALT spricht eher für Muskel oder Alkohol.',
				high: 'Leberschaden, Muskelbelastung oder -verletzung, Alkohol.',
				low: 'Ohne Bedeutung.',
				fem: LIVER.de,
				masc: LIVER_MASC.de
			}
		},
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
		info: {
			en: {
				what: 'Enzyme of the bile ducts and liver.',
				why: 'Very sensitive to alcohol and to problems with bile flow.',
				high: 'Alcohol, fatty liver, bile duct problems, enzyme inducing drugs.',
				low: 'Not meaningful.',
				fem: LIVER.en,
				masc: LIVER_MASC.en
			},
			de: {
				what: 'Enzym der Gallenwege und der Leber.',
				why: 'Sehr empfindlich für Alkohol und Störungen des Galleabflusses.',
				high: 'Alkohol, Fettleber, Gallenwegsprobleme, enzyminduzierende Medikamente.',
				low: 'Ohne Bedeutung.',
				fem: LIVER.de,
				masc: LIVER_MASC.de
			}
		},
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
		info: {
			en: {
				what: 'Enzyme from bone and bile ducts.',
				why: 'Bile flow and bone turnover.',
				high: 'Bone growth or remodelling, bile duct problems, vitamin D deficiency.',
				low: 'Rarely meaningful.',
				fem: 'Estrogen slows bone turnover, so ALP often drifts down on HRT.',
				masc: 'Tends to rise slightly toward the cis male range.'
			},
			de: {
				what: 'Enzym aus Knochen und Gallenwegen.',
				why: 'Galleabfluss und Knochenumbau.',
				high: 'Knochenwachstum oder -umbau, Gallenwegsprobleme, Vitamin-D-Mangel.',
				low: 'Selten von Bedeutung.',
				fem: 'Östrogen verlangsamt den Knochenumbau, die AP sinkt unter HRT daher oft.',
				masc: 'Steigt meist leicht Richtung cis männlicher Bereich.'
			}
		},
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
		info: {
			en: {
				what: 'Yellow breakdown product of haemoglobin, cleared by the liver.',
				why: 'Liver function and red cell breakdown.',
				high: 'Gilbert syndrome (harmless, common), fasting, liver or bile duct problems, red cell breakdown.',
				low: 'Not meaningful.'
			},
			de: {
				what: 'Gelbes Abbauprodukt des Hämoglobins, wird über die Leber ausgeschieden.',
				why: 'Leberfunktion und Abbau roter Blutkörperchen.',
				high: 'Gilbert-Syndrom (harmlos, häufig), Fasten, Leber- oder Gallenwegsprobleme, Abbau roter Blutkörperchen.',
				low: 'Ohne Bedeutung.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'The most abundant blood protein, made by the liver. Carries hormones, calcium and drugs.',
				why: 'Liver synthesis and nutrition. Also used to calculate free testosterone.',
				high: 'Dehydration.',
				low: 'Inflammation, liver disease, protein loss through kidneys or gut, malnutrition.'
			},
			de: {
				what: 'Das häufigste Bluteiweiß, gebildet in der Leber. Transportiert Hormone, Calcium und Medikamente.',
				why: 'Syntheseleistung der Leber und Ernährungszustand. Wird auch zur Berechnung des freien Testosterons genutzt.',
				high: 'Flüssigkeitsmangel.',
				low: 'Entzündung, Lebererkrankung, Eiweißverlust über Nieren oder Darm, Mangelernährung.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'All proteins in serum, mostly albumin and antibodies.',
				why: 'Nutrition, liver synthesis, immune proteins.',
				high: 'Dehydration, chronic inflammation, rarely abnormal antibody production.',
				low: 'Malnutrition, liver disease, protein loss through kidneys or gut.'
			},
			de: {
				what: 'Alle Eiweiße im Serum, vor allem Albumin und Antikörper.',
				why: 'Ernährung, Syntheseleistung der Leber, Immuneiweiße.',
				high: 'Flüssigkeitsmangel, chronische Entzündung, selten eine krankhafte Antikörperbildung.',
				low: 'Mangelernährung, Lebererkrankung, Eiweißverlust über Nieren oder Darm.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Starch digesting enzyme from the pancreas and salivary glands.',
				why: 'Screens for pancreatitis.',
				high: 'Pancreatitis, salivary gland problems, reduced kidney clearance.',
				low: 'Rarely meaningful.'
			},
			de: {
				what: 'Stärkespaltendes Enzym aus Bauchspeicheldrüse und Speicheldrüsen.',
				why: 'Suchtest auf Bauchspeicheldrüsenentzündung.',
				high: 'Bauchspeicheldrüsenentzündung, Speicheldrüsenprobleme, verminderte Ausscheidung über die Niere.',
				low: 'Selten von Bedeutung.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Fat digesting enzyme, almost only from the pancreas.',
				why: 'More pancreas specific than amylase.',
				high: 'Pancreatitis (usually above three times the upper limit), reduced kidney clearance.',
				low: 'Not meaningful.'
			},
			de: {
				what: 'Fettspaltendes Enzym, fast nur aus der Bauchspeicheldrüse.',
				why: 'Spezifischer für die Bauchspeicheldrüse als Amylase.',
				high: 'Bauchspeicheldrüsenentzündung (meist über dem Dreifachen der Obergrenze), verminderte Ausscheidung über die Niere.',
				low: 'Ohne Bedeutung.'
			}
		},
		refs: []
	}
];
