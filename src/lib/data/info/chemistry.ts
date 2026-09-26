import type { AnalyteInfo, InfoEntry, Lang } from '../types';

type Texts = Record<Lang, Partial<AnalyteInfo>>;

// Shared by every eGFR computed from creatinine
const EGFR_HRT: Texts = {
	en: {
		fem: 'Every creatinine equation needs a sex, and none has been validated for people on HRT. Creatinine moves only partly toward the female range, so the true value most likely lies between the female and the male curve. Watch the trend rather than a single number. Cystatin C depends much less on muscle mass and is a useful cross check. A printed eGFR jumps whenever the lab changes the sex on file, which is not a kidney change.',
		masc: 'Every creatinine equation needs a sex, and none has been validated for people on HRT. Creatinine rises toward the male range with muscle mass, so the true value most likely lies between the female and the male curve. Watch the trend rather than a single number. Cystatin C depends much less on muscle mass and is a useful cross check. A printed eGFR jumps whenever the lab changes the sex on file, which is not a kidney change.'
	},
	de: {
		fem: 'Jede Kreatinin-Formel braucht ein Geschlecht, und keine ist für Menschen unter HRT geprüft. Kreatinin bewegt sich nur teilweise in Richtung des weiblichen Bereichs, der wahre Wert liegt daher am ehesten zwischen der weiblichen und der männlichen Kurve. Achte auf den Verlauf statt auf eine einzelne Zahl. Cystatin C hängt viel weniger von der Muskelmasse ab und ist eine nützliche Gegenprobe. Eine gedruckte eGFR springt, sobald das Labor das hinterlegte Geschlecht ändert, das ist keine Veränderung der Niere.',
		masc: 'Jede Kreatinin-Formel braucht ein Geschlecht, und keine ist für Menschen unter HRT geprüft. Kreatinin steigt mit der Muskelmasse in Richtung des männlichen Bereichs, der wahre Wert liegt daher am ehesten zwischen der weiblichen und der männlichen Kurve. Achte auf den Verlauf statt auf eine einzelne Zahl. Cystatin C hängt viel weniger von der Muskelmasse ab und ist eine nützliche Gegenprobe. Eine gedruckte eGFR springt, sobald das Labor das hinterlegte Geschlecht ändert, das ist keine Veränderung der Niere.'
	}
};

// Liver boxes, each enzyme adds how it moves on HRT
function liver(fem: [string, string], masc: [string, string]): Texts {
	return {
		en: {
			fem: `Oral estradiol, cyproterone acetate and bicalutamide are processed by the liver, so liver values are part of routine monitoring. Liver injury from cyproterone acetate is reported mainly at the high doses used for prostate cancer, and concern about it is one reason the drug is not approved in the US (WPATH). Bicalutamide can rarely injure the liver too. ${fem[0]}`,
			masc: `Serious liver problems from injected or topical testosterone are rare. ${masc[0]}`
		},
		de: {
			fem: `Orales Östradiol, Cyproteronacetat und Bicalutamid werden über die Leber verarbeitet, Leberwerte gehören daher zur üblichen Kontrolle. Leberschäden durch Cyproteronacetat sind vor allem bei den hohen Dosen der Prostatakrebstherapie beschrieben, die Sorge darum ist ein Grund, warum das Mittel in den USA nicht zugelassen ist (WPATH). Auch Bicalutamid kann selten die Leber schädigen. ${fem[1]}`,
			masc: `Ernste Leberprobleme durch gespritztes oder aufgetragenes Testosteron sind selten. ${masc[1]}`
		}
	};
}

const LIVER_FALLS = liver(
	['On stable HRT this enzyme tends to fall toward the cis female range (Boekhout-Berends 2023).', 'Unter stabiler HRT sinkt dieses Enzym eher in Richtung des cis weiblichen Bereichs (Boekhout-Berends 2023).'],
	['This enzyme tends to rise slightly toward the cis male range (Boekhout-Berends 2023).', 'Dieses Enzym steigt eher leicht in Richtung des cis männlichen Bereichs (Boekhout-Berends 2023).']
);

const LIVER_GGT = liver(
	['GGT itself hardly changed on HRT in a large Dutch cohort (Boekhout-Berends 2023).', 'GGT selbst änderte sich in einer großen niederländischen Kohorte unter HRT kaum (Boekhout-Berends 2023).'],
	['Tends to shift toward the cis male range (Humble 2022).', 'Verschiebt sich eher in Richtung des cis männlichen Bereichs (Humble 2022).']
);

