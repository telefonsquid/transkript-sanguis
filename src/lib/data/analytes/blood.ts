import type { Analyte, AnalyteInfo, Lang } from '../types';
import { T, adult, clinical, female, male, transMen, transWomen } from './refs';

const RED_CELLS = {
	fem: T(
		'Testosterone drives red cell production. Once it is suppressed, red cell count, haemoglobin and hematocrit fall into the cis female range, mostly within the first year. A large Dutch cohort recommends judging them against female ranges after one year of HRT.',
		'Testosteron treibt die Bildung roter Blutkörperchen an. Sobald es unterdrückt ist, fallen Erythrozyten, Hämoglobin und Hämatokrit in den cis weiblichen Bereich, meist innerhalb des ersten Jahres. Eine große niederländische Kohorte empfiehlt, sie nach einem Jahr HRT an weiblichen Bereichen zu messen.'
	),
	masc: T(
		'Testosterone drives red cell production, so values rise into the cis male range within the first year. Too many red cells thicken the blood: smoking, long-acting injections, higher age and a high BMI raise that risk.',
		'Testosteron treibt die Bildung roter Blutkörperchen an, die Werte steigen daher im ersten Jahr in den cis männlichen Bereich. Zu viele rote Blutkörperchen machen das Blut dicker: Rauchen, Depotspritzen, höheres Alter und ein hoher BMI erhöhen dieses Risiko.'
	)
};

type BaseInfo = Omit<AnalyteInfo, 'fem' | 'masc'>;

const redCells = (en: BaseInfo, de: BaseInfo): Record<Lang, AnalyteInfo> => ({
	en: { ...en, fem: RED_CELLS.fem.en, masc: RED_CELLS.masc.en },
	de: { ...de, fem: RED_CELLS.fem.de, masc: RED_CELLS.masc.de }
});

const PER_NL = [
	{ unit: 'G/l', factor: 1 },
	{ unit: '10^9/l', factor: 1 },
	{ unit: '/µl', factor: 0.001 },
	{ unit: 'Tsd/µl', factor: 1 },
	{ unit: '10^3/µl', factor: 1 }
];

const CLOT_RISK = {
	en: 'Estrogen, especially taken orally and together with smoking, raises clotting factors made in the liver and with them the risk of thrombosis. Routine clotting tests do not measure that risk.',
	de: 'Östrogen, besonders oral eingenommen und zusammen mit Rauchen, erhöht die in der Leber gebildeten Gerinnungsfaktoren und damit das Thromboserisiko. Übliche Gerinnungstests messen dieses Risiko nicht.'
};

