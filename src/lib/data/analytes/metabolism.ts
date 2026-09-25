import type { Analyte } from '../types';
import { T, adult, clinical, female, male, transMen, transWomen } from './refs';

const MG_DL_CHOL = [{ unit: 'mmol/l', factor: 38.67 }];

const humble = (therapy: 'f' | 'm', bounds: [number | undefined, number]) =>
	(therapy === 'f' ? transWomen : transMen)(bounds, 'humble2022', {
		note: T('Roche platform, 12 months or more on HRT, USA.', 'Roche-Plattform, mindestens 12 Monate HRT, USA.')
	});

const LIPIDS_HRT = {
	fem: T(
		'Oral estradiol tends to lower LDL a little and raise HDL and triglycerides. Injected or transdermal estradiol has smaller effects. Higher cyproterone acetate doses lower HDL. The net effects in studies are small and mixed.',
		'Orales Östradiol senkt LDL meist etwas und erhöht HDL und Triglyceride. Gespritztes oder transdermales Östradiol wirkt schwächer. Höhere Cyproteronacetat-Dosen senken HDL. Insgesamt sind die Effekte in Studien klein und uneinheitlich.'
	),
	masc: T(
		'Testosterone lowers HDL and tends to raise LDL and triglycerides a little, moving the profile toward the cis male pattern.',
		'Testosteron senkt HDL und erhöht LDL und Triglyceride meist etwas, das Profil nähert sich dem cis männlichen Muster.'
	)
};