export const chemistry: Record<string, InfoEntry> = {
	sodium: {
		en: {
			what: 'The main salt in blood and in the fluid around cells.',
			why: 'Reflects water balance much more than salt intake. Checked with confusion, weakness, heavy fluid loss and with drugs that affect it.',
			high: 'Too little water: dehydration, heavy sweating, not drinking enough, rarely a lack of the antidiuretic hormone.',
			low: 'Too much water relative to salt: drinking very large amounts, diuretics, some antidepressants and antiepileptics, heart, liver or kidney failure, hormonal causes such as an underactive thyroid or adrenal insufficiency.'
		},
		de: {
			what: 'Das wichtigste Salz im Blut und in der Flüssigkeit um die Zellen.',
			why: 'Spiegelt den Wasserhaushalt viel mehr als die Salzaufnahme. Geprüft bei Verwirrtheit, Schwäche, starkem Flüssigkeitsverlust und unter Medikamenten, die es beeinflussen.',
			high: 'Zu wenig Wasser: Flüssigkeitsmangel, starkes Schwitzen, zu wenig Trinken, selten ein Mangel an antidiuretischem Hormon.',
			low: 'Zu viel Wasser im Verhältnis zu Salz: sehr große Trinkmengen, Entwässerungsmittel, manche Antidepressiva und Antiepileptika, Herz-, Leber- oder Nierenschwäche, hormonelle Ursachen wie eine Schilddrüsenunterfunktion oder Nebenniereninsuffizienz.'
		}
	},

	potassium: {
		cites: ['sp-hyperkalemia', 'saleh2022', 'wpath8', 'endo2017'],
		en: {
			what: 'The main salt inside cells. Small shifts in the blood matter a lot for heart and muscles.',
			why: 'The kidneys keep it in a tight range. Checked with kidney disease and with drugs that raise or lower it, such as diuretics, ACE inhibitors or spironolactone.',
			high: 'Reduced kidney function, drugs that make the kidneys keep potassium (spironolactone, ACE inhibitors, sartans), potassium supplements or salt substitutes. Very often falsely high from the draw itself.',
			low: 'Vomiting, diarrhoea, diuretics, laxatives, rarely too much aldosterone.',
			more: 'Too much and too little potassium both disturb the heart rhythm, which is why it is kept in a narrow range of about 3.5 to 5 mmol/l. Only a tiny share of the body\'s potassium is in the blood, the rest sits inside cells.\n\nThat is also why many high values are not real (pseudohyperkalaemia). Potassium leaks out of cells when red cells burst during a difficult draw, when the fist is clenched or the tourniquet stays on long, when the sample is stored or transported badly before it is spun, and with very high platelet or white cell counts. A surprising high value is usually repeated before anything else happens.',
			fem: 'Spironolactone, a common antiandrogen, blocks aldosterone and makes the kidneys keep potassium. Guidelines therefore ask for potassium and creatinine checks while taking it. With healthy kidneys relevant rises are uncommon and mostly short lived (WPATH). The risk grows with reduced kidney function, ACE inhibitors or sartans, and potassium supplements. Cyproterone acetate and bicalutamide do not raise potassium.'
		},
		de: {
			what: 'Das wichtigste Salz in den Zellen. Kleine Verschiebungen im Blut wirken stark auf Herz und Muskeln.',
			why: 'Die Nieren halten es in einem engen Bereich. Geprüft bei Nierenerkrankungen und unter Medikamenten, die es erhöhen oder senken, etwa Entwässerungsmittel, ACE-Hemmer oder Spironolacton.',
			high: 'Verminderte Nierenfunktion, Medikamente, durch die die Nieren Kalium zurückhalten (Spironolacton, ACE-Hemmer, Sartane), Kaliumpräparate oder Salzersatz. Sehr oft falsch hoch durch die Abnahme selbst.',
			low: 'Erbrechen, Durchfall, Entwässerungsmittel, Abführmittel, selten zu viel Aldosteron.',
			more: 'Zu viel wie zu wenig Kalium stören den Herzrhythmus, deshalb wird es in einem engen Bereich von etwa 3,5 bis 5 mmol/l gehalten. Nur ein winziger Teil des Körperkaliums ist im Blut, der Rest steckt in den Zellen.\n\nDeshalb sind viele hohe Werte nicht echt (Pseudohyperkaliämie). Kalium tritt aus den Zellen aus, wenn rote Blutkörperchen bei einer schwierigen Abnahme platzen, wenn die Faust gepumpt wird oder die Stauung lange liegt, wenn die Probe vor dem Zentrifugieren ungünstig gelagert oder transportiert wird, und bei sehr hohen Thrombozyten- oder Leukozytenzahlen. Ein überraschend hoher Wert wird meist erst einmal wiederholt.',
			fem: 'Spironolacton, ein häufiges Antiandrogen, blockiert Aldosteron, dadurch halten die Nieren Kalium zurück. Leitlinien empfehlen deshalb Kontrollen von Kalium und Kreatinin während der Einnahme. Bei gesunden Nieren sind relevante Anstiege selten und meist vorübergehend (WPATH). Das Risiko steigt mit verminderter Nierenfunktion, ACE-Hemmern oder Sartanen und Kaliumpräparaten. Cyproteronacetat und Bicalutamid erhöhen Kalium nicht.'
		}
	},

	chloride: {
		en: {
			what: 'The main negatively charged salt in blood. It mostly moves with sodium.',
			why: 'Helps read water balance and acid base disorders.',
			high: 'Dehydration, large amounts of saline infusion, some kidney conditions, diarrhoea.',
			low: 'Vomiting, diuretics, anything that lowers sodium.'
		},
		de: {
			what: 'Das wichtigste negativ geladene Salz im Blut. Es bewegt sich meist mit Natrium.',
			why: 'Hilft, Wasserhaushalt und Störungen des Säure-Basen-Haushalts einzuordnen.',
			high: 'Flüssigkeitsmangel, große Mengen Kochsalzinfusion, manche Nierenerkrankungen, Durchfall.',
			low: 'Erbrechen, Entwässerungsmittel, alles, was Natrium senkt.'
		}
	},

	calcium: {
		en: {
			what: 'Total calcium in blood. About half is free and active, the rest is mostly bound to albumin.',
			why: 'Bone metabolism, the parathyroid glands and vitamin D status. Also nerves, muscles and the heart depend on it.',
			high: 'An overactive parathyroid, too much vitamin D, dehydration, some cancers, thiazide diuretics or lithium.',
			low: 'Vitamin D deficiency, low albumin, an underactive parathyroid, low magnesium, reduced kidney function.',
			note: 'Low albumin lowers total calcium without changing the active part. Then a corrected or ionised calcium tells more.'
		},
		de: {
			what: 'Das gesamte Calcium im Blut. Etwa die Hälfte ist frei und wirksam, der Rest meist an Albumin gebunden.',
			why: 'Knochenstoffwechsel, Nebenschilddrüsen und Vitamin-D-Versorgung. Auch Nerven, Muskeln und das Herz hängen davon ab.',
			high: 'Eine Nebenschilddrüsenüberfunktion, zu viel Vitamin D, Flüssigkeitsmangel, manche Krebserkrankungen, Thiazid-Entwässerungsmittel oder Lithium.',
			low: 'Vitamin-D-Mangel, niedriges Albumin, eine Nebenschilddrüsenunterfunktion, niedriges Magnesium, verminderte Nierenfunktion.',
			note: 'Niedriges Albumin senkt das Gesamtcalcium, ohne den wirksamen Teil zu ändern. Dann sagt ein korrigiertes oder ionisiertes Calcium mehr.'
		}
	},

	magnesium: {
		cites: ['costello2016'],
		en: {
			what: 'A mineral needed for muscles, nerves, the heart rhythm and hundreds of enzymes.',
			why: 'Checked with cramps, heart rhythm problems, or low potassium and calcium that do not respond to treatment.',
			high: 'Reduced kidney function, magnesium supplements or antacids.',
			low: 'Diarrhoea, alcohol, diuretics, proton pump inhibitors taken for a long time, poorly controlled diabetes.',
			note: 'Blood holds only about 1 percent of the body\'s magnesium, so a normal value does not rule out a deficit.'
		},
		de: {
			what: 'Ein Mineral, das Muskeln, Nerven, der Herzrhythmus und hunderte Enzyme brauchen.',
			why: 'Geprüft bei Krämpfen, Herzrhythmusstörungen oder niedrigem Kalium und Calcium, die auf Behandlung nicht ansprechen.',
			high: 'Verminderte Nierenfunktion, Magnesiumpräparate oder Antazida.',
			low: 'Durchfall, Alkohol, Entwässerungsmittel, lange eingenommene Protonenpumpenhemmer, schlecht eingestellter Diabetes.',
			note: 'Im Blut ist nur etwa 1 Prozent des Körpermagnesiums, ein normaler Wert schließt einen Mangel daher nicht aus.'
		}
	},

	phosphate: {
		en: {
			what: 'A mineral stored in bone together with calcium, also part of the energy supply of every cell.',
			why: 'Bone metabolism, kidney function and the parathyroid glands.',
			high: 'Reduced kidney function, an underactive parathyroid, a sample with burst red cells.',
			low: 'An overactive parathyroid, vitamin D deficiency, malnutrition, alcohol, refeeding after starvation.'
		},
		de: {
			what: 'Ein Mineral, das zusammen mit Calcium im Knochen gespeichert wird und Teil der Energieversorgung jeder Zelle ist.',
			why: 'Knochenstoffwechsel, Nierenfunktion und Nebenschilddrüsen.',
			high: 'Verminderte Nierenfunktion, eine Nebenschilddrüsenunterfunktion, eine Probe mit geplatzten roten Blutkörperchen.',
			low: 'Eine Nebenschilddrüsenüberfunktion, Vitamin-D-Mangel, Mangelernährung, Alkohol, Wiederernährung nach Hungerphasen.'
		}
	},

	creatinine: {
		cites: ['sp-gfr', 'kdigo2012', 'krupka2022', 'boekhout2023', 'humble2022'],
		en: {
			what: 'A waste product of muscle, cleared by the kidneys.',
			why: 'The standard marker of kidney function and the basis of eGFR. Because it depends on muscle mass, it also mirrors body composition.',
			high: 'Reduced kidney filtration, dehydration, lots of muscle, creatine supplements, a large meat meal or hard exercise before the draw, some drugs such as trimethoprim.',
			low: 'Low muscle mass, pregnancy. Usually harmless.',
			more: 'Muscles turn a steady share of their creatine into creatinine every day, so the blood level depends on muscle mass as much as on the kidneys. That is why ranges differ by sex, and why eGFR equations adjust for age and sex. Very muscular people can have a high creatinine with healthy kidneys, frail people a normal one with weak kidneys.\n\nThe kidneys can lose a good part of their filtering capacity before creatinine rises clearly, so a small rise matters more at a low level than at a high one. Cooked meat and creatine supplements raise it for hours to days, and some drugs block its removal and raise it without harming the kidney.',
			fem: 'Muscle mass falls on estradiol, so creatinine tends to drift down (Boekhout-Berends 2023). The change is small, though: a meta-analysis found no significant change in trans women (Krupka 2022), and values often stay close to the cis male range (Humble 2022). A value above the cis female range is not a sign of a kidney problem by itself.',
			masc: 'Rises with muscle mass on testosterone, by about 0.15 mg/dl within the first year in a meta-analysis (Krupka 2022), and reaches the cis male range. A value above the cis female range is expected.',
			note: 'Conversion: 1 mg/dl = 88.4 µmol/l.'
		},
		de: {
			what: 'Ein Abbauprodukt der Muskeln, wird über die Nieren ausgeschieden.',
			why: 'Der Standardmarker der Nierenfunktion und die Grundlage der eGFR. Da er von der Muskelmasse abhängt, spiegelt er auch die Körperzusammensetzung.',
			high: 'Verminderte Nierenfiltration, Flüssigkeitsmangel, viel Muskulatur, Kreatin-Präparate, eine große Fleischmahlzeit oder harter Sport vor der Abnahme, manche Medikamente wie Trimethoprim.',
			low: 'Geringe Muskelmasse, Schwangerschaft. Meist harmlos.',
			more: 'Muskeln wandeln jeden Tag einen festen Anteil ihres Kreatins in Kreatinin um, der Blutwert hängt daher ebenso von der Muskelmasse ab wie von den Nieren. Deshalb unterscheiden sich die Bereiche nach Geschlecht, und deshalb berücksichtigen eGFR-Formeln Alter und Geschlecht. Sehr muskulöse Menschen können mit gesunden Nieren ein hohes Kreatinin haben, gebrechliche Menschen mit schwachen Nieren ein normales.\n\nDie Nieren können einen guten Teil ihrer Filterleistung verlieren, bevor Kreatinin deutlich steigt, ein kleiner Anstieg zählt daher bei niedrigem Niveau mehr als bei hohem. Gekochtes Fleisch und Kreatin-Präparate erhöhen es für Stunden bis Tage, und manche Medikamente blockieren seine Ausscheidung und erhöhen es, ohne der Niere zu schaden.',
			fem: 'Unter Östradiol sinkt die Muskelmasse, Kreatinin fällt daher eher etwas (Boekhout-Berends 2023). Die Änderung ist aber klein: Eine Metaanalyse fand bei trans Frauen keine signifikante Änderung (Krupka 2022), und die Werte bleiben oft nahe am cis männlichen Bereich (Humble 2022). Ein Wert über dem cis weiblichen Bereich ist für sich allein kein Zeichen eines Nierenproblems.',
			masc: 'Steigt unter Testosteron mit der Muskelmasse, in einer Metaanalyse um etwa 0,15 mg/dl im ersten Jahr (Krupka 2022), und erreicht den cis männlichen Bereich. Ein Wert über dem cis weiblichen Bereich ist zu erwarten.',
			note: 'Umrechnung: 1 mg/dl = 88,4 µmol/l.'
		}
	},

	egfr: {
		cites: ['kdigo2012', 'ckdepi2009', 'sp-gfr'],
		en: {
			what: 'Estimated glomerular filtration rate: how much blood the kidneys filter per minute, calculated by the lab from creatinine, age and the sex on file.',
			why: 'The usual way to stage kidney function and to dose drugs cleared by the kidneys.',
			high: 'Not a concern. Many labs cap the printed value at ">90".',
			low: 'Below 60 for three months or longer defines chronic kidney disease. A single low value can also come from dehydration or a large meat meal.',
			more: 'Measuring filtration directly needs a tracer substance and several blood draws, so labs estimate it with equations. Most German labs still use CKD-EPI 2009. Young adults typically filter around 100 to 120 ml per minute, and the value falls slowly with age.\n\nKDIGO sorts kidney function into stages: G1 90 and above, G2 60 to 89, G3a 45 to 59, G3b 30 to 44, G4 15 to 29, G5 below 15. Chronic kidney disease means an eGFR below 60 for at least three months, or signs of kidney damage such as albumin in the urine at any eGFR. A value between 60 and 89 without such signs is not a disease.\n\nThe equations assume average muscle mass for age and sex. Very muscular or very slight people, amputations, a vegetarian diet or creatine supplements all push the estimate off. Cystatin C then helps.',
			...EGFR_HRT.en
		},
		de: {
			what: 'Geschätzte glomeruläre Filtrationsrate: wie viel Blut die Nieren pro Minute filtern, vom Labor aus Kreatinin, Alter und hinterlegtem Geschlecht berechnet.',
			why: 'Der übliche Weg, die Nierenfunktion einzustufen und Medikamente zu dosieren, die über die Nieren ausgeschieden werden.',
			high: 'Unbedenklich. Viele Labore geben höchstens ">90" an.',
			low: 'Unter 60 über drei Monate oder länger definiert eine chronische Nierenerkrankung. Ein einzelner niedriger Wert kann auch von Flüssigkeitsmangel oder einer großen Fleischmahlzeit kommen.',
			more: 'Die Filtration direkt zu messen braucht eine Markersubstanz und mehrere Blutabnahmen, Labore schätzen sie daher mit Formeln. Die meisten deutschen Labore nutzen noch CKD-EPI 2009. Junge Erwachsene filtern typischerweise etwa 100 bis 120 ml pro Minute, mit dem Alter sinkt der Wert langsam.\n\nKDIGO teilt die Nierenfunktion in Stadien ein: G1 ab 90, G2 60 bis 89, G3a 45 bis 59, G3b 30 bis 44, G4 15 bis 29, G5 unter 15. Eine chronische Nierenerkrankung bedeutet eine eGFR unter 60 über mindestens drei Monate oder Zeichen eines Nierenschadens wie Albumin im Urin bei jeder eGFR. Ein Wert zwischen 60 und 89 ohne solche Zeichen ist keine Krankheit.\n\nDie Formeln setzen eine für Alter und Geschlecht durchschnittliche Muskelmasse voraus. Sehr muskulöse oder sehr zierliche Menschen, Amputationen, vegetarische Ernährung oder Kreatin-Präparate verschieben die Schätzung. Dann hilft Cystatin C.',
			...EGFR_HRT.de
		}
	},

	'egfr-f': {
		cites: ['ckdepi2009', 'kdigo2012'],
		en: {
			what: 'eGFR recomputed from every creatinine value with the female CKD-EPI 2009 equation, the one most German labs use.',
			why: 'Makes all draws comparable, whatever sex the lab had on file.',
			...EGFR_HRT.en
		},
		de: {
			what: 'eGFR aus jedem Kreatininwert neu berechnet, mit der weiblichen CKD-EPI-2009-Formel, die die meisten deutschen Labore nutzen.',
			why: 'Macht alle Abnahmen vergleichbar, egal welches Geschlecht das Labor hinterlegt hatte.',
			...EGFR_HRT.de
		}
	},

	'egfr-m': {
		cites: ['ckdepi2009', 'kdigo2012'],
		en: {
			what: 'eGFR recomputed from every creatinine value with the male CKD-EPI 2009 equation.',
			why: 'Makes all draws comparable, whatever sex the lab had on file.',
			...EGFR_HRT.en
		},
		de: {
			what: 'eGFR aus jedem Kreatininwert neu berechnet, mit der männlichen CKD-EPI-2009-Formel.',
			why: 'Macht alle Abnahmen vergleichbar, egal welches Geschlecht das Labor hinterlegt hatte.',
			...EGFR_HRT.de
		}
	},

	'cystatin-c': {
		cites: ['kdigo2012', 'ckdepi2012'],
		en: {
			what: 'A small protein made by all cells at a steady rate and cleared by the kidneys.',
			why: 'A kidney marker that depends far less on muscle mass than creatinine. Used to confirm a borderline eGFR.',
			high: 'Reduced kidney filtration. Also an overactive thyroid, high dose cortisone, inflammation, smoking and obesity.',
			low: 'Not a concern. An underactive thyroid can lower it slightly.',
			more: 'Because cystatin C does not come from muscle, it helps when creatinine is hard to read: very high or low muscle mass, changing body composition, or a diet that shifts creatinine. KDIGO suggests measuring it when a creatinine eGFR between 45 and 59 is the only sign of kidney disease, to confirm or rule out chronic kidney disease. Combined with creatinine in one equation it gives the most accurate estimate.\n\nIt has its own pitfalls: thyroid function, glucocorticoids, inflammation, smoking and obesity all shift it independently of the kidneys.',
			fem: 'Useful when creatinine is hard to read because muscle mass is changing. Data on HRT are still limited, but the cystatin C equation barely depends on sex.',
			masc: 'Useful when creatinine is hard to read because muscle mass is changing. Data on HRT are still limited, but the cystatin C equation barely depends on sex.'
		},
		de: {
			what: 'Ein kleines Eiweiß, das alle Zellen gleichmäßig bilden und die Nieren ausscheiden.',
			why: 'Ein Nierenmarker, der viel weniger von der Muskelmasse abhängt als Kreatinin. Genutzt, um eine grenzwertige eGFR zu bestätigen.',
			high: 'Verminderte Nierenfiltration. Außerdem Schilddrüsenüberfunktion, hochdosiertes Kortison, Entzündung, Rauchen und Übergewicht.',
			low: 'Unbedenklich. Eine Schilddrüsenunterfunktion kann es leicht senken.',
			more: 'Weil Cystatin C nicht aus den Muskeln stammt, hilft es, wenn Kreatinin schwer zu deuten ist: bei sehr hoher oder niedriger Muskelmasse, sich ändernder Körperzusammensetzung oder einer Ernährung, die Kreatinin verschiebt. KDIGO schlägt die Messung vor, wenn eine Kreatinin-eGFR zwischen 45 und 59 das einzige Zeichen einer Nierenerkrankung ist, um eine chronische Nierenerkrankung zu bestätigen oder auszuschließen. Zusammen mit Kreatinin in einer Formel ergibt es die genaueste Schätzung.\n\nEs hat eigene Fallstricke: Schilddrüsenfunktion, Glukokortikoide, Entzündung, Rauchen und Übergewicht verschieben es unabhängig von den Nieren.',
			fem: 'Nützlich, wenn Kreatinin schwer zu deuten ist, weil sich die Muskelmasse ändert. Daten unter HRT sind noch begrenzt, aber die Cystatin-C-Formel hängt kaum vom Geschlecht ab.',
			masc: 'Nützlich, wenn Kreatinin schwer zu deuten ist, weil sich die Muskelmasse ändert. Daten unter HRT sind noch begrenzt, aber die Cystatin-C-Formel hängt kaum vom Geschlecht ab.'
		}
	},

	'egfr-cys-f': {
		cites: ['ckdepi2012'],
		en: {
			what: 'eGFR computed from cystatin C and age (CKD-EPI 2012). The female factor lowers the result by only about 7 percent.',
			why: 'A kidney estimate that is barely affected by muscle mass.'
		},
		de: {
			what: 'eGFR aus Cystatin C und Alter berechnet (CKD-EPI 2012). Der weibliche Faktor senkt das Ergebnis nur um etwa 7 Prozent.',
			why: 'Eine Nierenschätzung, die kaum von der Muskelmasse beeinflusst wird.'
		}
	},

	'egfr-cys-m': {
		cites: ['ckdepi2012'],
		en: {
			what: 'eGFR computed from cystatin C and age (CKD-EPI 2012) with the male coefficient.',
			why: 'A kidney estimate that is barely affected by muscle mass.'
		},
		de: {
			what: 'eGFR aus Cystatin C und Alter berechnet (CKD-EPI 2012), mit dem männlichen Koeffizienten.',
			why: 'Eine Nierenschätzung, die kaum von der Muskelmasse beeinflusst wird.'
		}
	},

	urea: {
		en: {
			what: 'The waste product of protein breakdown, made in the liver and cleared by the kidneys.',
			why: 'Kidney function and hydration, read together with creatinine.',
			high: 'Dehydration, a high protein diet, reduced kidney function, bleeding in the stomach or gut, cortisone.',
			low: 'Low protein intake, severe liver disease, drinking a lot, pregnancy.',
			note: 'Not the same as urea nitrogen (BUN), which US labs report: urea = BUN × 2.14.'
		},
		de: {
			what: 'Das Abbauprodukt von Eiweiß, gebildet in der Leber und über die Nieren ausgeschieden.',
			why: 'Nierenfunktion und Flüssigkeitshaushalt, zusammen mit Kreatinin gelesen.',
			high: 'Flüssigkeitsmangel, eiweißreiche Ernährung, verminderte Nierenfunktion, Blutungen in Magen oder Darm, Kortison.',
			low: 'Geringe Eiweißaufnahme, schwere Lebererkrankung, viel Trinken, Schwangerschaft.',
			note: 'Nicht dasselbe wie Harnstoff-Stickstoff (BUN), den US-Labore angeben: Harnstoff = BUN × 2,14.'
		}
	},

	'uric-acid': {
		cites: ['vaneeghen2026-ua', 'roche-ua'],
		en: {
			what: 'The end product of purine breakdown, from the body\'s own cells and from food such as meat, offal, seafood, beer and fructose.',
			why: 'High levels can crystallise in joints and kidneys and cause gout and kidney stones.',
			high: 'A purine rich diet, alcohol (beer most), sugary drinks, dehydration, reduced kidney function, some diuretics, rapid weight loss.',
			low: 'Rarely meaningful. Some drugs lower it.',
			fem: 'Estrogen helps the kidneys excrete uric acid, one reason cis women before menopause have lower levels. In a Dutch cohort it fell by about 1.4 mg/dl (86 µmol/l) on estradiol (van Eeghen 2026).',
			masc: 'Rises toward the cis male range on testosterone, in a Dutch cohort by about 1.0 mg/dl (61 µmol/l) (van Eeghen 2026).',
			note: 'Conversion: 1 mg/dl = 59.48 µmol/l.'
		},
		de: {
			what: 'Das Endprodukt des Purinabbaus, aus körpereigenen Zellen und aus Nahrung wie Fleisch, Innereien, Meeresfrüchten, Bier und Fruchtzucker.',
			why: 'Hohe Spiegel können in Gelenken und Nieren auskristallisieren und Gicht und Nierensteine verursachen.',
			high: 'Purinreiche Ernährung, Alkohol (vor allem Bier), gezuckerte Getränke, Flüssigkeitsmangel, verminderte Nierenfunktion, manche Entwässerungsmittel, schnelle Gewichtsabnahme.',
			low: 'Selten von Bedeutung. Manche Medikamente senken sie.',
			fem: 'Östrogen hilft den Nieren, Harnsäure auszuscheiden, ein Grund, warum cis Frauen vor den Wechseljahren niedrigere Werte haben. In einer niederländischen Kohorte sank sie unter Östradiol um etwa 1,4 mg/dl (86 µmol/l) (van Eeghen 2026).',
			masc: 'Steigt unter Testosteron in Richtung des cis männlichen Bereichs, in einer niederländischen Kohorte um etwa 1,0 mg/dl (61 µmol/l) (van Eeghen 2026).',
			note: 'Umrechnung: 1 mg/dl = 59,48 µmol/l.'
		}
	},

	alt: {
		cites: ['sp-alt', 'pettersson2008', 'boekhout2023', 'wpath8'],
		en: {
			what: 'An enzyme found mainly inside liver cells. It leaks into the blood when they are damaged.',
			why: 'The most liver specific routine marker, used to screen for liver damage and to monitor drugs that can harm the liver.',
			high: 'Fatty liver, alcohol, medications and supplements, viral hepatitis, hard exercise in the days before the draw, rarely other liver diseases.',
			low: 'Not meaningful.',
			more: 'The most common causes of a mildly raised ALT are fatty liver linked to overweight and insulin resistance (MASLD) and alcohol. Many medications, herbal and bodybuilding supplements and viral hepatitis follow. Much higher values, many times the upper limit, point to acute damage from a virus, a drug overdose such as paracetamol, or poor blood flow to the liver.\n\nALT also sits in muscle in small amounts. Strenuous exercise, especially weight training, can raise ALT and AST for a week or longer (Pettersson 2008), so a surprising value after hard training is worth repeating after a quiet week. Upper limits differ between labs and are lower for women.',
			...LIVER_FALLS.en
		},
		de: {
			what: 'Ein Enzym, das vor allem in Leberzellen sitzt. Es gelangt ins Blut, wenn sie geschädigt werden.',
			why: 'Der leberspezifischste Routinemarker, genutzt als Suchtest auf Leberschäden und zur Kontrolle von Medikamenten, die der Leber schaden können.',
			high: 'Fettleber, Alkohol, Medikamente und Nahrungsergänzungsmittel, Virushepatitis, harter Sport in den Tagen vor der Abnahme, selten andere Lebererkrankungen.',
			low: 'Ohne Bedeutung.',
			more: 'Die häufigsten Ursachen eines leicht erhöhten ALT sind eine Fettleber im Zusammenhang mit Übergewicht und Insulinresistenz (MASLD) und Alkohol. Danach folgen viele Medikamente, pflanzliche Präparate und Bodybuilding-Mittel und Virushepatitis. Viel höhere Werte, ein Vielfaches der Obergrenze, weisen auf einen akuten Schaden durch ein Virus, eine Überdosis wie Paracetamol oder eine Minderdurchblutung der Leber hin.\n\nALT steckt in kleinen Mengen auch im Muskel. Harter Sport, besonders Krafttraining, kann ALT und AST für eine Woche oder länger erhöhen (Pettersson 2008), ein überraschender Wert nach hartem Training ist daher eine Wiederholung nach einer ruhigen Woche wert. Die Obergrenzen unterscheiden sich zwischen Laboren und sind für Frauen niedriger.',
			...LIVER_FALLS.de
		}
	},

	ast: {
		cites: ['boekhout2023', 'wpath8'],
		en: {
			what: 'An enzyme in liver, heart and skeletal muscle, so less liver specific than ALT.',
			why: 'Read together with ALT. AST clearly above ALT points more toward muscle, alcohol or advanced liver scarring.',
			high: 'Liver damage, muscle strain or injury including hard exercise, alcohol, a sample with burst red cells.',
			low: 'Not meaningful.',
			...LIVER_FALLS.en
		},
		de: {
			what: 'Ein Enzym in Leber, Herz und Skelettmuskel, daher weniger leberspezifisch als ALT.',
			why: 'Zusammen mit ALT gelesen. AST deutlich über ALT spricht eher für Muskel, Alkohol oder eine fortgeschrittene Vernarbung der Leber.',
			high: 'Leberschäden, Muskelbelastung oder Verletzung einschließlich harten Sports, Alkohol, eine Probe mit geplatzten roten Blutkörperchen.',
			low: 'Ohne Bedeutung.',
			...LIVER_FALLS.de
		}
	},

	ggt: {
		cites: ['boekhout2023', 'humble2022', 'wpath8'],
		en: {
			what: 'An enzyme of the bile ducts and liver.',
			why: 'Very sensitive to alcohol and to problems with bile flow. Helps tell whether a high ALP comes from the liver or from bone.',
			high: 'Alcohol, fatty liver, bile duct problems, enzyme inducing drugs such as some antiepileptics.',
			low: 'Not meaningful.',
			...LIVER_GGT.en
		},
		de: {
			what: 'Ein Enzym der Gallenwege und der Leber.',
			why: 'Sehr empfindlich für Alkohol und Probleme mit dem Gallenfluss. Hilft zu klären, ob ein hohes ALP aus der Leber oder aus dem Knochen stammt.',
			high: 'Alkohol, Fettleber, Probleme der Gallenwege, enzyminduzierende Medikamente wie manche Antiepileptika.',
			low: 'Ohne Bedeutung.',
			...LIVER_GGT.de
		}
	},

	alp: {
		cites: ['boekhout2023', 'roche-alp'],
		en: {
			what: 'An enzyme mainly from bone and bile ducts.',
			why: 'Shows bile flow and bone turnover. With a high ALP, GGT tells whether it comes from the liver or from bone.',
			high: 'Growth in teenagers, bone remodelling after a fracture, vitamin D deficiency, bile duct problems, pregnancy (from the placenta).',
			low: 'Rarely meaningful. Very low values occur in a rare inherited bone disorder.',
			fem: 'Estrogen slows bone turnover, so ALP often drifts down on HRT (Boekhout-Berends 2023).',
			masc: 'Tends to rise slightly toward the cis male range (Boekhout-Berends 2023).'
		},
		de: {
			what: 'Ein Enzym vor allem aus Knochen und Gallenwegen.',
			why: 'Zeigt Gallenfluss und Knochenumbau. Bei hohem ALP klärt GGT, ob es aus der Leber oder aus dem Knochen stammt.',
			high: 'Wachstum bei Jugendlichen, Knochenumbau nach einem Bruch, Vitamin-D-Mangel, Probleme der Gallenwege, Schwangerschaft (aus der Plazenta).',
			low: 'Selten von Bedeutung. Sehr niedrige Werte kommen bei einer seltenen erblichen Knochenerkrankung vor.',
			fem: 'Östrogen bremst den Knochenumbau, ALP sinkt unter HRT daher oft etwas (Boekhout-Berends 2023).',
			masc: 'Steigt eher leicht in Richtung des cis männlichen Bereichs (Boekhout-Berends 2023).'
		}
	},

	bilirubin: {
		en: {
			what: 'The yellow breakdown product of haemoglobin, processed and cleared by the liver.',
			why: 'Liver function, bile flow and red cell breakdown. Yellow skin or eyes appear at high levels.',
			high: 'Gilbert syndrome (harmless and common, rises with fasting or illness), liver or bile duct problems, increased red cell breakdown.',
			low: 'Not meaningful.'
		},
		de: {
			what: 'Das gelbe Abbauprodukt des Hämoglobins, das die Leber verarbeitet und ausscheidet.',
			why: 'Leberfunktion, Gallenfluss und Abbau roter Blutkörperchen. Bei hohen Werten werden Haut oder Augen gelb.',
			high: 'Morbus Meulengracht (harmlos und häufig, steigt bei Fasten oder Krankheit), Probleme von Leber oder Gallenwegen, vermehrter Abbau roter Blutkörperchen.',
			low: 'Ohne Bedeutung.'
		}
	},

	albumin: {
		en: {
			what: 'The most abundant blood protein, made by the liver. It holds water in the vessels and carries hormones, calcium and drugs.',
			why: 'Liver synthesis and nutrition. Also used to correct calcium and to calculate free testosterone.',
			high: 'Dehydration.',
			low: 'Inflammation, liver disease, protein loss through kidneys or gut, malnutrition, pregnancy.'
		},
		de: {
			what: 'Das häufigste Bluteiweiß, gebildet in der Leber. Es hält Wasser in den Gefäßen und transportiert Hormone, Calcium und Medikamente.',
			why: 'Syntheseleistung der Leber und Ernährungszustand. Außerdem genutzt, um Calcium zu korrigieren und freies Testosteron zu berechnen.',
			high: 'Flüssigkeitsmangel.',
			low: 'Entzündung, Lebererkrankung, Eiweißverlust über Nieren oder Darm, Mangelernährung, Schwangerschaft.'
		}
	},

	'total-protein': {
		en: {
			what: 'All proteins in serum, mostly albumin and antibodies.',
			why: 'Nutrition, liver synthesis and immune proteins.',
			high: 'Dehydration, chronic inflammation, rarely abnormal antibody production by a bone marrow disorder.',
			low: 'Malnutrition, liver disease, protein loss through kidneys or gut.'
		},
		de: {
			what: 'Alle Eiweiße im Serum, vor allem Albumin und Antikörper.',
			why: 'Ernährungszustand, Syntheseleistung der Leber und Immuneiweiße.',
			high: 'Flüssigkeitsmangel, chronische Entzündung, selten eine krankhafte Antikörperbildung bei einer Knochenmarkerkrankung.',
			low: 'Mangelernährung, Lebererkrankung, Eiweißverlust über Nieren oder Darm.'
		}
	},

	amylase: {
		en: {
			what: 'A starch digesting enzyme from the pancreas and the salivary glands.',
			why: 'Screens for pancreatitis, although lipase is more specific.',
			high: 'Pancreatitis, salivary gland problems, reduced kidney clearance, macroamylase (harmless).',
			low: 'Rarely meaningful.'
		},
		de: {
			what: 'Ein stärkespaltendes Enzym aus Bauchspeicheldrüse und Speicheldrüsen.',
			why: 'Suchtest auf eine Bauchspeicheldrüsenentzündung, Lipase ist allerdings spezifischer.',
			high: 'Bauchspeicheldrüsenentzündung, Probleme der Speicheldrüsen, verminderte Ausscheidung über die Nieren, Makroamylase (harmlos).',
			low: 'Selten von Bedeutung.'
		}
	},

	lipase: {
		en: {
			what: 'A fat digesting enzyme, almost only from the pancreas.',
			why: 'The preferred test for pancreatitis.',
			high: 'Pancreatitis, usually above three times the upper limit, reduced kidney clearance, some other abdominal conditions. Mild rises without symptoms are often harmless.',
			low: 'Not meaningful.'
		},
		de: {
			what: 'Ein fettspaltendes Enzym, fast nur aus der Bauchspeicheldrüse.',
			why: 'Der bevorzugte Test bei Verdacht auf eine Bauchspeicheldrüsenentzündung.',
			high: 'Bauchspeicheldrüsenentzündung, meist über dem Dreifachen der Obergrenze, verminderte Ausscheidung über die Nieren, manche anderen Baucherkrankungen. Leichte Anstiege ohne Beschwerden sind oft harmlos.',
			low: 'Ohne Bedeutung.'
		}
	}
};
