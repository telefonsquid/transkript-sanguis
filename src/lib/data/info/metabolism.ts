import type { AnalyteInfo, InfoEntry, Lang } from '../types';

type Texts = Record<Lang, Partial<AnalyteInfo>>;

// Shared by the cholesterol and triglyceride values
const LIPIDS_HRT: Texts = {
	en: {
		fem: 'In a meta-analysis only triglycerides rose clearly in trans women after two years or more, by about 32 mg/dl, while LDL and HDL did not change significantly (Maraka 2017). The rise comes mainly from oral estrogen, which passes the liver first. Cyproterone acetate can lower HDL (WPATH). Overall the changes are small next to the effect of genes, weight, smoking and exercise.',
		masc: 'Testosterone moves the lipid profile toward the cis male pattern. After two years or more a meta-analysis found LDL about 18 mg/dl higher, triglycerides about 21 mg/dl higher and HDL about 8.5 mg/dl lower (Maraka 2017).'
	},
	de: {
		fem: 'In einer Metaanalyse stiegen bei trans Frauen nach zwei Jahren oder mehr nur die Triglyceride deutlich, um etwa 32 mg/dl, LDL und HDL änderten sich nicht signifikant (Maraka 2017). Der Anstieg kommt vor allem von oralem Östrogen, das zuerst die Leber passiert. Cyproteronacetat kann HDL senken (WPATH). Insgesamt sind die Änderungen klein im Vergleich zum Einfluss von Genen, Gewicht, Rauchen und Bewegung.',
		masc: 'Testosteron verschiebt das Fettprofil in Richtung des cis männlichen Musters. Nach zwei Jahren oder mehr fand eine Metaanalyse LDL etwa 18 mg/dl höher, Triglyceride etwa 21 mg/dl höher und HDL etwa 8,5 mg/dl niedriger (Maraka 2017).'
	}
};

// Shared by glucose, insulin and HOMA-IR
const SUGAR_HRT: Texts = {
	en: {
		fem: 'Studies disagree. After a year of estradiol with cyproterone acetate, insulin sensitivity tended to fall as fat mass rose (Shadid 2020). After three months of estradiol with a GnRH analogue it rose by about 23 percent in clamp measurements, the most exact method (van Eeghen 2026). Fasting glucose barely changes either way.',
		masc: 'After a year of testosterone insulin sensitivity tended to rise along with muscle mass (Shadid 2020). A study with clamp measurements found no clear change after three months (van Eeghen 2026). Weight gain works the other way.'
	},
	de: {
		fem: 'Die Studien sind sich uneinig. Nach einem Jahr Östradiol mit Cyproteronacetat sank die Insulinempfindlichkeit eher, während die Fettmasse zunahm (Shadid 2020). Nach drei Monaten Östradiol mit einem GnRH-Analogon stieg sie in Clamp-Messungen, der genauesten Methode, um etwa 23 Prozent (van Eeghen 2026). Der Nüchternzucker ändert sich in beiden Fällen kaum.',
		masc: 'Nach einem Jahr Testosteron stieg die Insulinempfindlichkeit eher, zusammen mit der Muskelmasse (Shadid 2020). Eine Studie mit Clamp-Messungen fand nach drei Monaten keine klare Änderung (van Eeghen 2026). Gewichtszunahme wirkt in die andere Richtung.'
	}
};