export const metabolism: Analyte[] = [
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
		info: {
			en: {
				what: 'All cholesterol in the blood: LDL, HDL and the cholesterol in triglyceride rich particles.',
				why: 'Screening. Cardiovascular risk is judged on LDL, non-HDL and ApoB rather than on the total.',
				high: 'Genetics, diet, an underactive thyroid, kidney or liver conditions.',
				low: 'Rarely meaningful.',
				fem: LIPIDS_HRT.fem.en,
				masc: LIPIDS_HRT.masc.en
			},
			de: {
				what: 'Das gesamte Cholesterin im Blut: LDL, HDL und das Cholesterin in triglyceridreichen Partikeln.',
				why: 'Suchtest. Das Herz-Kreislauf-Risiko wird eher an LDL, Non-HDL und ApoB beurteilt als am Gesamtwert.',
				high: 'Veranlagung, Ernährung, Schilddrüsenunterfunktion, Nieren- oder Lebererkrankungen.',
				low: 'Selten von Bedeutung.',
				fem: LIPIDS_HRT.fem.de,
				masc: LIPIDS_HRT.masc.de
			}
		},
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
		info: {
			en: {
				what: 'Cholesterol carried back to the liver, the "good" cholesterol.',
				why: 'Low HDL is a cardiovascular risk marker. Higher is better, up to a point.',
				high: 'Genetics, exercise, moderate alcohol, estrogen.',
				low: 'Smoking, inactivity, insulin resistance, androgens, higher cyproterone acetate doses.',
				fem: LIPIDS_HRT.fem.en,
				masc: LIPIDS_HRT.masc.en
			},
			de: {
				what: 'Cholesterin, das zurück zur Leber transportiert wird, das "gute" Cholesterin.',
				why: 'Niedriges HDL ist ein Risikomarker für Herz und Gefäße. Höher ist besser, bis zu einem gewissen Punkt.',
				high: 'Veranlagung, Bewegung, mäßiger Alkoholkonsum, Östrogen.',
				low: 'Rauchen, Bewegungsmangel, Insulinresistenz, Androgene, höhere Cyproteronacetat-Dosen.',
				fem: LIPIDS_HRT.fem.de,
				masc: LIPIDS_HRT.masc.de
			}
		},
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
		info: {
			en: {
				what: 'Cholesterol carried to the tissues. The particles that build up in artery walls.',
				why: 'The main treatable cardiovascular risk factor. Goals depend on overall risk.',
				high: 'Genetics (familial hypercholesterolaemia), diet rich in saturated fat, an underactive thyroid.',
				low: 'Not a concern.',
				fem: LIPIDS_HRT.fem.en,
				masc: LIPIDS_HRT.masc.en
			},
			de: {
				what: 'Cholesterin, das zu den Geweben transportiert wird. Die Partikel, die sich in Gefäßwänden ablagern.',
				why: 'Der wichtigste behandelbare Risikofaktor für Herz und Gefäße. Zielwerte hängen vom Gesamtrisiko ab.',
				high: 'Veranlagung (familiäre Hypercholesterinämie), Ernährung reich an gesättigten Fetten, Schilddrüsenunterfunktion.',
				low: 'Unbedenklich.',
				fem: LIPIDS_HRT.fem.de,
				masc: LIPIDS_HRT.masc.de
			}
		},
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
		info: {
			en: {
				what: 'Total cholesterol minus HDL: every particle that can build up in arteries.',
				why: 'Captures risk from triglyceride rich particles that LDL misses. Works without fasting.',
				high: 'Same causes as high LDL, plus high triglycerides.'
			},
			de: {
				what: 'Gesamtcholesterin minus HDL: alle Partikel, die sich in Gefäßen ablagern können.',
				why: 'Erfasst auch das Risiko triglyceridreicher Partikel, die LDL übersieht. Funktioniert ohne Nüchternheit.',
				high: 'Gleiche Ursachen wie hohes LDL, dazu hohe Triglyceride.'
			}
		},
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
		info: {
			en: { what: 'LDL divided by HDL.', why: 'An older risk summary. Modern guidelines prefer LDL, non-HDL and ApoB goals.' },
			de: { what: 'LDL geteilt durch HDL.', why: 'Eine ältere Risikozusammenfassung. Aktuelle Leitlinien bevorzugen Ziele für LDL, Non-HDL und ApoB.' }
		},
		refs: []
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
		info: {
			en: {
				what: 'Blood fats from food and the liver.',
				why: 'Cardiovascular and metabolic risk marker. Very high levels can trigger pancreatitis.',
				high: 'A meal in the hours before the draw, alcohol, sugar, insulin resistance, oral estrogen.',
				low: 'Not a concern.',
				fem: 'Oral estradiol raises triglycerides more than injected or transdermal estradiol, because of its first pass through the liver.',
				masc: LIPIDS_HRT.masc.en,
				note: 'Swings a lot with the last meal. Only fasting values compare well.'
			},
			de: {
				what: 'Blutfette aus der Nahrung und der Leber.',
				why: 'Risikomarker für Herz, Gefäße und Stoffwechsel. Sehr hohe Werte können eine Bauchspeicheldrüsenentzündung auslösen.',
				high: 'Eine Mahlzeit in den Stunden vor der Abnahme, Alkohol, Zucker, Insulinresistenz, orales Östrogen.',
				low: 'Unbedenklich.',
				fem: 'Orales Östradiol erhöht Triglyceride stärker als gespritztes oder transdermales, weil es zuerst die Leber passiert.',
				masc: LIPIDS_HRT.masc.de,
				note: 'Schwankt stark mit der letzten Mahlzeit. Nur nüchterne Werte sind gut vergleichbar.'
			}
		},
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
		info: {
			en: {
				what: 'The protein on every particle that can build up in arteries, one per particle.',
				why: 'Counts atherogenic particles directly. Often the best single lipid risk marker, especially with high triglycerides.',
				high: 'Many atherogenic particles, even when LDL looks acceptable.',
				low: 'Not a concern.'
			},
			de: {
				what: 'Das Eiweiß auf jedem Partikel, das sich in Gefäßen ablagern kann, genau eines pro Partikel.',
				why: 'Zählt die gefäßschädigenden Partikel direkt. Oft der beste einzelne Fett-Risikomarker, besonders bei hohen Triglyceriden.',
				high: 'Viele gefäßschädigende Partikel, auch wenn LDL unauffällig wirkt.',
				low: 'Unbedenklich.'
			}
		},
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
		info: {
			en: {
				what: 'An LDL-like particle with an extra protein. Its level is set almost entirely by genes.',
				why: 'An independent cardiovascular risk factor. Guidelines suggest measuring it at least once in a lifetime.',
				high: 'Inherited. Raises the risk of heart attack, stroke and aortic valve stenosis.',
				low: 'Not a concern.',
				fem: 'Estrogen lowers Lp(a) a little.',
				note: 'Mass (mg/dl) and particle count (nmol/l) cannot be converted exactly, so they are kept as two series.'
			},
			de: {
				what: 'Ein LDL-ähnliches Partikel mit einem zusätzlichen Eiweiß. Sein Spiegel ist fast vollständig genetisch festgelegt.',
				why: 'Ein eigenständiger Risikofaktor für Herz und Gefäße. Leitlinien empfehlen, es mindestens einmal im Leben zu messen.',
				high: 'Vererbt. Erhöht das Risiko für Herzinfarkt, Schlaganfall und Aortenklappenstenose.',
				low: 'Unbedenklich.',
				fem: 'Östrogen senkt Lp(a) etwas.',
				note: 'Masse (mg/dl) und Partikelzahl (nmol/l) lassen sich nicht genau umrechnen, daher zwei getrennte Reihen.'
			}
		},
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
		info: {
			en: {
				what: 'Lipoprotein(a) counted as particles rather than weighed.',
				why: 'The unit most guidelines now prefer, because it does not depend on particle size.',
				high: 'Inherited. Raises the risk of heart attack, stroke and aortic valve stenosis.'
			},
			de: {
				what: 'Lipoprotein(a) als Partikelzahl statt als Masse.',
				why: 'Die Einheit, die die meisten Leitlinien inzwischen bevorzugen, weil sie nicht von der Partikelgröße abhängt.',
				high: 'Vererbt. Erhöht das Risiko für Herzinfarkt, Schlaganfall und Aortenklappenstenose.'
			}
		},
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
		info: {
			en: {
				what: 'Blood sugar at the moment of the draw.',
				why: 'Screens for diabetes, but only a fasting value can be judged against the thresholds.',
				high: 'A recent meal, stress, diabetes or prediabetes.',
				low: 'Long fasting, or glucose used up in a tube without a glycolysis inhibitor.',
				fem: 'Estrogen tends to improve insulin sensitivity a little, but weight and fat distribution changes can work the other way.',
				masc: 'Testosterone increases muscle and can improve insulin sensitivity, but weight gain works the other way.'
			},
			de: {
				what: 'Der Blutzucker zum Zeitpunkt der Abnahme.',
				why: 'Suchtest auf Diabetes, aber nur ein Nüchternwert lässt sich an den Grenzwerten messen.',
				high: 'Eine kürzliche Mahlzeit, Stress, Diabetes oder Vorstufe.',
				low: 'Langes Fasten oder Zuckerabbau in einem Röhrchen ohne Glykolysehemmer.',
				fem: 'Östrogen verbessert die Insulinempfindlichkeit meist etwas, Gewichts- und Fettverteilungsänderungen können aber in die andere Richtung wirken.',
				masc: 'Testosteron erhöht die Muskelmasse und kann die Insulinempfindlichkeit verbessern, Gewichtszunahme wirkt aber in die andere Richtung.'
			}
		},
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
		info: {
			en: {
				what: 'Share of haemoglobin with sugar attached. Reflects the average blood sugar over about 3 months.',
				why: 'Diagnoses and tracks diabetes without fasting.',
				high: 'Higher average blood sugar. Also iron deficiency.',
				low: 'Anything that shortens red cell lifespan: blood loss, haemolysis.',
				note: 'Red cell turnover changes on HRT, which may shift HbA1c slightly without a change in blood sugar.'
			},
			de: {
				what: 'Anteil des Hämoglobins mit angelagertem Zucker. Spiegelt den durchschnittlichen Blutzucker der letzten etwa 3 Monate.',
				why: 'Stellt und verfolgt Diabetes ohne Nüchternheit.',
				high: 'Höherer durchschnittlicher Blutzucker. Auch Eisenmangel.',
				low: 'Alles, was die Lebensdauer roter Blutkörperchen verkürzt: Blutverlust, Hämolyse.',
				note: 'Der Umsatz roter Blutkörperchen ändert sich unter HRT, was HbA1c leicht verschieben kann, ohne dass sich der Blutzucker ändert.'
			}
		},
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
		info: {
			en: { what: 'The same HbA1c in the international SI unit.', why: 'mmol/mol = (% − 2.15) × 10.929.' },
			de: { what: 'Derselbe HbA1c in der internationalen SI-Einheit.', why: 'mmol/mol = (% − 2,15) × 10,929.' }
		},
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
		info: {
			en: { what: 'HbA1c translated into an average blood sugar: 28.7 × HbA1c − 46.7.', why: 'Makes HbA1c easier to relate to glucose readings.' },
			de: { what: 'HbA1c umgerechnet in einen durchschnittlichen Blutzucker: 28,7 × HbA1c − 46,7.', why: 'Macht HbA1c mit Blutzuckermessungen vergleichbar.' }
		},
		refs: []
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
		info: {
			en: {
				what: 'The hormone that moves sugar from the blood into cells.',
				why: 'A high fasting insulin with normal glucose shows insulin resistance before diabetes develops.',
				high: 'Insulin resistance, a recent meal, overweight.',
				low: 'Fasting, type 1 diabetes.',
				note: 'Only fasting values are meaningful.'
			},
			de: {
				what: 'Das Hormon, das Zucker aus dem Blut in die Zellen bringt.',
				why: 'Ein hohes Nüchterninsulin bei normalem Zucker zeigt eine Insulinresistenz, bevor ein Diabetes entsteht.',
				high: 'Insulinresistenz, eine kürzliche Mahlzeit, Übergewicht.',
				low: 'Fasten, Typ-1-Diabetes.',
				note: 'Nur Nüchternwerte sind aussagekräftig.'
			}
		},
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
		info: {
			en: {
				what: 'Insulin resistance estimated from fasting glucose and fasting insulin.',
				why: 'Tracks insulin resistance over time.',
				high: 'Insulin resistance. Published cutoffs range from about 2 to 3.5 depending on the population.',
				note: 'Computed for every draw with both values. It is only meaningful when the draw was fasting.'
			},
			de: {
				what: 'Aus Nüchternglukose und Nüchterninsulin geschätzte Insulinresistenz.',
				why: 'Verfolgt die Insulinresistenz über die Zeit.',
				high: 'Insulinresistenz. Veröffentlichte Grenzwerte liegen je nach Bevölkerung zwischen etwa 2 und 3,5.',
				note: 'Wird für jede Abnahme mit beiden Werten berechnet. Aussagekräftig nur, wenn nüchtern abgenommen wurde.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Protein from heart muscle cells.',
				why: 'The standard test for heart muscle damage such as a heart attack.',
				high: 'Heart muscle damage, heart strain, kidney disease, extreme endurance exercise.',
				note: 'pg/ml and ng/l are the same number.'
			},
			de: {
				what: 'Eiweiß aus Herzmuskelzellen.',
				why: 'Der Standardtest für Herzmuskelschäden wie einen Herzinfarkt.',
				high: 'Herzmuskelschaden, Herzbelastung, Nierenerkrankung, extremer Ausdauersport.',
				note: 'pg/ml und ng/l sind dieselbe Zahl.'
			}
		},
		refs: []
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
		info: {
			en: {
				what: 'Muscle enzyme that leaks into the blood when muscle is strained or damaged.',
				why: 'Muscle damage, and a side effect check for statins.',
				high: 'Hard training in the days before the draw (often several times the upper limit), injections into muscle, falls, statins, rarely muscle disease.',
				low: 'Low muscle mass. Not a concern.',
				fem: 'Tends to fall with muscle mass.',
				masc: 'Rises with muscle mass and training toward the cis male range.'
			},
			de: {
				what: 'Muskelenzym, das ins Blut gelangt, wenn Muskeln belastet oder verletzt werden.',
				why: 'Muskelschäden und Kontrolle auf Nebenwirkungen von Statinen.',
				high: 'Hartes Training in den Tagen vor der Abnahme (oft ein Vielfaches der Obergrenze), Spritzen in den Muskel, Stürze, Statine, selten Muskelerkrankungen.',
				low: 'Geringe Muskelmasse. Unbedenklich.',
				fem: 'Sinkt meist mit der Muskelmasse.',
				masc: 'Steigt mit Muskelmasse und Training Richtung cis männlicher Bereich.'
			}
		},
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
		info: {
			en: { what: 'Heart type form of the muscle enzyme creatine kinase.', why: 'Older heart damage marker, mostly replaced by troponin.' },
			de: { what: 'Herztyp des Muskelenzyms Kreatinkinase.', why: 'Älterer Marker für Herzschäden, weitgehend durch Troponin ersetzt.' }
		},
		refs: []
	},
	{
		id: 'ldh',
		name: T('LDH', 'LDH'),
		aliases: ['Lactate dehydrogenase', 'Laktatdehydrogenase', 'LD'],
		unit: 'U/l',
		units: [{ unit: 'µkat/l', factor: 60 }],
		decimals: 0,
		group: 'cardiac',
		info: {
			en: {
				what: 'Enzyme present in nearly every cell.',
				why: 'Non specific marker of cell damage anywhere, including red cell breakdown.',
				high: 'Haemolysis (also in the tube after a difficult draw), muscle or liver damage, hard exercise.',
				low: 'Not meaningful.'
			},
			de: {
				what: 'Enzym in fast jeder Zelle.',
				why: 'Unspezifischer Marker für Zellschäden überall, auch für den Abbau roter Blutkörperchen.',
				high: 'Hämolyse (auch im Röhrchen nach schwieriger Abnahme), Muskel- oder Leberschaden, harter Sport.',
				low: 'Ohne Bedeutung.'
			}
		},
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
		info: {
			en: {
				what: 'Protein the liver makes during inflammation.',
				why: 'Picks up infection and inflammation. At low levels, measured with a high sensitivity assay, it is also a cardiovascular risk marker.',
				high: 'Infection, injury, inflammatory disease, excess body fat.',
				low: 'Normal.',
				fem: 'Oral estrogen raises CRP through its first pass through the liver. Injected or transdermal estradiol does so much less.'
			},
			de: {
				what: 'Eiweiß, das die Leber bei Entzündungen bildet.',
				why: 'Zeigt Infektionen und Entzündungen. In niedrigen Bereichen, mit einem hochsensitiven Test gemessen, auch ein Risikomarker für Herz und Gefäße.',
				high: 'Infektion, Verletzung, entzündliche Erkrankung, viel Körperfett.',
				low: 'Normal.',
				fem: 'Orales Östrogen erhöht CRP über die erste Leberpassage. Gespritztes oder transdermales Östradiol deutlich weniger.'
			}
		},
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
		info: {
			en: {
				what: 'How fast red cells settle in a tube within an hour.',
				why: 'An old, slow marker of inflammation.',
				high: 'Inflammation, anaemia, pregnancy, older age. Higher in women than in men.',
				low: 'Not meaningful.'
			},
			de: {
				what: 'Wie schnell sich rote Blutkörperchen in einer Stunde im Röhrchen absetzen.',
				why: 'Ein alter, träger Entzündungsmarker.',
				high: 'Entzündung, Blutarmut, Schwangerschaft, höheres Alter. Bei Frauen höher als bei Männern.',
				low: 'Ohne Bedeutung.'
			}
		},
		refs: []
	}
];
