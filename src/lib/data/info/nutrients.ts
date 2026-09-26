import type { InfoEntry } from '../types';

export const nutrients: Record<string, InfoEntry> = {
	iron: {
		en: {
			what: 'Iron circulating in serum at the moment of the draw, bound to transferrin.',
			why: 'Part of an iron work up, together with ferritin and transferrin.',
			high: 'Iron supplements or a recent iron rich meal, iron overload, liver damage.',
			low: 'Iron deficiency, inflammation, time of day.',
			note: 'Swings a lot over the day and from day to day. Ferritin and transferrin saturation say much more about iron stores.'
		},
		de: {
			what: 'Im Serum zirkulierendes Eisen zum Zeitpunkt der Abnahme, an Transferrin gebunden.',
			why: 'Teil der Eisendiagnostik, zusammen mit Ferritin und Transferrin.',
			high: 'Eisenpräparate oder eine kürzliche eisenreiche Mahlzeit, Eisenüberladung, Leberschaden.',
			low: 'Eisenmangel, Entzündung, Tageszeit.',
			note: 'Schwankt stark über den Tag und von Tag zu Tag. Ferritin und Transferrinsättigung sagen viel mehr über die Eisenspeicher.'
		}
	},

	ferritin: {
		cites: ['who-ferritin2020', 'ramasamy2024', 'endo2017'],
		en: {
			what: 'The iron storage protein. Its blood level mirrors the body\'s iron stores.',
			why: 'The best single test for iron deficiency, and a first check for iron overload.',
			high: 'Inflammation or infection (ferritin rises as an acute phase protein), overweight and fatty liver, alcohol, iron overload such as hereditary haemochromatosis.',
			low: 'Empty iron stores, even before haemoglobin falls.',
			more: 'The body has no way to get rid of iron, so it stores what it does not need, mostly in the liver, and ferritin tracks these stores. Iron deficiency develops in stages: first the stores empty and ferritin falls, then red cell production slows, and only at the end does haemoglobin drop. Tiredness, hair loss and restless legs can appear before anaemia does.\n\nThe WHO 2020 guideline sets iron deficiency below 15 ng/ml in healthy adults, and below 70 ng/ml when there is inflammation, because inflammation raises ferritin regardless of the stores. Common causes of deficiency are heavy periods, a diet low in iron, blood donation, and blood loss or poor absorption in the gut.\n\nHigh ferritin is much more often caused by inflammation, overweight, fatty liver or alcohol than by iron overload. Transferrin saturation tells them apart: it stays normal with inflammation and rises with true overload.',
			fem: 'There are no studies yet on ferritin during HRT (Ramasamy 2024). The lower cis female ranges reflect monthly blood loss through periods, which does not apply here. With fewer red cells being made on estradiol, less iron is used.',
			masc: 'There are no studies yet on ferritin during HRT (Ramasamy 2024). More red cells use more iron, while periods usually stop within a few months on testosterone (Endocrine Society 2017), which ends the monthly iron loss.',
			note: 'During inflammation a normal ferritin can hide an iron deficiency.'
		},
		de: {
			what: 'Das Eisenspeichereiweiß. Sein Blutspiegel spiegelt die Eisenvorräte des Körpers.',
			why: 'Der beste Einzeltest auf Eisenmangel und ein erster Test auf Eisenüberladung.',
			high: 'Entzündung oder Infektion (Ferritin steigt als Akute-Phase-Eiweiß), Übergewicht und Fettleber, Alkohol, Eisenüberladung wie bei erblicher Hämochromatose.',
			low: 'Leere Eisenspeicher, noch bevor das Hämoglobin sinkt.',
			more: 'Der Körper kann Eisen nicht aktiv ausscheiden, er speichert daher, was er nicht braucht, vor allem in der Leber, und Ferritin folgt diesen Speichern. Ein Eisenmangel entsteht in Stufen: Zuerst leeren sich die Speicher und Ferritin sinkt, dann verlangsamt sich die Blutbildung, und erst am Ende fällt das Hämoglobin. Müdigkeit, Haarausfall und unruhige Beine können vor einer Blutarmut auftreten.\n\nDie WHO-Leitlinie von 2020 setzt einen Eisenmangel bei gesunden Erwachsenen unter 15 ng/ml an, bei Entzündung unter 70 ng/ml, weil eine Entzündung Ferritin unabhängig von den Speichern erhöht. Häufige Ursachen eines Mangels sind starke Perioden, eisenarme Ernährung, Blutspenden sowie Blutverlust oder schlechte Aufnahme im Darm.\n\nHohes Ferritin kommt viel häufiger von Entzündung, Übergewicht, Fettleber oder Alkohol als von einer Eisenüberladung. Die Transferrinsättigung unterscheidet beides: Bei Entzündung bleibt sie normal, bei echter Überladung steigt sie.',
			fem: 'Zu Ferritin unter HRT gibt es noch keine Studien (Ramasamy 2024). Die niedrigeren cis weiblichen Bereiche spiegeln den monatlichen Blutverlust durch die Periode, der hier wegfällt. Unter Östradiol werden weniger rote Blutkörperchen gebildet, es wird also weniger Eisen verbraucht.',
			masc: 'Zu Ferritin unter HRT gibt es noch keine Studien (Ramasamy 2024). Mehr rote Blutkörperchen verbrauchen mehr Eisen, während die Periode unter Testosteron meist innerhalb weniger Monate ausbleibt (Endocrine Society 2017), womit der monatliche Eisenverlust endet.',
			note: 'Bei Entzündung kann ein normales Ferritin einen Eisenmangel verdecken.'
		}
	},

	transferrin: {
		en: {
			what: 'The protein that carries iron in the blood.',
			why: 'Needed to compute transferrin saturation. The liver makes more of it when iron runs low.',
			high: 'Iron deficiency, pregnancy, oral estrogen and the pill.',
			low: 'Inflammation, liver disease, iron overload, protein loss.',
			fem: 'Oral estrogen makes the liver produce more transferrin, which can make the saturation look lower than the iron supply really is.'
		},
		de: {
			what: 'Das Eiweiß, das Eisen im Blut transportiert.',
			why: 'Nötig zur Berechnung der Transferrinsättigung. Die Leber bildet mehr davon, wenn Eisen knapp wird.',
			high: 'Eisenmangel, Schwangerschaft, orales Östrogen und die Pille.',
			low: 'Entzündung, Lebererkrankung, Eisenüberladung, Eiweißverlust.',
			fem: 'Orales Östrogen lässt die Leber mehr Transferrin bilden, die Sättigung kann dadurch niedriger wirken, als die Eisenversorgung wirklich ist.'
		}
	},

	tsat: {
		cites: ['easl2022', 'esc-hf2021'],
		en: {
			what: 'How much of the iron carrying capacity of transferrin is filled.',
			why: 'Shows the iron available for red cell production, and is less affected by inflammation than ferritin. The first test for hereditary haemochromatosis.',
			high: 'Iron overload, for example hereditary haemochromatosis, or recent iron intake. Above 45 percent is a reason to look further (EASL 2022).',
			low: 'Iron deficiency or iron held back by inflammation. Below 20 percent there is too little iron available for red cell production.',
			note: 'Computed from iron and transferrin when both were measured. Iron swings over the day, so a morning fasting draw compares best.'
		},
		de: {
			what: 'Wie viel der Transportkapazität des Transferrins mit Eisen belegt ist.',
			why: 'Zeigt das für die Blutbildung verfügbare Eisen und wird weniger von Entzündungen beeinflusst als Ferritin. Der erste Test auf erbliche Hämochromatose.',
			high: 'Eisenüberladung, etwa bei erblicher Hämochromatose, oder kürzliche Eiseneinnahme. Über 45 Prozent ist ein Grund, genauer hinzusehen (EASL 2022).',
			low: 'Eisenmangel oder durch Entzündung zurückgehaltenes Eisen. Unter 20 Prozent steht der Blutbildung zu wenig Eisen zur Verfügung.',
			note: 'Aus Eisen und Transferrin berechnet, wenn beide gemessen wurden. Eisen schwankt über den Tag, eine nüchterne Abnahme am Morgen ist am besten vergleichbar.'
		}
	},

	'vitamin-d': {
		cites: ['sp-vitd', 'iom2011', 'endo-vitd2011', 'demay2024'],
		en: {
			what: 'The storage form of vitamin D (25-OH vitamin D), made in the skin from sunlight and taken in with food or supplements.',
			why: 'Bone health: vitamin D lets the gut absorb calcium. A deficit softens bone and weakens muscles.',
			high: 'High dose supplements. Toxicity is rare and needs very high intake over a long time, it shows as high calcium.',
			low: 'Little sun, especially in winter at northern latitudes, darker skin, covering clothing, overweight, older age, poor absorption in the gut.',
			more: 'In Central Europe the sun is too low from about October to March for the skin to make much vitamin D, so levels follow the seasons and are lowest in late winter. The storage form measured here lasts a few weeks in the blood.\n\nWhat counts as enough is disputed. The US Institute of Medicine found that 20 ng/ml (50 nmol/l) covers the needs of almost everyone, sees a risk of deficiency below 12 ng/ml (30 nmol/l) and possible harm above 50 ng/ml (125 nmol/l) (IOM 2011). An older Endocrine Society guideline asked for 30 ng/ml or more. Its 2024 successor sets no target level at all and advises against routine testing, because trials found no clear benefit of testing, and it advises against doses above the usual intake in healthy adults under 75 (Demay 2024).\n\nSevere deficiency causes soft bones (osteomalacia) with bone pain and muscle weakness. Where supplements are indicated, daily moderate doses are preferred over rare high ones.',
			fem: 'Bone density depends on sex hormones. After testosterone is suppressed, estradiol protects the bones, so a steady estradiol level matters most. Vitamin D and calcium support bone but do not replace estradiol.',
			masc: 'Testosterone is partly converted into estradiol, which protects bone. Vitamin D and calcium support that, particularly if testosterone doses are low or taken irregularly.',
			note: 'Conversion: 1 ng/ml = 2.496 nmol/l.'
		},
		de: {
			what: 'Die Speicherform von Vitamin D (25-OH-Vitamin D), gebildet in der Haut durch Sonnenlicht und aufgenommen über Nahrung oder Präparate.',
			why: 'Knochengesundheit: Vitamin D lässt den Darm Calcium aufnehmen. Ein Mangel macht den Knochen weich und schwächt die Muskeln.',
			high: 'Hochdosierte Präparate. Eine Vergiftung ist selten, braucht sehr hohe Mengen über lange Zeit und zeigt sich als hohes Calcium.',
			low: 'Wenig Sonne, besonders im Winter in nördlichen Breiten, dunklere Haut, bedeckende Kleidung, Übergewicht, höheres Alter, schlechte Aufnahme im Darm.',
			more: 'In Mitteleuropa steht die Sonne etwa von Oktober bis März zu tief, als dass die Haut viel Vitamin D bilden könnte, die Werte folgen daher den Jahreszeiten und sind im späten Winter am niedrigsten. Die hier gemessene Speicherform hält sich einige Wochen im Blut.\n\nWas als ausreichend gilt, ist umstritten. Das US Institute of Medicine fand, dass 20 ng/ml (50 nmol/l) den Bedarf fast aller Menschen deckt, sieht unter 12 ng/ml (30 nmol/l) ein Mangelrisiko und über 50 ng/ml (125 nmol/l) mögliche Schäden (IOM 2011). Eine ältere Leitlinie der Endocrine Society verlangte 30 ng/ml oder mehr. Ihre Nachfolgerin von 2024 nennt gar keinen Zielwert mehr und rät von Routinemessungen ab, weil Studien keinen klaren Nutzen des Testens fanden, und sie rät gesunden Erwachsenen unter 75 von Dosen über der üblichen Zufuhr ab (Demay 2024).\n\nEin schwerer Mangel verursacht weiche Knochen (Osteomalazie) mit Knochenschmerzen und Muskelschwäche. Wo Präparate sinnvoll sind, werden tägliche moderate Dosen seltenen hohen vorgezogen.',
			fem: 'Die Knochendichte hängt von Sexualhormonen ab. Nach Unterdrückung des Testosterons schützt Östradiol die Knochen, ein stabiler Östradiolspiegel zählt daher am meisten. Vitamin D und Calcium unterstützen den Knochen, ersetzen Östradiol aber nicht.',
			masc: 'Testosteron wird teils zu Östradiol umgewandelt, das den Knochen schützt. Vitamin D und Calcium unterstützen das, besonders wenn Testosteron niedrig dosiert oder unregelmäßig genommen wird.',
			note: 'Umrechnung: 1 ng/ml = 2,496 nmol/l.'
		}
	},

	b12: {
		cites: ['sp-b12', 'bsh-b12'],
		en: {
			what: 'A vitamin needed for red cell production and for the nerves. Found almost only in animal foods.',
			why: 'Deficiency causes anaemia with large red cells and nerve damage, which can become permanent.',
			high: 'Supplements or injections. Very high values without supplements can point to liver or blood disorders.',
			low: 'A vegan diet without supplements, poor absorption (autoimmune gastritis, gut surgery, older age), metformin, acid blockers taken for years.',
			more: 'The liver stores enough B12 for several years, so a deficiency develops slowly and often goes unnoticed for a long time. Early signs are tiredness, tingling or numbness in hands and feet, unsteady walking, memory problems and a sore tongue. Nerve damage can appear before any anaemia, and a high folate intake can hide the anaemia while the nerve damage continues.\n\nThe serum level is an imperfect test. Below about 200 pg/ml (148 pmol/l) a deficiency is likely, but there is a wide grey zone above it (BSH 2014). Holotranscobalamin, the active share, and methylmalonic acid, which builds up in deficiency, help decide. Laughing gas used recreationally inactivates B12 and can cause severe nerve damage even with a normal serum level.',
			note: 'Conversion: 1 pg/ml = 0.738 pmol/l.'
		},
		de: {
			what: 'Ein Vitamin für die Blutbildung und die Nerven. Kommt fast nur in tierischen Lebensmitteln vor.',
			why: 'Ein Mangel verursacht Blutarmut mit großen roten Blutkörperchen und Nervenschäden, die bleibend werden können.',
			high: 'Präparate oder Spritzen. Sehr hohe Werte ohne Einnahme können auf Leber- oder Bluterkrankungen hindeuten.',
			low: 'Vegane Ernährung ohne Ergänzung, schlechte Aufnahme (autoimmune Magenschleimhautentzündung, Darmoperationen, höheres Alter), Metformin, jahrelang eingenommene Magensäureblocker.',
			more: 'Die Leber speichert B12 für mehrere Jahre, ein Mangel entsteht daher langsam und bleibt oft lange unbemerkt. Frühe Zeichen sind Müdigkeit, Kribbeln oder Taubheit in Händen und Füßen, unsicherer Gang, Gedächtnisprobleme und eine wunde Zunge. Nervenschäden können vor jeder Blutarmut auftreten, und viel Folsäure kann die Blutarmut verdecken, während die Nervenschäden weiter fortschreiten.\n\nDer Serumwert ist ein unvollkommener Test. Unter etwa 200 pg/ml (148 pmol/l) ist ein Mangel wahrscheinlich, darüber liegt aber eine breite Grauzone (BSH 2014). Holotranscobalamin, der aktive Anteil, und Methylmalonsäure, die sich bei Mangel anhäuft, helfen bei der Entscheidung. Lachgas als Droge macht B12 unwirksam und kann schwere Nervenschäden verursachen, selbst bei normalem Serumwert.',
			note: 'Umrechnung: 1 pg/ml = 0,738 pmol/l.'
		}
	},

	folate: {
		cites: ['who-folate2015'],
		en: {
			what: 'A B vitamin needed for cell division and red cell production. Found in leafy greens, legumes and whole grains.',
			why: 'Deficiency causes anaemia with large red cells. Enough folate before and in early pregnancy prevents neural tube defects.',
			high: 'Supplements or fortified foods.',
			low: 'A diet low in vegetables, alcohol, poor absorption, some drugs (methotrexate, some antiepileptics).',
			note: 'Serum folate reflects the last days of intake, red cell folate the last months.'
		},
		de: {
			what: 'Ein B-Vitamin für Zellteilung und Blutbildung. Steckt in grünem Blattgemüse, Hülsenfrüchten und Vollkorn.',
			why: 'Ein Mangel verursacht Blutarmut mit großen roten Blutkörperchen. Genug Folsäure vor und in der frühen Schwangerschaft verhindert Neuralrohrdefekte.',
			high: 'Präparate oder angereicherte Lebensmittel.',
			low: 'Gemüsearme Ernährung, Alkohol, schlechte Aufnahme, manche Medikamente (Methotrexat, manche Antiepileptika).',
			note: 'Folsäure im Serum spiegelt die letzten Tage, Folsäure in den roten Blutkörperchen die letzten Monate.'
		}
	},

	homocysteine: {
		cites: ['selhub1999'],
		en: {
			what: 'An amino acid that builds up when vitamin B12, folate or B6 are missing.',
			why: 'A sensitive functional marker of B12 and folate deficiency.',
			high: 'B12 or folate deficiency, reduced kidney function, an underactive thyroid, some genetic variants, smoking, coffee.',
			low: 'Not a concern.',
			note: 'High levels go with cardiovascular disease, but lowering them with B vitamins did not prevent it in trials.'
		},
		de: {
			what: 'Eine Aminosäure, die sich anhäuft, wenn Vitamin B12, Folsäure oder B6 fehlen.',
			why: 'Ein empfindlicher Funktionsmarker für B12- und Folsäuremangel.',
			high: 'B12- oder Folsäuremangel, verminderte Nierenfunktion, Schilddrüsenunterfunktion, manche Genvarianten, Rauchen, Kaffee.',
			low: 'Unbedenklich.',
			note: 'Hohe Werte gehen mit Herz-Kreislauf-Erkrankungen einher, sie mit B-Vitaminen zu senken hat diese in Studien aber nicht verhindert.'
		}
	},

	psa: {
		cites: ['sp-psa', 'nikahd2024'],
		en: {
			what: 'A protein made by the prostate.',
			why: 'Used in prostate cancer screening and follow up.',
			high: 'An enlarged prostate, inflammation or a urinary infection, cancer, recent ejaculation, cycling or a prostate exam.',
			low: 'Not a concern. Drugs for an enlarged prostate (finasteride, dutasteride) roughly halve it.',
			more: 'PSA rises with age and prostate size, and most raised values come from benign enlargement or inflammation rather than cancer. A cutoff of 4 ng/ml was long used, but cancer also occurs below it, and many men above it have none. Screening finds cancers early but also many slow ones that would never have caused harm, which is why guidelines recommend deciding on it together with a doctor from about age 45 to 50.\n\nThe trend over time says more than one value. Finasteride and dutasteride, also used against hair loss, halve PSA after several months, so values on these drugs are doubled for comparison.',
			fem: 'The prostate stays after vaginoplasty and can still develop cancer. On estrogen PSA falls to a fraction of the cis male level: in a study of 210 trans women the median was 0.02 ng/ml and 95 percent were below 0.6 ng/ml (Nik-Ahd 2024). Using the cis male cutoff of 4 ng/ml would miss values that are clearly unusual on HRT.'
		},
		de: {
			what: 'Ein Eiweiß aus der Prostata.',
			why: 'Wird in der Früherkennung und Nachsorge von Prostatakrebs genutzt.',
			high: 'Vergrößerte Prostata, Entzündung oder Harnwegsinfekt, Krebs, kürzlicher Samenerguss, Radfahren oder eine Tastuntersuchung.',
			low: 'Unbedenklich. Mittel gegen eine vergrößerte Prostata (Finasterid, Dutasterid) halbieren ihn etwa.',
			more: 'PSA steigt mit Alter und Prostatagröße, und die meisten erhöhten Werte kommen von gutartiger Vergrößerung oder Entzündung statt von Krebs. Lange galt eine Grenze von 4 ng/ml, Krebs kommt aber auch darunter vor, und viele Männer darüber haben keinen. Die Früherkennung findet Krebs früh, aber auch viele langsame Tumoren, die nie geschadet hätten, deshalb empfehlen Leitlinien, ab etwa 45 bis 50 Jahren gemeinsam mit einer Ärztin oder einem Arzt darüber zu entscheiden.\n\nDer Verlauf sagt mehr als ein einzelner Wert. Finasterid und Dutasterid, auch gegen Haarausfall genutzt, halbieren PSA nach einigen Monaten, Werte unter diesen Mitteln werden zum Vergleich verdoppelt.',
			fem: 'Die Prostata bleibt auch nach einer Vaginoplastik und kann weiterhin Krebs entwickeln. Unter Östrogen sinkt PSA auf einen Bruchteil des cis männlichen Werts: In einer Studie mit 210 trans Frauen lag der Median bei 0,02 ng/ml, und 95 Prozent lagen unter 0,6 ng/ml (Nik-Ahd 2024). Mit der cis männlichen Grenze von 4 ng/ml würden Werte übersehen, die unter HRT klar auffällig sind.'
		}
	},

	weight: {
		cites: ['wpath8'],
		en: {
			what: 'Body weight, as noted at the visit or at home.',
			why: 'Puts lipids, blood sugar and drug doses in context and tracks body changes over time.',
			fem: 'Fat shifts toward hips and thighs and muscle mass falls on feminizing HRT. Some weight gain in the first years is common.',
			masc: 'Muscle mass grows and fat shifts toward the belly on testosterone. Weight often increases.'
		},
		de: {
			what: 'Körpergewicht, beim Arztbesuch oder zu Hause notiert.',
			why: 'Ordnet Blutfette, Blutzucker und Medikamentendosen ein und verfolgt körperliche Veränderungen über die Zeit.',
			fem: 'Unter feminisierender HRT verlagert sich Fett zu Hüften und Oberschenkeln, und die Muskelmasse sinkt. Etwas Gewichtszunahme in den ersten Jahren ist häufig.',
			masc: 'Unter Testosteron wächst die Muskelmasse, und Fett verlagert sich zum Bauch. Das Gewicht steigt oft.'
		}
	},

	bmi: {
		cites: ['who-bmi'],
		en: {
			what: 'Weight in kilograms divided by height in metres squared.',
			why: 'A crude but standard measure of under or overweight: below 18.5 underweight, 25 to 29.9 overweight, 30 and above obesity (WHO).',
			note: 'Says nothing about body composition, so muscular people read as overweight. Waist circumference adds what BMI misses.'
		},
		de: {
			what: 'Gewicht in Kilogramm geteilt durch die Größe in Metern zum Quadrat.',
			why: 'Ein grobes, aber übliches Maß für Unter- oder Übergewicht: unter 18,5 Untergewicht, 25 bis 29,9 Übergewicht, ab 30 Adipositas (WHO).',
			note: 'Sagt nichts über die Körperzusammensetzung, muskulöse Menschen gelten so als übergewichtig. Der Taillenumfang ergänzt, was der BMI übersieht.'
		}
	}
};