export const metabolism: Record<string, InfoEntry> = {
	cholesterol: {
		cites: ['esc2019', 'maraka2017', 'wpath8'],
		en: {
			what: 'All cholesterol in the blood: the cholesterol in LDL, in HDL and in triglyceride rich particles.',
			why: 'A screening value. Cardiovascular risk is judged on LDL, non-HDL and ApoB rather than on the total, because a high HDL also raises the total.',
			high: 'Genes, a diet rich in saturated fat, an underactive thyroid, kidney or liver conditions, pregnancy.',
			low: 'Rarely meaningful. Also seen with an overactive thyroid, malnutrition or lipid lowering drugs.',
			...LIPIDS_HRT.en
		},
		de: {
			what: 'Das gesamte Cholesterin im Blut: das Cholesterin in LDL, in HDL und in triglyceridreichen Partikeln.',
			why: 'Ein Suchwert. Das Herz-Kreislauf-Risiko wird eher an LDL, Non-HDL und ApoB beurteilt als am Gesamtwert, weil auch ein hohes HDL den Gesamtwert erhöht.',
			high: 'Veranlagung, Ernährung reich an gesättigten Fetten, Schilddrüsenunterfunktion, Nieren- oder Lebererkrankungen, Schwangerschaft.',
			low: 'Selten von Bedeutung. Auch bei Schilddrüsenüberfunktion, Mangelernährung oder Lipidsenkern.',
			...LIPIDS_HRT.de
		}
	},

	hdl: {
		cites: ['esc2019', 'maraka2017', 'wpath8'],
		en: {
			what: 'Cholesterol carried back from the tissues to the liver, often called the "good" cholesterol.',
			why: 'A low HDL marks higher cardiovascular risk. Raising HDL with drugs has not lowered that risk, so it is a marker rather than a target.',
			high: 'Genes, exercise, moderate alcohol, estrogen. Very high values do not protect further.',
			low: 'Smoking, inactivity, overweight and insulin resistance, high triglycerides, androgens.',
			...LIPIDS_HRT.en
		},
		de: {
			what: 'Cholesterin, das aus den Geweben zurück zur Leber transportiert wird, oft das "gute" Cholesterin genannt.',
			why: 'Ein niedriges HDL zeigt ein höheres Herz-Kreislauf-Risiko an. HDL mit Medikamenten zu erhöhen hat dieses Risiko nicht gesenkt, es ist daher ein Marker und kein Ziel.',
			high: 'Veranlagung, Bewegung, mäßiger Alkoholkonsum, Östrogen. Sehr hohe Werte schützen nicht zusätzlich.',
			low: 'Rauchen, Bewegungsmangel, Übergewicht und Insulinresistenz, hohe Triglyceride, Androgene.',
			...LIPIDS_HRT.de
		}
	},

	ldl: {
		cites: ['esc2019', 'maraka2017', 'wpath8'],
		en: {
			what: 'Cholesterol carried from the liver to the tissues. These particles build up in artery walls.',
			why: 'The main treatable cardiovascular risk factor. The goal depends on overall risk, not on a fixed normal range.',
			high: 'Genes (familial hypercholesterolaemia), a diet rich in saturated fat, an underactive thyroid, kidney disease, some drugs.',
			low: 'Not a concern.',
			more: 'LDL particles that slip into the artery wall get stuck there and start plaques. The longer and the higher LDL is raised, the more plaque builds up, so both the level and the years count. Lowering LDL lowers the risk of heart attack and stroke in proportion to how far it falls.\n\nThat is why there is no single normal range. European guidelines set goals by overall risk, which depends on age, blood pressure, smoking, diabetes, kidney function and family history: below 116 mg/dl at low risk, below 100 at moderate, below 70 at high and below 55 mg/dl at very high risk (ESC/EAS 2019).\n\nAbout 1 in 250 people have familial hypercholesterolaemia, an inherited condition that raises LDL from birth, in adults often above 190 mg/dl. Many labs calculate LDL from total cholesterol, HDL and triglycerides, which gets unreliable when triglycerides are high. Non-HDL or ApoB then say more.',
			...LIPIDS_HRT.en,
			note: 'Conversion: 1 mg/dl = 0.02586 mmol/l.'
		},
		de: {
			what: 'Cholesterin, das von der Leber zu den Geweben transportiert wird. Diese Partikel lagern sich in Gefäßwänden ab.',
			why: 'Der wichtigste behandelbare Risikofaktor für Herz und Gefäße. Das Ziel hängt vom Gesamtrisiko ab, nicht von einem festen Normalbereich.',
			high: 'Veranlagung (familiäre Hypercholesterinämie), Ernährung reich an gesättigten Fetten, Schilddrüsenunterfunktion, Nierenerkrankung, manche Medikamente.',
			low: 'Unbedenklich.',
			more: 'LDL-Partikel, die in die Gefäßwand gelangen, bleiben dort hängen und beginnen Plaques. Je länger und je höher LDL erhöht ist, desto mehr Plaque entsteht, es zählen also Höhe und Jahre. LDL zu senken senkt das Risiko für Herzinfarkt und Schlaganfall im Verhältnis dazu, wie weit es fällt.\n\nDeshalb gibt es keinen einzelnen Normalbereich. Europäische Leitlinien setzen Ziele nach dem Gesamtrisiko, das von Alter, Blutdruck, Rauchen, Diabetes, Nierenfunktion und Familiengeschichte abhängt: unter 116 mg/dl bei niedrigem, unter 100 bei mittlerem, unter 70 bei hohem und unter 55 mg/dl bei sehr hohem Risiko (ESC/EAS 2019).\n\nEtwa 1 von 250 Menschen hat eine familiäre Hypercholesterinämie, eine erbliche Störung, die LDL von Geburt an erhöht, bei Erwachsenen oft über 190 mg/dl. Viele Labore berechnen LDL aus Gesamtcholesterin, HDL und Triglyceriden, das wird bei hohen Triglyceriden unzuverlässig. Dann sagen Non-HDL oder ApoB mehr.',
			...LIPIDS_HRT.de,
			note: 'Umrechnung: 1 mg/dl = 0,02586 mmol/l.'
		}
	},

	'non-hdl': {
		cites: ['esc2019'],
		en: {
			what: 'Total cholesterol minus HDL: the cholesterol in every particle that can build up in arteries.',
			why: 'Also captures the risk from triglyceride rich particles that LDL misses, and works without fasting. The goal lies 30 mg/dl above the LDL goal.',
			high: 'The same causes as a high LDL, plus high triglycerides.'
		},
		de: {
			what: 'Gesamtcholesterin minus HDL: das Cholesterin in allen Partikeln, die sich in Gefäßen ablagern können.',
			why: 'Erfasst auch das Risiko triglyceridreicher Partikel, die LDL übersieht, und funktioniert ohne Nüchternheit. Das Ziel liegt 30 mg/dl über dem LDL-Ziel.',
			high: 'Die gleichen Ursachen wie ein hohes LDL, dazu hohe Triglyceride.'
		}
	},

	'ldl-hdl': {
		cites: ['millan2009'],
		en: {
			what: 'LDL divided by HDL.',
			why: 'An older way to sum up lipid risk in one number. Current guidelines use goals for LDL, non-HDL and ApoB instead.'
		},
		de: {
			what: 'LDL geteilt durch HDL.',
			why: 'Ein älterer Weg, das Fettrisiko in einer Zahl zusammenzufassen. Aktuelle Leitlinien nutzen stattdessen Ziele für LDL, Non-HDL und ApoB.'
		}
	},

	triglycerides: {
		cites: ['sp-tg', 'esc2019', 'maraka2017', 'wpath8'],
		en: {
			what: 'Blood fats from food and from the liver, the body\'s way to carry energy to muscle and fat tissue.',
			why: 'A marker of cardiovascular and metabolic risk. Very high levels can trigger pancreatitis.',
			high: 'A meal in the hours before the draw, alcohol, sugar, overweight and insulin resistance, poorly controlled diabetes, an underactive thyroid, oral estrogen, genes.',
			low: 'Not a concern.',
			more: 'After a meal triglycerides rise for several hours, which is why they used to be measured fasting. A fasting value of 150 mg/dl (1.7 mmol/l) or more counts as raised. The particles that carry them leave cholesterol in the artery wall, so a raised value adds to cardiovascular risk, and it often travels with insulin resistance, fatty liver and low HDL.\n\nThe risk of pancreatitis rises markedly above about 500 mg/dl (5.6 mmol/l) and becomes clinically significant above 880 mg/dl (10 mmol/l) (ESC/EAS 2019). Such values usually come from genes combined with alcohol, uncontrolled diabetes or drugs. Weight loss, less alcohol and sugar, and exercise lower triglycerides more than they lower LDL.',
			...LIPIDS_HRT.en,
			note: 'Swings a lot with the last meal. Only fasting values compare well. 1 mg/dl = 0.01129 mmol/l.'
		},
		de: {
			what: 'Blutfette aus der Nahrung und aus der Leber, die Energie zu Muskeln und Fettgewebe transportieren.',
			why: 'Ein Marker für Herz-Kreislauf- und Stoffwechselrisiko. Sehr hohe Werte können eine Bauchspeicheldrüsenentzündung auslösen.',
			high: 'Eine Mahlzeit in den Stunden vor der Abnahme, Alkohol, Zucker, Übergewicht und Insulinresistenz, schlecht eingestellter Diabetes, Schilddrüsenunterfunktion, orales Östrogen, Veranlagung.',
			low: 'Unbedenklich.',
			more: 'Nach einer Mahlzeit steigen die Triglyceride für mehrere Stunden, deshalb wurden sie früher nüchtern gemessen. Ein Nüchternwert ab 150 mg/dl (1,7 mmol/l) gilt als erhöht. Die Partikel, die sie transportieren, hinterlassen Cholesterin in der Gefäßwand, ein erhöhter Wert trägt daher zum Herz-Kreislauf-Risiko bei, und er tritt oft zusammen mit Insulinresistenz, Fettleber und niedrigem HDL auf.\n\nDas Risiko einer Bauchspeicheldrüsenentzündung steigt über etwa 500 mg/dl (5,6 mmol/l) deutlich und wird über 880 mg/dl (10 mmol/l) klinisch bedeutsam (ESC/EAS 2019). Solche Werte entstehen meist aus Veranlagung zusammen mit Alkohol, unkontrolliertem Diabetes oder Medikamenten. Gewichtsabnahme, weniger Alkohol und Zucker und Bewegung senken Triglyceride stärker als LDL.',
			...LIPIDS_HRT.de,
			note: 'Schwankt stark mit der letzten Mahlzeit. Nur nüchterne Werte sind gut vergleichbar. 1 mg/dl = 0,01129 mmol/l.'
		}
	},

	apob: {
		cites: ['sp-apob', 'esc2019'],
		en: {
			what: 'The protein on every particle that can build up in arteries, exactly one per particle.',
			why: 'Counts atherogenic particles directly. Often the best single lipid risk marker, especially with high triglycerides, diabetes or overweight.',
			high: 'Many atherogenic particles, even when LDL looks acceptable.',
			low: 'Not a concern.',
			more: 'LDL cholesterol measures how much cholesterol the particles carry, ApoB how many particles there are. Usually both agree. With high triglycerides, insulin resistance or diabetes the particles are often small and poor in cholesterol, so LDL looks fine while many particles circulate. It is the number of particles that drives plaque, so ApoB then reflects the risk better.\n\nThe ESC/EAS 2019 goals are below 100 mg/dl at moderate, below 80 at high and below 65 mg/dl at very high risk. ApoB can be measured without fasting.'
		},
		de: {
			what: 'Das Eiweiß auf jedem Partikel, das sich in Gefäßen ablagern kann, genau eines pro Partikel.',
			why: 'Zählt die gefäßschädigenden Partikel direkt. Oft der beste einzelne Fett-Risikomarker, besonders bei hohen Triglyceriden, Diabetes oder Übergewicht.',
			high: 'Viele gefäßschädigende Partikel, auch wenn LDL unauffällig wirkt.',
			low: 'Unbedenklich.',
			more: 'LDL-Cholesterin misst, wie viel Cholesterin die Partikel tragen, ApoB, wie viele Partikel es gibt. Meist stimmen beide überein. Bei hohen Triglyceriden, Insulinresistenz oder Diabetes sind die Partikel oft klein und cholesterinarm, LDL wirkt dann unauffällig, obwohl viele Partikel zirkulieren. Die Zahl der Partikel treibt die Plaquebildung, ApoB spiegelt das Risiko dann besser.\n\nDie Ziele nach ESC/EAS 2019 liegen unter 100 mg/dl bei mittlerem, unter 80 bei hohem und unter 65 mg/dl bei sehr hohem Risiko. ApoB lässt sich ohne Nüchternheit messen.'
		}
	},

	lpa: {
		cites: ['eas2022', 'sp-lpa', 'michos2026'],
		en: {
			what: 'An LDL like particle with an extra protein attached. Its level is set almost entirely by genes.',
			why: 'An independent cardiovascular risk factor that the usual lipid values do not show. Guidelines suggest measuring it at least once in adulthood.',
			high: 'Inherited. Raises the risk of heart attack, stroke and narrowing of the aortic valve.',
			low: 'Not a concern.',
			more: 'Lp(a) combines the harm of LDL with a tendency to promote inflammation and clotting. Its level is fixed by the LPA gene and stays about the same through life, so one measurement is usually enough. Diet and exercise barely change it and statins do not lower it.\n\nThe EAS 2022 consensus calls a risk unlikely below 30 mg/dl (75 nmol/l) and raised above 50 mg/dl (125 nmol/l), with a grey zone in between. About one in five people lies above 50 mg/dl. The risk rises steadily with the level, so very high values matter more than values just above the line.\n\nThere is no approved drug that lowers Lp(a) yet, several are in trials. A high value is a reason to control everything else more strictly: LDL, blood pressure, smoking, weight. It is also worth testing close relatives.',
			fem: 'Estrogen lowers Lp(a): in trials with postmenopausal women by about 20 percent on average (Michos 2026). Few studies have looked at trans women, and HRT is not a treatment for high Lp(a).',
			masc: 'Few studies have looked at Lp(a) on testosterone (Michos 2026). Since the level is inherited, the value before HRT stays a useful reference.',
			note: 'Mass (mg/dl) and particle count (nmol/l) cannot be converted exactly, so they are kept as two series.'
		},
		de: {
			what: 'Ein LDL-ähnliches Partikel mit einem zusätzlich angehängten Eiweiß. Sein Spiegel ist fast vollständig genetisch festgelegt.',
			why: 'Ein eigenständiger Risikofaktor für Herz und Gefäße, den die üblichen Fettwerte nicht zeigen. Leitlinien empfehlen, es mindestens einmal im Erwachsenenalter zu messen.',
			high: 'Vererbt. Erhöht das Risiko für Herzinfarkt, Schlaganfall und eine Verengung der Aortenklappe.',
			low: 'Unbedenklich.',
			more: 'Lp(a) verbindet den Schaden von LDL mit einer Neigung, Entzündung und Gerinnung zu fördern. Sein Spiegel wird vom LPA-Gen festgelegt und bleibt über das Leben etwa gleich, eine Messung reicht daher meist. Ernährung und Bewegung ändern ihn kaum, Statine senken ihn nicht.\n\nDer EAS-Konsens von 2022 hält ein Risiko unter 30 mg/dl (75 nmol/l) für unwahrscheinlich und über 50 mg/dl (125 nmol/l) für erhöht, dazwischen liegt eine Grauzone. Etwa jeder fünfte Mensch liegt über 50 mg/dl. Das Risiko steigt stetig mit dem Wert, sehr hohe Werte zählen daher mehr als Werte knapp über der Grenze.\n\nEs gibt noch kein zugelassenes Medikament, das Lp(a) senkt, mehrere werden erprobt. Ein hoher Wert ist ein Grund, alles andere strenger einzustellen: LDL, Blutdruck, Rauchen, Gewicht. Es lohnt sich auch, nahe Verwandte zu testen.',
			fem: 'Östrogen senkt Lp(a): in Studien mit Frauen nach den Wechseljahren im Mittel um etwa 20 Prozent (Michos 2026). Bei trans Frauen gibt es kaum Studien, und HRT ist keine Behandlung für ein hohes Lp(a).',
			masc: 'Zu Lp(a) unter Testosteron gibt es kaum Studien (Michos 2026). Da der Wert vererbt ist, bleibt der Wert vor der HRT eine nützliche Referenz.',
			note: 'Masse (mg/dl) und Partikelzahl (nmol/l) lassen sich nicht genau umrechnen, daher zwei getrennte Reihen.'
		}
	},

	'lpa-molar': {
		cites: ['eas2022'],
		en: {
			what: 'Lipoprotein(a) counted as particles rather than weighed.',
			why: 'The unit most guidelines now prefer, because it does not depend on the particle size, which varies from person to person.',
			high: 'Inherited. Raises the risk of heart attack, stroke and narrowing of the aortic valve. Above 125 nmol/l counts as raised (EAS 2022).'
		},
		de: {
			what: 'Lipoprotein(a) als Partikelzahl statt als Masse.',
			why: 'Die Einheit, die die meisten Leitlinien inzwischen bevorzugen, weil sie nicht von der Partikelgröße abhängt, die von Mensch zu Mensch schwankt.',
			high: 'Vererbt. Erhöht das Risiko für Herzinfarkt, Schlaganfall und eine Verengung der Aortenklappe. Über 125 nmol/l gilt als erhöht (EAS 2022).'
		}
	},

	glucose: {
		cites: ['ada2025', 'shadid2020', 'vaneeghen2026-ins'],
		en: {
			what: 'Blood sugar at the moment of the draw.',
			why: 'Screens for diabetes and prediabetes, but only a fasting value can be judged against the thresholds.',
			high: 'A recent meal, stress or acute illness, cortisone, prediabetes or diabetes.',
			low: 'Long fasting, some diabetes drugs, or sugar used up in a tube without a glycolysis inhibitor.',
			more: 'After at least eight hours without food, a glucose of 100 to 125 mg/dl counts as prediabetes and 126 mg/dl or more as diabetes, confirmed by a second test (ADA 2025). A value of 200 mg/dl or more at any time with typical symptoms such as thirst and frequent urination is enough on its own.\n\nBlood cells keep using up sugar in the tube, by several percent per hour, so a sample that waits long before it is spun reads too low. Tubes with a glycolysis inhibitor, ideally citrate with fluoride, prevent this. An oral glucose tolerance test or HbA1c can confirm borderline values.',
			...SUGAR_HRT.en,
			note: 'Conversion: 1 mg/dl = 0.0555 mmol/l.'
		},
		de: {
			what: 'Der Blutzucker zum Zeitpunkt der Abnahme.',
			why: 'Suchtest auf Diabetes und eine Vorstufe, aber nur ein Nüchternwert lässt sich an den Grenzwerten messen.',
			high: 'Eine kürzliche Mahlzeit, Stress oder akute Krankheit, Kortison, eine Diabetes-Vorstufe oder Diabetes.',
			low: 'Langes Fasten, manche Diabetesmedikamente oder Zuckerabbau in einem Röhrchen ohne Glykolysehemmer.',
			more: 'Nach mindestens acht Stunden ohne Essen gilt ein Zucker von 100 bis 125 mg/dl als Vorstufe und ab 126 mg/dl als Diabetes, bestätigt durch einen zweiten Test (ADA 2025). Ein Wert ab 200 mg/dl zu beliebiger Zeit mit typischen Beschwerden wie Durst und häufigem Wasserlassen reicht allein.\n\nBlutzellen verbrauchen im Röhrchen weiter Zucker, um einige Prozent pro Stunde, eine Probe, die lange wartet, bevor sie zentrifugiert wird, misst daher zu niedrig. Röhrchen mit einem Glykolysehemmer, am besten Citrat mit Fluorid, verhindern das. Ein oraler Zuckerbelastungstest oder HbA1c können grenzwertige Werte bestätigen.',
			...SUGAR_HRT.de,
			note: 'Umrechnung: 1 mg/dl = 0,0555 mmol/l.'
		}
	},

	hba1c: {
		cites: ['sp-hba1c', 'ada2025'],
		en: {
			what: 'The share of haemoglobin with sugar attached. Reflects the average blood sugar over about three months.',
			why: 'Diagnoses and tracks diabetes without fasting.',
			high: 'A higher average blood sugar. Also iron deficiency and anything else that makes red cells live longer.',
			low: 'Anything that shortens red cell lifespan: blood loss, haemolysis, a recent transfusion, pregnancy.',
			more: 'Sugar attaches to haemoglobin slowly and for good, so the share of sugared haemoglobin mirrors the blood sugar over the life of a red cell, about three months, weighted toward the last few weeks. An HbA1c of 5.7 to 6.4 percent counts as prediabetes and 6.5 percent or more as diabetes (ADA 2025).\n\nBecause it depends on red cells, anything that changes their lifespan shifts HbA1c without a change in blood sugar. Iron deficiency raises it, blood loss, haemolysis and pregnancy lower it. Some inherited haemoglobin variants disturb certain assays. When HbA1c and glucose disagree, these are the usual reasons.',
			note: 'The thresholds are the same for everyone, independent of sex and HRT.'
		},
		de: {
			what: 'Der Anteil des Hämoglobins mit angelagertem Zucker. Spiegelt den durchschnittlichen Blutzucker der letzten etwa drei Monate.',
			why: 'Stellt und verfolgt Diabetes ohne Nüchternheit.',
			high: 'Ein höherer durchschnittlicher Blutzucker. Auch Eisenmangel und alles andere, was rote Blutkörperchen länger leben lässt.',
			low: 'Alles, was die Lebensdauer roter Blutkörperchen verkürzt: Blutverlust, Hämolyse, eine kürzliche Transfusion, Schwangerschaft.',
			more: 'Zucker lagert sich langsam und dauerhaft an Hämoglobin an, der Anteil des verzuckerten Hämoglobins spiegelt daher den Blutzucker über die Lebensdauer eines roten Blutkörperchens, etwa drei Monate, mit stärkerem Gewicht auf den letzten Wochen. Ein HbA1c von 5,7 bis 6,4 Prozent gilt als Vorstufe und ab 6,5 Prozent als Diabetes (ADA 2025).\n\nWeil er von den roten Blutkörperchen abhängt, verschiebt alles, was deren Lebensdauer ändert, den HbA1c ohne Änderung des Blutzuckers. Eisenmangel erhöht ihn, Blutverlust, Hämolyse und Schwangerschaft senken ihn. Manche erblichen Hämoglobinvarianten stören bestimmte Messverfahren. Wenn HbA1c und Blutzucker nicht zusammenpassen, sind das die üblichen Gründe.',
			note: 'Die Grenzwerte sind für alle gleich, unabhängig von Geschlecht und HRT.'
		}
	},

	'hba1c-ifcc': {
		cites: ['ada2025'],
		en: {
			what: 'The same HbA1c in the international SI unit.',
			why: 'mmol/mol = (% − 2.15) × 10.929. Prediabetes starts at 39, diabetes at 48 mmol/mol.'
		},
		de: {
			what: 'Derselbe HbA1c in der internationalen SI-Einheit.',
			why: 'mmol/mol = (% − 2,15) × 10,929. Die Vorstufe beginnt bei 39, Diabetes bei 48 mmol/mol.'
		}
	},

	eag: {
		cites: ['nathan2008'],
		en: {
			what: 'HbA1c translated into an average blood sugar: 28.7 × HbA1c − 46.7.',
			why: 'Makes HbA1c easier to relate to glucose readings.'
		},
		de: {
			what: 'HbA1c umgerechnet in einen durchschnittlichen Blutzucker: 28,7 × HbA1c − 46,7.',
			why: 'Macht HbA1c mit Blutzuckermessungen vergleichbar.'
		}
	},

	insulin: {
		cites: ['roche-insulin', 'shadid2020', 'vaneeghen2026-ins'],
		en: {
			what: 'The hormone from the pancreas that moves sugar from the blood into cells.',
			why: 'A high fasting insulin with normal glucose shows insulin resistance years before diabetes develops.',
			high: 'Insulin resistance, overweight, a recent meal, some drugs such as cortisone.',
			low: 'Fasting, type 1 diabetes, late type 2 diabetes.',
			more: 'In insulin resistance muscle, liver and fat tissue respond less to insulin. The pancreas makes up for it by releasing more, so glucose stays normal for a long time while insulin rises. Only when the pancreas can no longer keep up does glucose climb into the prediabetes and diabetes range.\n\nInsulin resistance goes with belly fat, fatty liver, high triglycerides, low HDL and high blood pressure. Exercise and weight loss improve it quickly. There are no standard thresholds for insulin, assays differ, and a single value varies a lot, so the trend and HOMA-IR are more useful than one number.',
			...SUGAR_HRT.en,
			note: 'Only fasting values are meaningful.'
		},
		de: {
			what: 'Das Hormon aus der Bauchspeicheldrüse, das Zucker aus dem Blut in die Zellen bringt.',
			why: 'Ein hohes Nüchterninsulin bei normalem Zucker zeigt eine Insulinresistenz, Jahre bevor ein Diabetes entsteht.',
			high: 'Insulinresistenz, Übergewicht, eine kürzliche Mahlzeit, manche Medikamente wie Kortison.',
			low: 'Fasten, Typ-1-Diabetes, später Typ-2-Diabetes.',
			more: 'Bei einer Insulinresistenz sprechen Muskeln, Leber und Fettgewebe schwächer auf Insulin an. Die Bauchspeicheldrüse gleicht das aus, indem sie mehr ausschüttet, der Zucker bleibt daher lange normal, während das Insulin steigt. Erst wenn sie nicht mehr mithalten kann, steigt der Zucker in den Bereich der Vorstufe und des Diabetes.\n\nInsulinresistenz geht mit Bauchfett, Fettleber, hohen Triglyceriden, niedrigem HDL und hohem Blutdruck einher. Bewegung und Gewichtsabnahme verbessern sie schnell. Für Insulin gibt es keine einheitlichen Grenzwerte, die Messverfahren unterscheiden sich, und ein einzelner Wert schwankt stark, Verlauf und HOMA-IR sind daher nützlicher als eine Zahl.',
			...SUGAR_HRT.de,
			note: 'Nur Nüchternwerte sind aussagekräftig.'
		}
	},

	'homa-ir': {
		cites: ['matthews1985', 'gayoso2013', 'shadid2020', 'vaneeghen2026-ins'],
		en: {
			what: 'Insulin resistance estimated from fasting glucose and fasting insulin.',
			why: 'Tracks insulin resistance over time.',
			high: 'Insulin resistance. Published cutoffs range from about 2 to 3.5 depending on population and assay.',
			...SUGAR_HRT.en,
			note: 'Computed for every draw with both values. Only meaningful when the draw was fasting.'
		},
		de: {
			what: 'Aus Nüchternglukose und Nüchterninsulin geschätzte Insulinresistenz.',
			why: 'Verfolgt die Insulinresistenz über die Zeit.',
			high: 'Insulinresistenz. Veröffentlichte Grenzwerte liegen je nach Bevölkerung und Messverfahren zwischen etwa 2 und 3,5.',
			...SUGAR_HRT.de,
			note: 'Wird für jede Abnahme mit beiden Werten berechnet. Aussagekräftig nur, wenn nüchtern abgenommen wurde.'
		}
	},

	'troponin-t': {
		cites: ['roche-tnt'],
		en: {
			what: 'A protein from heart muscle cells.',
			why: 'The standard test for heart muscle damage such as a heart attack. A rise and fall over hours says more than a single value.',
			high: 'Heart muscle damage, heart strain from high blood pressure or heart failure, reduced kidney function, extreme endurance exercise.',
			note: 'pg/ml and ng/l are the same number. The upper limit is lower in women than in men.'
		},
		de: {
			what: 'Ein Eiweiß aus Herzmuskelzellen.',
			why: 'Der Standardtest für Herzmuskelschäden wie einen Herzinfarkt. Ein Anstieg und Abfall über Stunden sagt mehr als ein einzelner Wert.',
			high: 'Herzmuskelschaden, Herzbelastung durch hohen Blutdruck oder Herzschwäche, verminderte Nierenfunktion, extremer Ausdauersport.',
			note: 'pg/ml und ng/l sind dieselbe Zahl. Die Obergrenze ist bei Frauen niedriger als bei Männern.'
		}
	},

	ck: {
		en: {
			what: 'A muscle enzyme that leaks into the blood when muscle is strained or damaged.',
			why: 'Muscle damage, and a side effect check for statins.',
			high: 'Hard training in the days before the draw (often several times the upper limit), injections into muscle, falls, statins, an underactive thyroid, rarely muscle disease.',
			low: 'Low muscle mass. Not a concern.',
			fem: 'Tends to fall along with muscle mass.',
			masc: 'Rises with muscle mass and training toward the cis male range.'
		},
		de: {
			what: 'Ein Muskelenzym, das ins Blut gelangt, wenn Muskeln belastet oder verletzt werden.',
			why: 'Muskelschäden und Kontrolle auf Nebenwirkungen von Statinen.',
			high: 'Hartes Training in den Tagen vor der Abnahme (oft ein Vielfaches der Obergrenze), Spritzen in den Muskel, Stürze, Statine, Schilddrüsenunterfunktion, selten Muskelerkrankungen.',
			low: 'Geringe Muskelmasse. Unbedenklich.',
			fem: 'Sinkt meist mit der Muskelmasse.',
			masc: 'Steigt mit Muskelmasse und Training in Richtung des cis männlichen Bereichs.'
		}
	},

	'ck-mb': {
		en: {
			what: 'The heart type of the muscle enzyme creatine kinase.',
			why: 'An older marker of heart damage, mostly replaced by troponin.',
			high: 'Heart muscle damage, but also heavy skeletal muscle strain.'
		},
		de: {
			what: 'Der Herztyp des Muskelenzyms Kreatinkinase.',
			why: 'Ein älterer Marker für Herzschäden, weitgehend durch Troponin ersetzt.',
			high: 'Herzmuskelschaden, aber auch starke Belastung der Skelettmuskulatur.'
		}
	},

	ldh: {
		en: {
			what: 'An enzyme present in nearly every cell.',
			why: 'An unspecific marker of cell damage anywhere, including the breakdown of red cells.',
			high: 'Haemolysis (also in the tube after a difficult draw), muscle or liver damage, hard exercise.',
			low: 'Not meaningful.'
		},
		de: {
			what: 'Ein Enzym in fast jeder Zelle.',
			why: 'Ein unspezifischer Marker für Zellschäden überall, auch für den Abbau roter Blutkörperchen.',
			high: 'Hämolyse (auch im Röhrchen nach schwieriger Abnahme), Muskel- oder Leberschaden, harter Sport.',
			low: 'Ohne Bedeutung.'
		}
	},

	crp: {
		cites: ['sp-crp', 'pepys2003', 'aha-crp', 'vongpatanasin2003'],
		en: {
			what: 'A protein the liver makes within hours of an inflammation.',
			why: 'Picks up infection and inflammation. At low levels, measured with a high sensitivity assay, it is also a cardiovascular risk marker.',
			high: 'Infection, injury, surgery, inflammatory disease, excess body fat, smoking, oral estrogen.',
			low: 'Normal.',
			more: 'After a single trigger CRP rises above 5 mg/l within about six hours and peaks around 48 hours. It can climb ten thousandfold, and because its half life is only about 19 hours it falls quickly once the cause settles (Pepys 2003). A value that stays above 10 mg/l signals a real inflammatory response whose cause is worth finding. Values above 100 mg/l are typical of acute bacterial infections but also occur with viral infections, vasculitis and major injury. Above 500 mg/l the cause is a bacterial infection in about nine of ten cases.\n\nBelow 10 mg/l a high sensitivity CRP reflects low grade inflammation, including in the vessel walls. The AHA/CDC bands are below 1 mg/l for low, 1 to 3 for average and above 3 mg/l for higher cardiovascular risk. For that use it should be measured at least twice, a week or more apart, without a cold or injury in between.',
			fem: 'Oral estrogen raises CRP as it passes the liver first. In postmenopausal women oral estrogen more than doubled CRP within eight weeks, while transdermal estradiol had no effect (Vongpatanasin 2003). Injected estradiol also bypasses the liver. A mildly raised CRP on oral estradiol is therefore not necessarily inflammation.'
		},
		de: {
			what: 'Ein Eiweiß, das die Leber innerhalb von Stunden nach Beginn einer Entzündung bildet.',
			why: 'Zeigt Infektionen und Entzündungen. In niedrigen Bereichen, mit einem hochsensitiven Test gemessen, auch ein Risikomarker für Herz und Gefäße.',
			high: 'Infektion, Verletzung, Operation, entzündliche Erkrankung, viel Körperfett, Rauchen, orales Östrogen.',
			low: 'Normal.',
			more: 'Nach einem einzelnen Auslöser steigt CRP innerhalb von etwa sechs Stunden über 5 mg/l und erreicht nach rund 48 Stunden seinen Gipfel. Es kann auf das Zehntausendfache klettern, und weil seine Halbwertszeit nur etwa 19 Stunden beträgt, fällt es schnell, sobald die Ursache abklingt (Pepys 2003). Ein Wert, der über 10 mg/l bleibt, zeigt eine echte Entzündungsreaktion, deren Ursache gesucht werden sollte. Werte über 100 mg/l sind typisch für akute bakterielle Infektionen, kommen aber auch bei viralen Infektionen, Gefäßentzündungen und schweren Verletzungen vor. Über 500 mg/l steckt in etwa neun von zehn Fällen eine bakterielle Infektion dahinter.\n\nUnter 10 mg/l spiegelt ein hochsensitives CRP eine leichte Entzündung, auch in den Gefäßwänden. Die AHA/CDC-Bereiche liegen unter 1 mg/l für niedriges, 1 bis 3 für durchschnittliches und über 3 mg/l für erhöhtes Herz-Kreislauf-Risiko. Dafür sollte es mindestens zweimal im Abstand von einer Woche oder mehr gemessen werden, ohne Erkältung oder Verletzung dazwischen.',
			fem: 'Orales Östrogen erhöht CRP, weil es zuerst die Leber passiert. Bei Frauen nach den Wechseljahren erhöhte orales Östrogen CRP innerhalb von acht Wochen auf mehr als das Doppelte, transdermales Östradiol hatte keinen Effekt (Vongpatanasin 2003). Auch gespritztes Östradiol umgeht die Leber. Ein leicht erhöhtes CRP unter oralem Östradiol ist daher nicht unbedingt eine Entzündung.'
		}
	},

	esr: {
		cites: ['miller1983'],
		en: {
			what: 'How fast red cells settle in a tube within one hour.',
			why: 'An old, slow and unspecific marker of inflammation, largely replaced by CRP.',
			high: 'Inflammation, anaemia, pregnancy, older age. Higher in women than in men.',
			low: 'Not meaningful.',
			note: 'A rough upper limit is age ÷ 2 for men and (age + 10) ÷ 2 for women (Miller 1983).'
		},
		de: {
			what: 'Wie schnell sich rote Blutkörperchen in einer Stunde im Röhrchen absetzen.',
			why: 'Ein alter, träger und unspezifischer Entzündungsmarker, weitgehend durch CRP ersetzt.',
			high: 'Entzündung, Blutarmut, Schwangerschaft, höheres Alter. Bei Frauen höher als bei Männern.',
			low: 'Ohne Bedeutung.',
			note: 'Eine grobe Obergrenze ist Alter ÷ 2 für Männer und (Alter + 10) ÷ 2 für Frauen (Miller 1983).'
		}
	}
};
