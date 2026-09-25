import type { Analyte } from '../types';
import { T, adult, clinical, female, male, transWomen } from './refs';

export const nutrients: Analyte[] = [
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
		info: {
			en: {
				what: 'Iron circulating in serum at the moment of the draw.',
				why: 'Part of an iron work-up, together with ferritin and transferrin.',
				high: 'Iron supplements or a recent iron rich meal, iron overload.',
				low: 'Iron deficiency, inflammation, time of day.',
				note: 'Swings a lot over the day. Ferritin and transferrin saturation say much more about iron stores.'
			},
			de: {
				what: 'Im Serum zirkulierendes Eisen zum Zeitpunkt der Abnahme.',
				why: 'Teil der Eisendiagnostik, zusammen mit Ferritin und Transferrin.',
				high: 'Eisenpräparate oder eine kürzliche eisenreiche Mahlzeit, Eisenüberladung.',
				low: 'Eisenmangel, Entzündung, Tageszeit.',
				note: 'Schwankt stark über den Tag. Ferritin und Transferrinsättigung sagen viel mehr über die Eisenspeicher.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'The iron storage protein. Its blood level mirrors the body’s iron stores.',
				why: 'The best single test for iron deficiency.',
				high: 'Inflammation or infection (ferritin rises as an acute phase protein), fatty liver, alcohol, iron overload.',
				low: 'Empty iron stores, even before haemoglobin falls.',
				fem: 'Without testosterone driving red cell production, iron needs fall and ferritin tends to rise over time.',
				masc: 'More red cells use more iron and periods usually stop. Ferritin often drops at first.',
				note: 'During inflammation a normal ferritin can hide an iron deficiency.'
			},
			de: {
				what: 'Das Eisenspeichereiweiß. Sein Blutspiegel spiegelt die Eisenvorräte des Körpers.',
				why: 'Der beste Einzeltest auf Eisenmangel.',
				high: 'Entzündung oder Infektion (Ferritin steigt als Akute-Phase-Eiweiß), Fettleber, Alkohol, Eisenüberladung.',
				low: 'Leere Eisenspeicher, noch bevor das Hämoglobin sinkt.',
				fem: 'Ohne Testosteron als Antrieb der Blutbildung sinkt der Eisenbedarf, Ferritin steigt mit der Zeit meist.',
				masc: 'Mehr rote Blutkörperchen verbrauchen mehr Eisen, die Periode bleibt meist aus. Ferritin sinkt anfangs oft.',
				note: 'Bei Entzündung kann ein normales Ferritin einen Eisenmangel verdecken.'
			}
		},
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
		info: {
			en: {
				what: 'The protein that carries iron in the blood.',
				why: 'Needed to compute transferrin saturation.',
				high: 'Iron deficiency, pregnancy, oral estrogen.',
				low: 'Inflammation, liver disease, iron overload, protein loss.',
				fem: 'Oral estrogen raises transferrin, which can make the saturation look lower.'
			},
			de: {
				what: 'Das Eiweiß, das Eisen im Blut transportiert.',
				why: 'Nötig zur Berechnung der Transferrinsättigung.',
				high: 'Eisenmangel, Schwangerschaft, orales Östrogen.',
				low: 'Entzündung, Lebererkrankung, Eisenüberladung, Eiweißverlust.',
				fem: 'Orales Östrogen erhöht Transferrin, die Sättigung kann dadurch niedriger wirken.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'How much of the transferrin carrying capacity is filled with iron.',
				why: 'Shows iron available for red cell production, less affected by inflammation than ferritin.',
				high: 'Iron overload, for example hereditary haemochromatosis, or recent iron intake.',
				low: 'Iron deficiency or iron locked away by inflammation.'
			},
			de: {
				what: 'Wie viel der Transportkapazität des Transferrins mit Eisen belegt ist.',
				why: 'Zeigt das für die Blutbildung verfügbare Eisen, weniger von Entzündungen beeinflusst als Ferritin.',
				high: 'Eisenüberladung, etwa bei erblicher Hämochromatose, oder kürzliche Eiseneinnahme.',
				low: 'Eisenmangel oder durch Entzündung zurückgehaltenes Eisen.'
			}
		},
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
		info: {
			en: {
				what: 'The storage form of vitamin D, made in the skin from sunlight and taken in with food or supplements.',
				why: 'Bone health. Relevant on HRT because sex hormones protect bone density.',
				high: 'High dose supplements. Toxicity is rare and needs very high intake over a long time.',
				low: 'Little sun exposure, especially in winter at northern latitudes, darker skin, overweight.',
				fem: 'Bone density depends on adequate estradiol after testosterone is suppressed. Vitamin D and calcium support it but do not replace estradiol.',
				masc: 'Testosterone is partly converted into estradiol, which protects bone. Vitamin D and calcium support it.',
				note: 'There is no single agreed optimum. The Endocrine Society 2024 guideline no longer defines a target for healthy adults.'
			},
			de: {
				what: 'Die Speicherform von Vitamin D, gebildet in der Haut durch Sonnenlicht und aufgenommen über Nahrung oder Präparate.',
				why: 'Knochengesundheit. Unter HRT relevant, weil Sexualhormone die Knochendichte schützen.',
				high: 'Hochdosierte Präparate. Eine Vergiftung ist selten und braucht sehr hohe Mengen über lange Zeit.',
				low: 'Wenig Sonne, besonders im Winter in nördlichen Breiten, dunklere Haut, Übergewicht.',
				fem: 'Die Knochendichte hängt nach Unterdrückung des Testosterons von ausreichend Östradiol ab. Vitamin D und Calcium unterstützen, ersetzen Östradiol aber nicht.',
				masc: 'Testosteron wird teils zu Östradiol umgewandelt, das den Knochen schützt. Vitamin D und Calcium unterstützen das.',
				note: 'Es gibt kein einheitlich anerkanntes Optimum. Die Leitlinie der Endocrine Society von 2024 definiert für gesunde Erwachsene kein Ziel mehr.'
			}
		},
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
		info: {
			en: {
				what: 'Vitamin needed for red cell production and nerves. Found almost only in animal foods.',
				why: 'Deficiency causes anaemia with large red cells and nerve damage.',
				high: 'Supplements or injections. Very high values without supplements can point to liver or blood disorders.',
				low: 'Vegan diet without supplements, poor absorption, metformin, proton pump inhibitors.',
				note: 'Values between about 200 and 300 pg/ml are a grey zone, homocysteine or holotranscobalamin help decide.'
			},
			de: {
				what: 'Vitamin für die Blutbildung und die Nerven. Kommt fast nur in tierischen Lebensmitteln vor.',
				why: 'Ein Mangel verursacht Blutarmut mit großen roten Blutkörperchen und Nervenschäden.',
				high: 'Präparate oder Spritzen. Sehr hohe Werte ohne Einnahme können auf Leber- oder Bluterkrankungen hindeuten.',
				low: 'Vegane Ernährung ohne Ergänzung, schlechte Aufnahme, Metformin, Protonenpumpenhemmer.',
				note: 'Werte zwischen etwa 200 und 300 pg/ml sind eine Grauzone, Homocystein oder Holotranscobalamin helfen bei der Einordnung.'
			}
		},
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
		info: {
			en: {
				what: 'B vitamin needed for cell division and red cell production.',
				why: 'Deficiency causes anaemia with large red cells.',
				high: 'Supplements.',
				low: 'Diet low in vegetables, alcohol, some drugs (methotrexate, some antiepileptics).',
				note: 'Serum folate reflects the last days of intake. Red cell folate reflects the last months.'
			},
			de: {
				what: 'B-Vitamin für Zellteilung und Blutbildung.',
				why: 'Ein Mangel verursacht Blutarmut mit großen roten Blutkörperchen.',
				high: 'Präparate.',
				low: 'Gemüsearme Ernährung, Alkohol, manche Medikamente (Methotrexat, manche Antiepileptika).',
				note: 'Folsäure im Serum spiegelt die letzten Tage, Folsäure in den Erythrozyten die letzten Monate.'
			}
		},
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
		info: {
			en: {
				what: 'Amino acid that builds up when vitamin B12, folate or B6 are missing.',
				why: 'Sensitive functional marker of B12 and folate deficiency.',
				high: 'B12 or folate deficiency, reduced kidney function, some genetic variants.',
				low: 'Not a concern.'
			},
			de: {
				what: 'Aminosäure, die sich anhäuft, wenn Vitamin B12, Folsäure oder B6 fehlen.',
				why: 'Empfindlicher Funktionsmarker für B12- und Folsäuremangel.',
				high: 'B12- oder Folsäuremangel, verminderte Nierenfunktion, manche Genvarianten.',
				low: 'Unbedenklich.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Protein made by the prostate.',
				why: 'Used in prostate cancer screening and follow-up.',
				high: 'Enlarged prostate, inflammation, cancer, recent ejaculation or cycling.',
				low: 'Not a concern.',
				fem: 'The prostate stays after vaginoplasty and still needs screening at the usual ages. On estrogen PSA falls to a fraction of the cis male level, so values that look normal for cis men can be clearly high for trans women.'
			},
			de: {
				what: 'Eiweiß aus der Prostata.',
				why: 'Wird in der Früherkennung und Nachsorge von Prostatakrebs genutzt.',
				high: 'Vergrößerte Prostata, Entzündung, Krebs, kürzlicher Samenerguss oder Radfahren.',
				low: 'Unbedenklich.',
				fem: 'Die Prostata bleibt auch nach einer Vaginoplastik und braucht in den üblichen Altersgruppen weiter Vorsorge. Unter Östrogen sinkt PSA auf einen Bruchteil des cis männlichen Werts, Werte, die für cis Männer normal wirken, können für trans Frauen deutlich erhöht sein.'
			}
		},
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
		info: {
			en: {
				what: 'Body weight, as noted at the visit or at home.',
				why: 'Tracks body changes on HRT and puts dose and lipids in context.',
				fem: 'Fat redistribution and some weight gain are common in the first years of feminizing HRT.',
				masc: 'Muscle mass and often weight increase on testosterone.'
			},
			de: {
				what: 'Körpergewicht, beim Arztbesuch oder zu Hause notiert.',
				why: 'Verfolgt körperliche Veränderungen unter HRT und ordnet Dosis und Blutfette ein.',
				fem: 'Fettumverteilung und etwas Gewichtszunahme sind in den ersten Jahren feminisierender HRT häufig.',
				masc: 'Muskelmasse und oft auch Gewicht nehmen unter Testosteron zu.'
			}
		},
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
		info: {
			en: {
				what: 'Weight relative to height squared.',
				why: 'A crude but standard population measure of under or overweight.',
				note: 'Says nothing about body composition, which is exactly what HRT changes.'
			},
			de: {
				what: 'Gewicht im Verhältnis zur Größe zum Quadrat.',
				why: 'Ein grobes, aber übliches Bevölkerungsmaß für Unter- oder Übergewicht.',
				note: 'Sagt nichts über die Körperzusammensetzung, und genau die ändert HRT.'
			}
		},
		refs: [clinical('who', T('Normal weight (WHO)', 'Normalgewicht (WHO)'), [18.5, 25], 'who-bmi', { note: T('18.5 to 24.9.', '18,5 bis 24,9.') })]
	}
];