export const blood: Analyte[] = [
	{
		id: 'leukocytes',
		name: T('White blood cells', 'Leukozyten'),
		aliases: ['WBC', 'Leukocytes', 'Leukos', 'Weiße Blutkörperchen'],
		unit: '/nl',
		units: PER_NL,
		decimals: 1,
		group: 'blood-count',
		related: ['neutrophils-abs', 'lymphocytes-abs', 'crp'],
		info: {
			en: {
				what: 'All white blood cells: the immune system’s cells in circulation.',
				why: 'Basic screen for infection, inflammation and bone marrow problems.',
				high: 'Infection, inflammation, physical or emotional stress, smoking, cortisone. Mild short-lived rises just above 10 are common and usually harmless.',
				low: 'Viral infections, some medications, autoimmune or bone marrow conditions.',
				note: '/nl, G/l and 10⁹/l are the same number.'
			},
			de: {
				what: 'Alle weißen Blutkörperchen: die Zellen des Immunsystems im Blut.',
				why: 'Grundlegender Suchtest auf Infektion, Entzündung und Knochenmarkprobleme.',
				high: 'Infektion, Entzündung, körperlicher oder seelischer Stress, Rauchen, Kortison. Leichte, kurze Anstiege knapp über 10 sind häufig und meist harmlos.',
				low: 'Virusinfekte, manche Medikamente, Autoimmun- oder Knochenmarkerkrankungen.',
				note: '/nl, G/l und 10⁹/l sind dieselbe Zahl.'
			}
		},
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
		info: redCells(
			{
				what: 'Number of red blood cells, which carry oxygen.',
				why: 'Together with haemoglobin and hematocrit it shows anaemia or too many red cells.',
				high: 'Testosterone, dehydration, smoking, living at altitude, rarely a bone marrow disorder.',
				low: 'Anaemia from blood loss, iron or vitamin deficiency, chronic disease.',
				note: '/pl, T/l and 10¹²/l are the same number.'
			},
			{
				what: 'Anzahl der roten Blutkörperchen, die Sauerstoff transportieren.',
				why: 'Zeigt zusammen mit Hämoglobin und Hämatokrit eine Blutarmut oder zu viele rote Blutkörperchen.',
				high: 'Testosteron, Flüssigkeitsmangel, Rauchen, Leben in großer Höhe, selten eine Knochenmarkerkrankung.',
				low: 'Blutarmut durch Blutverlust, Eisen- oder Vitaminmangel, chronische Erkrankungen.',
				note: '/pl, T/l und 10¹²/l sind dieselbe Zahl.'
			}
		),
		refs: [female([3.92, 5.13], 'mayo-cbc'), male([4.35, 5.65], 'mayo-cbc')]
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
		info: redCells(
			{
				what: 'The oxygen carrying protein inside red blood cells.',
				why: 'The key number for anaemia. One of the clearest markers of how much testosterone is acting.',
				high: 'Testosterone, dehydration, smoking, lung disease, altitude.',
				low: 'Anaemia: blood loss, iron, B12 or folate deficiency, chronic disease.'
			},
			{
				what: 'Das sauerstofftragende Eiweiß in den roten Blutkörperchen.',
				why: 'Der wichtigste Wert für Blutarmut. Einer der deutlichsten Marker dafür, wie viel Testosteron wirkt.',
				high: 'Testosteron, Flüssigkeitsmangel, Rauchen, Lungenerkrankungen, Höhe.',
				low: 'Blutarmut: Blutverlust, Eisen-, B12- oder Folsäuremangel, chronische Erkrankungen.'
			}
		),
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
		info: redCells(
			{
				what: 'Share of blood volume taken up by red cells.',
				why: 'Moves with haemoglobin. Too high makes blood thicker.',
				high: 'Testosterone, dehydration, smoking. Also rises artificially when red cells swell in a sample that waited too long.',
				low: 'Anaemia, or dilution.'
			},
			{
				what: 'Anteil der roten Blutkörperchen am Blutvolumen.',
				why: 'Bewegt sich mit dem Hämoglobin. Zu hoch macht das Blut dicker.',
				high: 'Testosteron, Flüssigkeitsmangel, Rauchen. Steigt auch künstlich, wenn Zellen in einer zu lange gelagerten Probe anschwellen.',
				low: 'Blutarmut oder Verdünnung.'
			}
		),
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
		info: {
			en: {
				what: 'Average size of a red blood cell (hematocrit ÷ red cell count).',
				why: 'Sorts anaemias by cause.',
				high: 'Vitamin B12 or folate deficiency, alcohol, liver disease, an underactive thyroid, some drugs. Also red cells swelling in a sample that waited too long before analysis.',
				low: 'Iron deficiency or thalassaemia trait.'
			},
			de: {
				what: 'Durchschnittliche Größe eines roten Blutkörperchens (Hämatokrit ÷ Erythrozytenzahl).',
				why: 'Ordnet Blutarmut nach Ursache.',
				high: 'Vitamin-B12- oder Folsäuremangel, Alkohol, Lebererkrankung, Schilddrüsenunterfunktion, manche Medikamente. Auch Zellschwellung in einer zu lange gelagerten Probe.',
				low: 'Eisenmangel oder Thalassämie-Anlage.'
			}
		},
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
		info: {
			en: {
				what: 'Average amount of haemoglobin per red cell (haemoglobin ÷ red cell count).',
				why: 'Like MCV, helps sort anaemias. Unaffected by cells swelling in the tube, which makes it a good cross check.',
				high: 'Large red cells (B12 or folate deficiency).',
				low: 'Iron deficiency.'
			},
			de: {
				what: 'Durchschnittliche Hämoglobinmenge pro rotem Blutkörperchen (Hämoglobin ÷ Erythrozytenzahl).',
				why: 'Hilft wie MCV, Blutarmut einzuordnen. Unbeeinflusst von Zellschwellung im Röhrchen, daher eine gute Gegenprobe.',
				high: 'Große rote Blutkörperchen (B12- oder Folsäuremangel).',
				low: 'Eisenmangel.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Haemoglobin concentration inside the red cells (haemoglobin ÷ hematocrit).',
				why: 'Very stable in healthy people, so an odd value often points at a measurement problem.',
				high: 'Spherocytosis, or a sample issue such as lipaemia or cold agglutinins.',
				low: 'Iron deficiency. Also appears when red cells swell in a stored sample.'
			},
			de: {
				what: 'Hämoglobinkonzentration in den roten Blutkörperchen (Hämoglobin ÷ Hämatokrit).',
				why: 'Bei Gesunden sehr stabil, ein auffälliger Wert deutet daher oft auf ein Messproblem.',
				high: 'Sphärozytose oder ein Probenproblem wie Lipämie oder Kälteagglutinine.',
				low: 'Eisenmangel. Tritt auch auf, wenn Zellen in einer gelagerten Probe anschwellen.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'How much red cells vary in size.',
				why: 'Rises early in iron or vitamin deficiencies, before MCV moves.',
				high: 'Mixed or developing deficiencies, recent blood loss, transfusion.',
				note: 'Depends on the analyser, so values from different labs compare poorly.'
			},
			de: {
				what: 'Wie stark die roten Blutkörperchen in der Größe schwanken.',
				why: 'Steigt früh bei Eisen- oder Vitaminmangel, noch bevor sich MCV ändert.',
				high: 'Gemischte oder beginnende Mangelzustände, kürzlicher Blutverlust, Transfusion.',
				note: 'Hängt vom Messgerät ab, Werte verschiedener Labore sind schlecht vergleichbar.'
			}
		},
		refs: [female([12.2, 16.1], 'mayo-cbc'), male([11.8, 14.5], 'mayo-cbc')]
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
		info: {
			en: {
				what: 'Cell fragments that start blood clotting.',
				why: 'Screens for bleeding tendency and bone marrow problems.',
				high: 'Inflammation, iron deficiency, after bleeding, rarely a bone marrow disorder.',
				low: 'Viral infections, medications, immune destruction, clumping in the tube.',
				fem: 'Platelet count does not measure the clot risk that estrogen adds. ' + CLOT_RISK.en
			},
			de: {
				what: 'Zellbruchstücke, die die Blutgerinnung starten.',
				why: 'Suchtest auf Blutungsneigung und Knochenmarkprobleme.',
				high: 'Entzündung, Eisenmangel, nach Blutungen, selten eine Knochenmarkerkrankung.',
				low: 'Virusinfekte, Medikamente, Abbau durch das Immunsystem, Verklumpung im Röhrchen.',
				fem: 'Die Thrombozytenzahl misst nicht das Gerinnungsrisiko durch Östrogen. ' + CLOT_RISK.de
			}
		},
		refs: [female([157, 371], 'mayo-cbc'), male([135, 317], 'mayo-cbc')]
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
		info: {
			en: { what: 'Average platelet size. Young platelets are larger.', why: 'Helps interpret an abnormal platelet count.' },
			de: { what: 'Durchschnittliche Größe der Blutplättchen. Junge Plättchen sind größer.', why: 'Hilft, eine auffällige Thrombozytenzahl einzuordnen.' }
		},
		refs: []
	},
	{
		id: 'nrbc',
		name: T('Nucleated red cells', 'Normoblasten'),
		aliases: ['NRBC', 'NRBC %'],
		unit: '/100 WBC',
		units: [{ unit: '%', factor: 1 }],
		decimals: 1,
		group: 'blood-count',
		info: {
			en: { what: 'Immature red cells that still have a nucleus. Normally they stay in the bone marrow.', why: 'Any in adult blood points at marrow stress. Zero is normal.' },
			de: { what: 'Unreife rote Blutkörperchen, die noch einen Kern haben. Normalerweise bleiben sie im Knochenmark.', why: 'Jeder Nachweis bei Erwachsenen deutet auf Stress im Knochenmark. Null ist normal.' }
		},
		refs: []
	},
	{
		id: 'nrbc-abs',
		name: T('Nucleated red cells, absolute', 'Normoblasten, absolut'),
		aliases: ['NRBC absolut'],
		unit: '/nl',
		units: PER_NL,
		decimals: 2,
		group: 'blood-count',
		info: {
			en: { what: 'Absolute count of nucleated red cells.', why: 'Zero is normal.' },
			de: { what: 'Absolute Anzahl der Normoblasten.', why: 'Null ist normal.' }
		},
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
		info: {
			en: {
				what: 'How fast blood clots through the external pathway, as a percentage of normal. The German way of reporting prothrombin time.',
				why: 'Liver function, vitamin K status and monitoring of vitamin K antagonists.',
				high: 'Not a concern.',
				low: 'Slower clotting: vitamin K antagonists, vitamin K deficiency, liver disease.',
				fem: CLOT_RISK.en,
				note: 'The lower the Quick value, the higher the INR.'
			},
			de: {
				what: 'Wie schnell das Blut über den äußeren Weg gerinnt, in Prozent der Norm. Die in Deutschland übliche Angabe der Thromboplastinzeit.',
				why: 'Leberfunktion, Vitamin-K-Versorgung und Kontrolle von Vitamin-K-Antagonisten.',
				high: 'Unbedenklich.',
				low: 'Langsamere Gerinnung: Vitamin-K-Antagonisten, Vitamin-K-Mangel, Lebererkrankung.',
				fem: CLOT_RISK.de,
				note: 'Je niedriger der Quick-Wert, desto höher die INR.'
			}
		},
		refs: []
	},
	{
		id: 'inr',
		name: T('INR', 'INR'),
		aliases: ['International normalized ratio', 'PT-INR'],
		unit: 'ratio',
		decimals: 2,
		group: 'coagulation',
		related: ['quick'],
		info: {
			en: {
				what: 'Prothrombin time standardised across labs. 1.0 is normal clotting speed.',
				why: 'The international way to report prothrombin time and to steer vitamin K antagonists.',
				high: 'Slower clotting: vitamin K antagonists, liver disease, vitamin K deficiency.',
				low: 'Not a concern.'
			},
			de: {
				what: 'Laborübergreifend standardisierte Thromboplastinzeit. 1,0 ist normale Gerinnungsgeschwindigkeit.',
				why: 'Internationale Angabe der Thromboplastinzeit und Steuerung von Vitamin-K-Antagonisten.',
				high: 'Langsamere Gerinnung: Vitamin-K-Antagonisten, Lebererkrankung, Vitamin-K-Mangel.',
				low: 'Unbedenklich.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Clotting time through the internal pathway.',
				why: 'Screens for bleeding disorders and monitors heparin.',
				high: 'Heparin, lupus anticoagulant, clotting factor deficiencies.',
				low: 'Usually a sampling effect, not meaningful alone.'
			},
			de: {
				what: 'Gerinnungszeit über den inneren Weg.',
				why: 'Suchtest auf Blutgerinnungsstörungen und Kontrolle von Heparin.',
				high: 'Heparin, Lupus-Antikoagulans, Mangel an Gerinnungsfaktoren.',
				low: 'Meist ein Abnahmeeffekt, allein nicht aussagekräftig.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'The clotting protein that becomes the fibrin mesh of a clot.',
				why: 'Clotting capacity. Also rises with inflammation.',
				high: 'Inflammation, pregnancy, smoking, estrogen.',
				low: 'Consumption in severe clotting activation, liver disease, inherited deficiency.'
			},
			de: {
				what: 'Das Gerinnungseiweiß, aus dem das Fibrinnetz eines Gerinnsels entsteht.',
				why: 'Gerinnungsfähigkeit. Steigt auch bei Entzündungen.',
				high: 'Entzündung, Schwangerschaft, Rauchen, Östrogen.',
				low: 'Verbrauch bei starker Gerinnungsaktivierung, Lebererkrankung, angeborener Mangel.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Breakdown product of fibrin, released when a clot is being dissolved.',
				why: 'A normal value makes a fresh thrombosis or pulmonary embolism unlikely when the clinical suspicion is low.',
				high: 'Thrombosis or embolism, but also inflammation, surgery, pregnancy, cancer and older age. A high value alone proves nothing.',
				low: 'Not a concern.',
				fem: CLOT_RISK.en,
				note: 'Some labs report D-dimer units (DDU), which are about half of fibrinogen equivalent units (FEU).'
			},
			de: {
				what: 'Abbauprodukt von Fibrin, entsteht beim Auflösen eines Gerinnsels.',
				why: 'Ein normaler Wert macht eine frische Thrombose oder Lungenembolie bei geringem Verdacht unwahrscheinlich.',
				high: 'Thrombose oder Embolie, aber auch Entzündung, Operationen, Schwangerschaft, Krebs und höheres Alter. Ein hoher Wert allein beweist nichts.',
				low: 'Unbedenklich.',
				fem: CLOT_RISK.de,
				note: 'Manche Labore geben D-Dimer-Einheiten (DDU) an, die etwa halb so groß sind wie Fibrinogen-Äquivalent-Einheiten (FEU).'
			}
		},
		refs: [
			clinical('esc', T('Exclusion cutoff (ESC)', 'Ausschlussgrenze (ESC)'), [undefined, 0.5], 'esc-pe2019', {
				note: T('Above age 50 an age adjusted cutoff of age × 0.01 mg/l is used.', 'Ab 50 Jahren wird eine altersangepasste Grenze von Alter × 0,01 mg/l genutzt.')
			})
		]
	}
];

function differential(): Analyte[] {
	const cells = [
		{
			id: 'neutrophils',
			name: T('Neutrophils', 'Neutrophile'),
			aliases: ['Neutro', 'Segmentkernige', 'Neutrophile Granulozyten'],
			abs: [1.56, 6.45] as [number, number],
			what: T('The most common white cells, first responders against bacteria.', 'Die häufigsten weißen Blutkörperchen, erste Abwehr gegen Bakterien.'),
			high: T(
				'Bacterial infection, inflammation, stress, cortisone, smoking. High neutrophils with low lymphocytes and eosinophils together is the typical stress hormone pattern.',
				'Bakterielle Infektion, Entzündung, Stress, Kortison, Rauchen. Hohe Neutrophile mit niedrigen Lymphozyten und Eosinophilen ist das typische Stresshormon-Muster.'
			),
			low: T('Viral infections, some medications, benign ethnic neutropenia.', 'Virusinfekte, manche Medikamente, gutartige ethnische Neutropenie.')
		},
		{
			id: 'lymphocytes',
			name: T('Lymphocytes', 'Lymphozyten'),
			aliases: ['Lympho', 'Lymphos'],
			abs: [0.95, 3.07] as [number, number],
			what: T('T, B and NK cells, the adaptive immune system.', 'T-, B- und NK-Zellen, das erworbene Immunsystem.'),
			high: T('Viral infections, rarely lymphatic disease.', 'Virusinfekte, selten Erkrankungen des lymphatischen Systems.'),
			low: T('Acute stress, cortisone, some infections.', 'Akuter Stress, Kortison, manche Infektionen.')
		},
		{
			id: 'monocytes',
			name: T('Monocytes', 'Monozyten'),
			aliases: ['Mono', 'Monos'],
			abs: [0.26, 0.81] as [number, number],
			what: T('Large white cells that become macrophages in tissue.', 'Große weiße Blutkörperchen, die im Gewebe zu Makrophagen werden.'),
			high: T('Chronic infection or inflammation, recovery phase after infection.', 'Chronische Infektion oder Entzündung, Erholungsphase nach einer Infektion.'),
			low: T('Rarely meaningful alone.', 'Allein selten von Bedeutung.')
		},
		{
			id: 'eosinophils',
			name: T('Eosinophils', 'Eosinophile'),
			aliases: ['Eos', 'Eosinophile Granulozyten'],
			abs: [0.03, 0.48] as [number, number],
			what: T('White cells involved in allergy and parasite defence.', 'Weiße Blutkörperchen der Allergie- und Parasitenabwehr.'),
			high: T('Allergies, asthma, eczema, parasites, some drugs.', 'Allergien, Asthma, Ekzeme, Parasiten, manche Medikamente.'),
			low: T('Acute stress or cortisone. Usually meaningless alone.', 'Akuter Stress oder Kortison. Allein meist bedeutungslos.')
		},
		{
			id: 'basophils',
			name: T('Basophils', 'Basophile'),
			aliases: ['Baso', 'Basophile Granulozyten'],
			abs: [0.01, 0.08] as [number, number],
			what: T('Rare white cells that release histamine.', 'Seltene weiße Blutkörperchen, die Histamin freisetzen.'),
			high: T('Allergic reactions, rarely bone marrow disorders.', 'Allergische Reaktionen, selten Knochenmarkerkrankungen.'),
			low: T('Not meaningful.', 'Ohne Bedeutung.')
		},
		{
			id: 'ig',
			name: T('Immature granulocytes', 'Unreife Granulozyten'),
			aliases: ['IG', 'Immature Granulozyten'],
			abs: undefined,
			what: T('Young neutrophil precursors that normally stay in the bone marrow.', 'Junge Vorstufen der Neutrophilen, die normalerweise im Knochenmark bleiben.'),
			high: T('Infection, inflammation, pregnancy, marrow stimulation.', 'Infektion, Entzündung, Schwangerschaft, Anregung des Knochenmarks.'),
			low: T('Not meaningful.', 'Ohne Bedeutung.')
		}
	];

	return cells.flatMap((c): Analyte[] => [
		{
			id: `${c.id}-pct`,
			name: T(`${c.name.en} %`, `${c.name.de} %`),
			aliases: c.aliases.map((a) => `${a} %`),
			unit: '%',
			decimals: 1,
			group: 'differential',
			related: [`${c.id}-abs`, 'leukocytes'],
			info: {
				en: {
					what: `${c.what.en} Share of all white cells.`,
					why: 'Part of the differential blood count, which breaks the white cell count down by cell type.',
					high: c.high.en,
					low: c.low.en
				},
				de: {
					what: `${c.what.de} Anteil an allen weißen Blutkörperchen.`,
					why: 'Teil des Differentialblutbilds, das die Leukozyten nach Zelltyp aufschlüsselt.',
					high: c.high.de,
					low: c.low.de
				}
			},
			refs: []
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
			info: {
				en: {
					what: `${c.what.en} Absolute count per nanolitre.`,
					why: 'The absolute count matters more than the percentage, because a percentage moves whenever another cell type changes.',
					high: c.high.en,
					low: c.low.en
				},
				de: {
					what: `${c.what.de} Absolute Anzahl pro Nanoliter.`,
					why: 'Die absolute Zahl sagt mehr als der Prozentwert, weil sich Prozente verschieben, sobald sich ein anderer Zelltyp ändert.',
					high: c.high.de,
					low: c.low.de
				}
			},
			refs: c.abs ? [adult(c.abs, 'mayo-cbc')] : []
		}
	]);
}
