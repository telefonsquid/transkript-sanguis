import type { InfoEntry } from '../types';

export const hormones: Record<string, InfoEntry> = {
	estradiol: {
		cites: ['sp-estradiol', 'endo2017', 'wpath8'],
		en: {
			what: 'The main estrogen. It drives breast development, the menstrual cycle and fertility, and in people of every sex it keeps bones strong and influences blood vessels, skin, mood and fat distribution. Labs measure 17β-estradiol.',
			why: 'Measured with missing or irregular periods, in fertility treatment, around menopause, with signs of too much estrogen in people with testes, and to check hormone therapy.',
			high: 'The days around ovulation, pregnancy, estrogen medication, rarely an estrogen producing tumour. In people with testes more testosterone can be converted to estradiol, for example with obesity or liver disease.',
			low: 'The start of the cycle, menopause, ovaries held back by low body weight, intense exercise or a pituitary problem, and removal of the ovaries. In people with testes values are naturally lower and follow testosterone.',
			more: 'Estradiol follows the menstrual cycle: low during the period, a steep peak just before ovulation, a second smaller rise in the second half and a fall before the next period. A single value only makes sense together with the cycle day. After menopause the ovaries stop making it and levels drop to a fraction.\n\nIn people with testes most estradiol is made from testosterone by the enzyme aromatase, in fat tissue and other organs. They need it too: it closes the growth plates, keeps bones dense and plays a part in libido.\n\nMeasuring is hard at low levels. The common immunoassays read unreliably in the range of men, children and people after menopause, where mass spectrometry (LC-MS/MS) is more accurate. High dose biotin supplements, sold for hair and nails, can disturb many immunoassays including this one.',
			fem: 'The main number for dosing. The Endocrine Society and WPATH suggest 100 to 200 pg/ml together with testosterone below 50 ng/dl, levels similar to premenopausal cis women. The best target has not been established in studies, and how someone feels and changes counts as much as the number.\n\nTiming matters. After an injection levels peak within the first few days and fall toward the next dose, so only compare draws taken at the same point in the interval. With tablets, gel or patches draw at a consistent time after the last dose. Sublingual tablets give sharp, short peaks that make single values hard to read. Without an antiandrogen estradiol has to stay high enough to keep testosterone suppressed on its own.',
			masc: 'Falls as testosterone suppresses the ovaries. Part of the testosterone is converted to estradiol, so values in the cis male range or the low cis female range are common and expected. Bleeding usually stops within the first months. If it continues, the testosterone dose may not be enough yet.',
			note: 'Conversion: 1 pg/ml = 3.671 pmol/l. Assays differ most at low levels, so compare values from the same lab.'
		},
		de: {
			what: 'Das wichtigste Östrogen. Es steuert Brustentwicklung, Zyklus und Fruchtbarkeit und hält bei allen Geschlechtern die Knochen stabil. Außerdem wirkt es auf Gefäße, Haut, Stimmung und Fettverteilung. Gemessen wird 17β-Östradiol.',
			why: 'Gemessen bei ausbleibender oder unregelmäßiger Periode, in der Kinderwunschbehandlung, rund um die Wechseljahre, bei Zeichen von zu viel Östrogen bei Menschen mit Hoden und zur Kontrolle einer Hormontherapie.',
			high: 'Die Tage um den Eisprung, Schwangerschaft, Östrogenpräparate, selten ein östrogenbildender Tumor. Bei Menschen mit Hoden kann mehr Testosteron zu Östradiol umgewandelt werden, etwa bei Übergewicht oder Lebererkrankungen.',
			low: 'Der Zyklusbeginn, die Wechseljahre, Eierstöcke, die durch niedriges Körpergewicht, sehr viel Sport oder eine Störung der Hirnanhangsdrüse gebremst werden, und nach Entfernung der Eierstöcke. Bei Menschen mit Hoden sind die Werte von Natur aus niedriger und folgen dem Testosteron.',
			more: 'Östradiol folgt dem Zyklus: niedrig während der Periode, ein steiler Gipfel kurz vor dem Eisprung, ein zweiter kleinerer Anstieg in der zweiten Zyklushälfte und ein Abfall vor der nächsten Periode. Ein einzelner Wert ist nur zusammen mit dem Zyklustag aussagekräftig. Nach den Wechseljahren stellen die Eierstöcke die Bildung ein und die Spiegel sinken auf einen Bruchteil.\n\nBei Menschen mit Hoden entsteht das meiste Östradiol aus Testosteron, umgewandelt durch das Enzym Aromatase im Fettgewebe und in anderen Organen. Auch sie brauchen es: Es schließt die Wachstumsfugen, hält die Knochen dicht und trägt zur Libido bei.\n\nBei niedrigen Spiegeln ist die Messung schwierig. Die üblichen Immunoassays messen im Bereich von Männern, Kindern und nach den Wechseljahren unzuverlässig, dort ist Massenspektrometrie (LC-MS/MS) genauer. Hoch dosiertes Biotin, das für Haare und Nägel verkauft wird, kann viele Immunoassays stören, auch diesen.',
			fem: 'Der zentrale Wert für die Dosierung. Endocrine Society und WPATH schlagen 100 bis 200 pg/ml vor, zusammen mit Testosteron unter 50 ng/dl, also Spiegel wie bei cis Frauen vor den Wechseljahren. Das beste Ziel ist in Studien nicht belegt, und wie es dir geht und was sich verändert, zählt genauso viel wie die Zahl.\n\nDer Zeitpunkt zählt. Nach einer Injektion ist der Spiegel in den ersten Tagen am höchsten und fällt dann bis zur nächsten Dosis ab. Vergleiche daher nur Abnahmen mit gleichem Abstand zur Spritze. Bei Tabletten, Gel oder Pflaster immer mit gleichem Abstand zur letzten Dosis abnehmen. Sublinguale Tabletten erzeugen steile, kurze Spitzen, die Einzelwerte schwer deutbar machen. Ohne Antiandrogen muss Östradiol hoch genug bleiben, um Testosteron allein zu unterdrücken.',
			masc: 'Sinkt, sobald Testosteron die Eierstöcke unterdrückt. Ein Teil des Testosterons wird zu Östradiol umgewandelt, Werte im cis männlichen oder unteren cis weiblichen Bereich sind daher häufig und erwartet. Die Blutung hört meist in den ersten Monaten auf. Hält sie an, reicht die Testosterondosis vielleicht noch nicht.',
			note: 'Umrechnung: 1 pg/ml = 3,671 pmol/l. Die Tests unterscheiden sich vor allem bei niedrigen Werten, vergleiche daher Werte aus demselben Labor.'
		}
	},

	testosterone: {
		cites: ['sp-testosterone', 'bhasin2018', 'endo2017', 'angus2019', 'angus2024'],
		en: {
			what: 'The main androgen. In people with testes it is made mostly in the testes under the control of LH, in people with ovaries in much smaller amounts by the ovaries and adrenal glands. It builds muscle and bone, drives body hair, voice and libido, and is the precursor of estradiol and DHT.',
			why: 'Measured with signs of too little testosterone such as low libido, erection problems or loss of muscle and bone, with signs of androgen excess in people with ovaries such as acne, unwanted hair or irregular periods, and to check hormone therapy.',
			high: 'In people with testes rarely a concern outside testosterone or anabolic steroid use. In people with ovaries most often polycystic ovary syndrome, less often congenital adrenal hyperplasia or, with very high or quickly rising values, an androgen producing tumour.',
			low: 'In people with testes a failing testis or a missing signal from the pituitary, and also obesity, acute illness, opioids, glucocorticoids and the months after stopping anabolic steroids. In people with ovaries low values are normal.',
			more: 'Testosterone follows a daily rhythm with the highest values in the morning, most clearly in younger men. To diagnose a deficiency the Endocrine Society recommends a fasting morning draw and a second measurement on another day, because food and acute illness can lower a single value.\n\nOnly 1 to 2 percent circulates free. The rest is bound tightly to SHBG or loosely to albumin. When SHBG is unusually high or low the total misleads, and a calculated free testosterone says more.\n\nMost labs use immunoassays, which are accurate in the male range but unreliable in the much lower female range. Mass spectrometry (LC-MS/MS) is the better method there.',
			fem: 'Guidelines aim for testosterone below 50 ng/dl (0.5 ng/ml), the cis female range. How far it falls depends on the antiandrogen: in one Australian cohort the median was 0.8 nmol/l (0.23 ng/ml) with cyproterone acetate, 2.0 nmol/l (0.58 ng/ml) with spironolactone and 10.5 nmol/l (3.0 ng/ml) on estradiol alone (Angus 2019). Values below the cis female range are common with cyproterone and are not harmful in themselves.\n\nBicalutamide blocks the androgen receptor instead of lowering production, so testosterone often stays high or fluctuates (median 7.7 nmol/l in a case series, Angus 2024) and the number no longer shows how much androgen acts. Without an antiandrogen suppression depends on estradiol staying high across the whole dosing interval. After an orchiectomy testosterone stays low without an antiandrogen.',
			masc: 'The goal is the typical male range. For injections of enanthate or cypionate the Endocrine Society suggests measuring midway between two injections, aiming for 400 to 700 ng/dl (4 to 7 ng/ml), or checking peak and trough. Long acting undecanoate is checked just before the next injection. Gels and patches are checked after at least a week of daily use and at least two hours after applying.',
			note: 'Conversion: 1 ng/ml = 3.467 nmol/l = 100 ng/dl.'
		},
		de: {
			what: 'Das wichtigste Androgen. Bei Menschen mit Hoden entsteht es vor allem in den Hoden unter Steuerung durch LH, bei Menschen mit Eierstöcken in viel kleineren Mengen in Eierstöcken und Nebennieren. Es baut Muskeln und Knochen auf, steuert Körperbehaarung, Stimme und Libido und ist die Vorstufe von Östradiol und DHT.',
			why: 'Gemessen bei Zeichen von zu wenig Testosteron wie wenig Lust, Erektionsproblemen oder Muskel- und Knochenabbau, bei Zeichen von zu vielen Androgenen bei Menschen mit Eierstöcken wie Akne, unerwünschter Behaarung oder unregelmäßiger Periode, und zur Kontrolle einer Hormontherapie.',
			high: 'Bei Menschen mit Hoden außerhalb einer Einnahme von Testosteron oder Anabolika selten ein Problem. Bei Menschen mit Eierstöcken meist ein polyzystisches Ovarsyndrom, seltener ein adrenogenitales Syndrom oder, bei sehr hohen oder schnell steigenden Werten, ein androgenbildender Tumor.',
			low: 'Bei Menschen mit Hoden ein versagender Hoden oder ein fehlendes Signal der Hirnanhangsdrüse, außerdem Übergewicht, akute Krankheit, Opioide, Glukokortikoide und die Monate nach dem Absetzen von Anabolika. Bei Menschen mit Eierstöcken sind niedrige Werte normal.',
			more: 'Testosteron folgt einem Tagesrhythmus mit den höchsten Werten am Morgen, am deutlichsten bei jüngeren Männern. Für die Diagnose eines Mangels empfiehlt die Endocrine Society eine Abnahme morgens und nüchtern und eine zweite Messung an einem anderen Tag, weil Essen und akute Krankheit einen Einzelwert senken können.\n\nNur 1 bis 2 Prozent zirkulieren frei. Der Rest ist fest an SHBG oder locker an Albumin gebunden. Ist SHBG ungewöhnlich hoch oder niedrig, führt der Gesamtwert in die Irre, und ein berechnetes freies Testosteron sagt mehr.\n\nDie meisten Labore messen mit Immunoassays, die im männlichen Bereich genau sind, im viel niedrigeren weiblichen Bereich aber unzuverlässig. Dort ist Massenspektrometrie (LC-MS/MS) die bessere Methode.',
			fem: 'Leitlinien zielen auf Testosteron unter 50 ng/dl (0,5 ng/ml), den cis weiblichen Bereich. Wie weit es fällt, hängt vom Antiandrogen ab: In einer australischen Kohorte lag der Median bei 0,8 nmol/l (0,23 ng/ml) mit Cyproteronacetat, 2,0 nmol/l (0,58 ng/ml) mit Spironolacton und 10,5 nmol/l (3,0 ng/ml) mit Östradiol allein (Angus 2019). Werte unter dem cis weiblichen Bereich sind mit Cyproteron häufig und an sich nicht schädlich.\n\nBicalutamid blockiert den Androgenrezeptor, statt die Bildung zu senken. Testosteron bleibt daher oft hoch oder schwankt (Median 7,7 nmol/l in einer Fallserie, Angus 2024), und die Zahl zeigt nicht mehr, wie viel Androgen wirkt. Ohne Antiandrogen hängt die Unterdrückung davon ab, dass Östradiol über das ganze Dosisintervall hoch genug bleibt. Nach einer Orchiektomie bleibt Testosteron auch ohne Antiandrogen niedrig.',
			masc: 'Ziel ist der typische männliche Bereich. Bei Injektionen von Enantat oder Cypionat schlägt die Endocrine Society eine Messung in der Mitte zwischen zwei Spritzen vor, mit einem Ziel von 400 bis 700 ng/dl (4 bis 7 ng/ml), oder eine Messung von Spitzen- und Talspiegel. Das Depot Undecanoat wird direkt vor der nächsten Spritze kontrolliert. Gele und Pflaster frühestens nach einer Woche täglicher Anwendung und mindestens zwei Stunden nach dem Auftragen.',
			note: 'Umrechnung: 1 ng/ml = 3,467 nmol/l = 100 ng/dl.'
		}
	},

	'free-t-calc': {
		cites: ['vermeulen1999', 'bhasin2018'],
		en: {
			what: 'The part of testosterone bound neither to SHBG nor to albumin, calculated from total testosterone, SHBG and albumin. Only this small share, and to some degree the loosely albumin bound part, reaches the tissues.',
			why: 'Used when total testosterone is borderline, or when SHBG is unusually high or low, for example with obesity, thyroid or liver disease, older age or hormone therapy.',
			high: 'More active androgen: high total testosterone, low SHBG, or both.',
			low: 'Little active androgen: low total testosterone, high SHBG, or both.',
			more: 'The calculation follows the Vermeulen formula, which agrees closely with equilibrium dialysis, the reference method. Where albumin was not measured a typical 4.3 g/dl is assumed, which changes the result only slightly. The Endocrine Society recommends free testosterone for diagnosing a deficiency when the total is near the lower limit or SHBG is likely altered.\n\nThe result depends on the SHBG measurement too, so values from different labs differ more than their totals do.',
			fem: 'Settles in the cis female range. Rising SHBG on estradiol, especially oral estradiol, pushes it down further even when the total barely changes.',
			masc: 'Should reach the cis male range. Testosterone lowers SHBG, so the free share rises along with the total.',
			note: 'Needs total testosterone and SHBG from the same draw.'
		},
		de: {
			what: 'Der Teil des Testosterons, der weder an SHBG noch an Albumin gebunden ist, berechnet aus Gesamttestosteron, SHBG und Albumin. Nur dieser kleine Anteil, und teilweise der locker an Albumin gebundene, erreicht das Gewebe.',
			why: 'Genutzt, wenn das Gesamttestosteron grenzwertig ist oder SHBG ungewöhnlich hoch oder niedrig, etwa bei Übergewicht, Schilddrüsen- oder Lebererkrankungen, höherem Alter oder Hormontherapie.',
			high: 'Mehr wirksames Androgen: hohes Gesamttestosteron, niedriges SHBG oder beides.',
			low: 'Wenig wirksames Androgen: niedriges Gesamttestosteron, hohes SHBG oder beides.',
			more: 'Die Berechnung folgt der Formel nach Vermeulen, die eng mit der Gleichgewichtsdialyse übereinstimmt, der Referenzmethode. Fehlt ein gemessenes Albumin, werden typische 4,3 g/dl angenommen, was das Ergebnis nur wenig verändert. Die Endocrine Society empfiehlt freies Testosteron zur Diagnose eines Mangels, wenn der Gesamtwert nahe der unteren Grenze liegt oder SHBG wahrscheinlich verändert ist.\n\nDas Ergebnis hängt auch von der SHBG-Messung ab, Werte verschiedener Labore unterscheiden sich daher stärker als ihre Gesamtwerte.',
			fem: 'Pendelt sich im cis weiblichen Bereich ein. Steigendes SHBG unter Östradiol, besonders unter oralem, drückt es weiter, auch wenn sich der Gesamtwert kaum ändert.',
			masc: 'Sollte den cis männlichen Bereich erreichen. Testosteron senkt SHBG, der freie Anteil steigt daher mit dem Gesamtwert.',
			note: 'Braucht Gesamttestosteron und SHBG aus derselben Abnahme.'
		}
	},

	'free-t': {
		cites: ['bhasin2018'],
		en: {
			what: 'Free testosterone as measured by the lab, either by equilibrium dialysis, the reference method, or by a direct immunoassay.',
			why: 'Same purpose as the calculated value: estimating the testosterone that reaches the tissues when SHBG is shifted.',
			high: 'More active androgen.',
			low: 'Little active androgen.',
			note: 'Direct (analogue) immunoassays are inaccurate, and the Endocrine Society advises against them. Values from equilibrium dialysis or mass spectrometry are reliable and agree well with the calculated value. Only compare values from the same method.'
		},
		de: {
			what: 'Freies Testosteron, wie es das Labor misst, entweder per Gleichgewichtsdialyse, der Referenzmethode, oder per direktem Immunoassay.',
			why: 'Derselbe Zweck wie beim berechneten Wert: abschätzen, wie viel Testosteron das Gewebe erreicht, wenn SHBG verschoben ist.',
			high: 'Mehr wirksames Androgen.',
			low: 'Wenig wirksames Androgen.',
			note: 'Direkte (Analog-)Immunoassays sind ungenau, die Endocrine Society rät von ihnen ab. Werte aus Gleichgewichtsdialyse oder Massenspektrometrie sind verlässlich und stimmen gut mit dem berechneten Wert überein. Vergleiche nur Werte derselben Methode.'
		}
	},

	shbg: {
		cites: ['ding2009', 'collet2023', 'bhasin2018'],
		en: {
			what: 'Sex hormone binding globulin, a protein from the liver that carries testosterone and estradiol in the blood. Hormone bound to it is held tightly and cannot act.',
			why: 'Needed to judge how much testosterone is actually available, especially when the total is borderline. Low SHBG is also a sign of insulin resistance.',
			high: 'Estrogens, oral ones much more than patches or injections, an overactive thyroid, liver disease, low body weight, older age and some antiepileptic drugs.',
			low: 'Androgens including anabolic steroids, insulin resistance, obesity, type 2 diabetes, an underactive thyroid and glucocorticoids.',
			more: 'SHBG explains why total testosterone can mislead. With high SHBG a normal total can hide little free hormone, with low SHBG a low total can still mean enough free hormone. That is why it goes together with testosterone into the calculated free testosterone and the free androgen index.\n\nLow SHBG goes along with insulin resistance. In two large cohorts women and men with low SHBG had a clearly higher risk of developing type 2 diabetes (Ding 2009).',
			fem: 'Rises on estradiol, often into or above the cis female range. Oral estradiol raises it most because it passes the liver first. In one European cohort SHBG rose by about a fifth between month 3 and month 12 and was still climbing (Collet 2023). A fall after switching from tablets to injections or patches is expected.',
			masc: 'Falls toward the cis male range on testosterone, which raises the free share of testosterone.'
		},
		de: {
			what: 'Sexualhormon-bindendes Globulin, ein Eiweiß aus der Leber, das Testosteron und Östradiol im Blut transportiert. Daran gebundenes Hormon wird fest gehalten und kann nicht wirken.',
			why: 'Nötig, um abzuschätzen, wie viel Testosteron tatsächlich verfügbar ist, besonders bei grenzwertigem Gesamtwert. Ein niedriges SHBG ist außerdem ein Zeichen für Insulinresistenz.',
			high: 'Östrogene, orale viel stärker als Pflaster oder Spritzen, eine Schilddrüsenüberfunktion, Lebererkrankungen, niedriges Körpergewicht, höheres Alter und manche Antiepileptika.',
			low: 'Androgene einschließlich Anabolika, Insulinresistenz, Übergewicht, Typ-2-Diabetes, eine Schilddrüsenunterfunktion und Glukokortikoide.',
			more: 'SHBG erklärt, warum Gesamttestosteron täuschen kann. Bei hohem SHBG kann ein normaler Gesamtwert wenig freies Hormon verbergen, bei niedrigem SHBG kann ein niedriger Gesamtwert trotzdem genug freies Hormon bedeuten. Deshalb geht es zusammen mit Testosteron in das berechnete freie Testosteron und den freien Androgenindex ein.\n\nEin niedriges SHBG geht mit Insulinresistenz einher. In zwei großen Kohorten hatten Frauen und Männer mit niedrigem SHBG ein deutlich höheres Risiko, einen Typ-2-Diabetes zu entwickeln (Ding 2009).',
			fem: 'Steigt unter Östradiol, oft in oder über den cis weiblichen Bereich. Orales Östradiol erhöht es am stärksten, weil es zuerst die Leber passiert. In einer europäischen Kohorte stieg SHBG zwischen Monat 3 und Monat 12 um etwa ein Fünftel und stieg danach weiter (Collet 2023). Ein Abfall nach dem Wechsel von Tabletten auf Spritzen oder Pflaster ist zu erwarten.',
			masc: 'Fällt unter Testosteron in Richtung des cis männlichen Bereichs, dadurch steigt der freie Anteil des Testosterons.'
		}
	},

	fai: {
		en: {
			what: 'Free androgen index: 100 × total testosterone (nmol/l) ÷ SHBG (nmol/l). A simple estimate of the testosterone that SHBG does not hold back.',
			why: 'Mainly used in people with ovaries to judge androgen excess, for example when polycystic ovary syndrome is suspected.',
			high: 'More free androgen: high testosterone, low SHBG, or both. In people with ovaries a common finding in polycystic ovary syndrome.',
			low: 'Little free androgen.',
			fem: 'Settles in the cis female range.',
			masc: 'Should reach the cis male range.',
			note: 'Misleading when SHBG is very low, as it often is in men. The calculated free testosterone is the better estimate there.'
		},
		de: {
			what: 'Freier Androgenindex: 100 × Gesamttestosteron (nmol/l) ÷ SHBG (nmol/l). Eine einfache Schätzung des Testosterons, das SHBG nicht zurückhält.',
			why: 'Vor allem bei Menschen mit Eierstöcken genutzt, um einen Androgenüberschuss zu beurteilen, etwa bei Verdacht auf ein polyzystisches Ovarsyndrom.',
			high: 'Mehr freies Androgen: hohes Testosteron, niedriges SHBG oder beides. Bei Menschen mit Eierstöcken ein häufiger Befund beim polyzystischen Ovarsyndrom.',
			low: 'Wenig freies Androgen.',
			fem: 'Pendelt sich im cis weiblichen Bereich ein.',
			masc: 'Sollte den cis männlichen Bereich erreichen.',
			note: 'Irreführend, wenn SHBG sehr niedrig ist, wie oft bei Männern. Dann ist das berechnete freie Testosteron die bessere Schätzung.'
		}
	},

	dht: {
		en: {
			what: 'Dihydrotestosterone, the strongest androgen. It is made from testosterone by the enzyme 5α-reductase, mostly right where it acts: in skin, hair follicles and the prostate.',
			why: 'Rarely measured, mainly to look for an inborn 5α-reductase deficiency. It matters because it drives body and facial hair, scalp hair loss, acne and prostate growth.',
			high: 'High testosterone, or strong conversion in the tissues.',
			low: 'Low testosterone, or a 5α-reductase inhibitor such as finasteride or dutasteride.',
			fem: 'Falls with testosterone. 5α-reductase inhibitors lower it further and are sometimes used against scalp hair loss.',
			masc: 'Rises with testosterone and drives facial and body hair, and in some people scalp hair loss and acne.',
			note: 'Blood levels only partly reflect what happens in the tissues. Reliable values need mass spectrometry.'
		},
		de: {
			what: 'Dihydrotestosteron, das stärkste Androgen. Es entsteht aus Testosteron durch das Enzym 5α-Reduktase, meist direkt dort, wo es wirkt: in Haut, Haarwurzeln und Prostata.',
			why: 'Selten gemessen, vor allem bei Verdacht auf einen angeborenen 5α-Reduktase-Mangel. Wichtig ist es, weil es Körper- und Gesichtsbehaarung, Haarausfall am Kopf, Akne und das Prostatawachstum antreibt.',
			high: 'Hohes Testosteron oder starke Umwandlung im Gewebe.',
			low: 'Niedriges Testosteron oder ein 5α-Reduktase-Hemmer wie Finasterid oder Dutasterid.',
			fem: 'Sinkt mit dem Testosteron. 5α-Reduktase-Hemmer senken es weiter und werden manchmal gegen Haarausfall eingesetzt.',
			masc: 'Steigt mit dem Testosteron und treibt Gesichts- und Körperbehaarung an, bei manchen auch Haarausfall am Kopf und Akne.',
			note: 'Blutwerte spiegeln nur teilweise wider, was im Gewebe passiert. Verlässliche Werte brauchen Massenspektrometrie.'
		}
	},

	lh: {
		cites: ['sp-lh', 'endo2017'],
		en: {
			what: 'Luteinizing hormone from the pituitary. It tells the testes to make testosterone and the ovaries to make sex hormones, and a surge of LH triggers ovulation.',
			why: 'Shows where a hormone problem sits, in the gonads or in the brain. Also used in fertility testing, around menopause and to check hormone therapy.',
			high: 'The gonads do not respond and the pituitary pushes harder: menopause, a failing testis or ovary, removal of the gonads, conditions such as Klinefelter or Turner syndrome. Also the short surge before ovulation, and often in polycystic ovary syndrome.',
			low: 'The signal from the brain is missing or held down: sex hormone medication, a pituitary or hypothalamus problem, very low body weight or intense exercise, high prolactin. A value printed as "<0.1" is below what the assay can detect.',
			more: 'LH and FSH are released in pulses in response to GnRH from the hypothalamus. Sex hormones feed back and dampen this signal, which makes LH a mirror of how much hormone the body senses. If testosterone or estradiol is low while LH is high, the gonads themselves are failing (primary hypogonadism). If both are low, the signal from the brain is missing (secondary hypogonadism).\n\nIn people with a cycle LH stays moderate for most of the month and rises steeply for a day or two before ovulation, which ovulation tests detect in urine. After menopause LH and FSH stay high for good.',
			fem: 'Falls on estradiol. Cyproterone acetate and GnRH analogues suppress it directly, so LH is often below detection with them. Spironolactone and bicalutamide do not lower LH themselves, so with them any suppression comes from estradiol. After an orchiectomy LH and FSH rise unless estradiol is high enough to hold them down.',
			masc: 'Falls on adequate testosterone doses. An LH that stays high means the brain still senses too little hormone.',
			note: 'mIU/ml, U/l and IU/l are the same number.'
		},
		de: {
			what: 'Luteinisierendes Hormon aus der Hirnanhangsdrüse. Es regt die Hoden zur Testosteronbildung und die Eierstöcke zur Bildung von Sexualhormonen an, ein LH-Gipfel löst den Eisprung aus.',
			why: 'Zeigt, wo ein Hormonproblem sitzt, in den Keimdrüsen oder im Gehirn. Außerdem genutzt bei Kinderwunsch, rund um die Wechseljahre und zur Kontrolle einer Hormontherapie.',
			high: 'Die Keimdrüsen reagieren nicht und die Hirnanhangsdrüse treibt stärker an: Wechseljahre, versagende Hoden oder Eierstöcke, Entfernung der Keimdrüsen, Erkrankungen wie das Klinefelter- oder Turner-Syndrom. Außerdem der kurze Gipfel vor dem Eisprung und oft beim polyzystischen Ovarsyndrom.',
			low: 'Das Signal aus dem Gehirn fehlt oder wird gebremst: Sexualhormone als Medikament, eine Störung von Hirnanhangsdrüse oder Hypothalamus, sehr niedriges Körpergewicht oder sehr viel Sport, hohes Prolaktin. Ein Wert wie "<0,1" liegt unter der Nachweisgrenze des Tests.',
			more: 'LH und FSH werden stoßweise ausgeschüttet, als Antwort auf GnRH aus dem Hypothalamus. Sexualhormone melden zurück und dämpfen dieses Signal, LH spiegelt daher, wie viel Hormon der Körper wahrnimmt. Ist Testosteron oder Östradiol niedrig und LH hoch, versagen die Keimdrüsen selbst (primärer Hypogonadismus). Sind beide niedrig, fehlt das Signal aus dem Gehirn (sekundärer Hypogonadismus).\n\nBei Menschen mit Zyklus bleibt LH den größten Teil des Monats mäßig und steigt für ein bis zwei Tage vor dem Eisprung steil an, was Ovulationstests im Urin erkennen. Nach den Wechseljahren bleiben LH und FSH dauerhaft hoch.',
			fem: 'Sinkt unter Östradiol. Cyproteronacetat und GnRH-Analoga unterdrücken es direkt, mit ihnen liegt LH oft unter der Nachweisgrenze. Spironolacton und Bicalutamid senken LH selbst nicht, mit ihnen kommt jede Unterdrückung vom Östradiol. Nach einer Orchiektomie steigen LH und FSH, wenn Östradiol sie nicht ausreichend bremst.',
			masc: 'Sinkt bei ausreichender Testosterondosis. Bleibt LH hoch, nimmt das Gehirn noch zu wenig Hormon wahr.',
			note: 'mIU/ml, U/l und IU/l sind dieselbe Zahl.'
		}
	},

	fsh: {
		cites: ['sp-fsh'],
		en: {
			what: 'Follicle stimulating hormone from the pituitary. It drives the growth of egg follicles in the ovaries and sperm production in the testes.',
			why: 'Read together with LH: in fertility testing, with missing periods, around menopause and to locate a hormone problem.',
			high: 'Menopause and the years before it, a shrinking egg reserve, failing testes or damaged sperm production, removal of the gonads.',
			low: 'Sex hormone medication, a pituitary or hypothalamus problem, pregnancy.',
			more: 'Besides sex hormones, inhibin holds FSH down, a hormone from the growing follicles and from the sperm producing cells. As the egg reserve runs low toward menopause, inhibin falls and FSH rises, often years before periods stop. In people with testes a high FSH points to damaged sperm production even when testosterone is normal.\n\nIn people with a cycle FSH changes with the cycle day. To judge the egg reserve it is drawn early in the cycle.',
			fem: 'Falls on estradiol together with LH, most strongly with cyproterone acetate or GnRH analogues. After an orchiectomy it rises unless estradiol holds it down.',
			masc: 'Falls on adequate testosterone doses.',
			note: 'mIU/ml, U/l and IU/l are the same number.'
		},
		de: {
			what: 'Follikelstimulierendes Hormon aus der Hirnanhangsdrüse. Es treibt das Wachstum der Eibläschen in den Eierstöcken und die Spermienbildung in den Hoden an.',
			why: 'Zusammen mit LH gelesen: bei Kinderwunsch, ausbleibender Periode, rund um die Wechseljahre und um ein Hormonproblem zu verorten.',
			high: 'Die Wechseljahre und die Jahre davor, eine schwindende Eizellreserve, versagende Hoden oder eine gestörte Spermienbildung, Entfernung der Keimdrüsen.',
			low: 'Sexualhormone als Medikament, eine Störung von Hirnanhangsdrüse oder Hypothalamus, Schwangerschaft.',
			more: 'Neben den Sexualhormonen bremst Inhibin das FSH, ein Hormon aus den wachsenden Eibläschen und den spermienbildenden Zellen. Wird die Eizellreserve zu den Wechseljahren hin knapp, sinkt Inhibin und FSH steigt, oft Jahre bevor die Periode ausbleibt. Bei Menschen mit Hoden weist ein hohes FSH auf eine gestörte Spermienbildung hin, auch wenn Testosteron normal ist.\n\nBei Menschen mit Zyklus ändert sich FSH mit dem Zyklustag. Zur Beurteilung der Eizellreserve wird es früh im Zyklus abgenommen.',
			fem: 'Sinkt unter Östradiol zusammen mit LH, am stärksten mit Cyproteronacetat oder GnRH-Analoga. Nach einer Orchiektomie steigt es, wenn Östradiol es nicht bremst.',
			masc: 'Sinkt bei ausreichender Testosterondosis.',
			note: 'mIU/ml, U/l und IU/l sind dieselbe Zahl.'
		}
	},

	prolactin: {
		cites: ['sp-prolactin', 'melmed2011', 'defreyne2017', 'wpath8', 'kuijpers2021', 'ema-cpa2020', 'boekhout2023'],
		en: {
			what: 'Pituitary hormone that starts and keeps up milk production after birth. The brain holds it down all the time with dopamine.',
			why: 'Measured with milk discharge from the breasts, missing periods, low libido or erection problems, infertility, pituitary tumours, and with drugs known to raise it.',
			high: 'Pregnancy and breastfeeding, stress or a difficult blood draw, nipple stimulation, drugs that block dopamine (many antipsychotics, metoclopramide, domperidone), estrogens, an underactive thyroid, kidney failure, and a prolactinoma, a benign pituitary tumour.',
			low: 'Rarely meaningful. Dopamine agonists and damage to the pituitary can lower it.',
			more: 'Because dopamine keeps prolactin in check, anything that weakens this brake raises it: drugs that block dopamine, a pituitary tumour pressing on the pituitary stalk, or the raised TRH signal of an underactive thyroid. High prolactin in turn damps GnRH, which lowers estradiol and testosterone and leads to cycle problems, less libido and infertility.\n\nThe Endocrine Society recommends a single measurement taken without excessive stress at the needle. Values above 250 ng/ml usually point to a prolactinoma, although drugs such as risperidone or metoclopramide can also cause values above 200 ng/ml. Moderately raised values without symptoms are often macroprolactin, a large complex of prolactin and antibodies that is biologically inactive and that the lab can test for separately.',
			fem: 'A rise is common and comes mainly from cyproterone acetate, not estradiol. In a Belgian cohort on estradiol with 50 mg cyproterone the median roughly doubled and returned to normal once cyproterone was stopped after orchiectomy (Defreyne 2017). WPATH cites rises of more than 100 percent on cyproterone against about 45 percent on spironolactone. Cyproterone doses of 10 mg or less suppress testosterone about as well with a smaller rise (ENIGI 2021).\n\nSince 2020 the EMA advises daily doses of 10 mg or more only when lower doses have failed, because the rare risk of a meningioma grows with the cumulative dose. A value that keeps climbing or comes with milk discharge, headaches or vision changes needs a closer look.',
			masc: 'Tends to fall slightly on testosterone (Boekhout-Berends 2023).',
			note: 'Conversion (Roche assay): 1 ng/ml ≈ 21.2 mIU/l. Other assays use slightly different factors.'
		},
		de: {
			what: 'Hormon der Hirnanhangsdrüse, das nach der Geburt die Milchbildung startet und aufrechterhält. Das Gehirn hält es ständig mit Dopamin in Schach.',
			why: 'Gemessen bei Milchfluss aus der Brust, ausbleibender Periode, wenig Lust oder Erektionsproblemen, unerfülltem Kinderwunsch, Hypophysentumoren und unter Medikamenten, die es bekanntermaßen erhöhen.',
			high: 'Schwangerschaft und Stillzeit, Stress oder eine schwierige Blutabnahme, Reizung der Brustwarzen, Medikamente, die Dopamin blockieren (viele Antipsychotika, Metoclopramid, Domperidon), Östrogene, eine Schilddrüsenunterfunktion, Nierenversagen und ein Prolaktinom, ein gutartiger Tumor der Hirnanhangsdrüse.',
			low: 'Selten von Bedeutung. Dopaminagonisten und Schäden der Hirnanhangsdrüse können es senken.',
			more: 'Weil Dopamin Prolaktin bremst, erhöht es alles, was diese Bremse schwächt: Medikamente, die Dopamin blockieren, ein Hypophysentumor, der auf den Hypophysenstiel drückt, oder das erhöhte TRH-Signal einer Schilddrüsenunterfunktion. Hohes Prolaktin dämpft wiederum GnRH, senkt so Östradiol und Testosteron und führt zu Zyklusstörungen, weniger Lust und Unfruchtbarkeit.\n\nDie Endocrine Society empfiehlt eine einzelne Messung, abgenommen ohne übermäßigen Stress beim Stechen. Werte über 250 ng/ml sprechen meist für ein Prolaktinom, allerdings können auch Medikamente wie Risperidon oder Metoclopramid Werte über 200 ng/ml verursachen. Mäßig erhöhte Werte ohne Beschwerden sind oft Makroprolaktin, ein großer Komplex aus Prolaktin und Antikörpern, der biologisch unwirksam ist und den das Labor gesondert nachweisen kann.',
			fem: 'Ein Anstieg ist häufig und kommt vor allem vom Cyproteronacetat, nicht vom Östradiol. In einer belgischen Kohorte unter Östradiol mit 50 mg Cyproteron verdoppelte sich der Median etwa und normalisierte sich, sobald Cyproteron nach der Orchiektomie abgesetzt wurde (Defreyne 2017). WPATH nennt Anstiege von über 100 Prozent unter Cyproteron gegenüber etwa 45 Prozent unter Spironolacton. Cyproteron-Dosen von 10 mg oder weniger unterdrücken Testosteron ähnlich gut bei geringerem Anstieg (ENIGI 2021).\n\nSeit 2020 rät die EMA zu Tagesdosen ab 10 mg nur, wenn niedrigere Dosen nicht gewirkt haben, weil das seltene Risiko eines Meningeoms mit der Gesamtdosis wächst. Ein Wert, der weiter steigt oder mit Milchfluss, Kopfschmerzen oder Sehstörungen einhergeht, sollte abgeklärt werden.',
			masc: 'Sinkt unter Testosteron tendenziell etwas (Boekhout-Berends 2023).',
			note: 'Umrechnung (Roche-Test): 1 ng/ml ≈ 21,2 mIU/l. Andere Tests nutzen leicht abweichende Faktoren.'
		}
	},

	progesterone: {
		cites: ['sp-progesterone', 'wpath8'],
		en: {
			what: 'Hormone of the second half of the menstrual cycle, made by the corpus luteum after ovulation. It prepares the lining of the uterus for a pregnancy, later the placenta takes over. The adrenal glands make small amounts in every sex.',
			why: 'Mainly to confirm that ovulation took place, drawn about a week before the expected period. Also in fertility treatment, early pregnancy and when progesterone is taken.',
			high: 'The second half of the cycle, pregnancy, progesterone medication.',
			low: 'The first half of the cycle, a cycle without ovulation, menopause, and naturally in people without a cycle.',
			more: 'After ovulation the empty follicle turns into the corpus luteum, which releases progesterone for about two weeks. Without a pregnancy it stops, levels fall and the period starts. A clearly raised value around day 21 of a 28 day cycle, or 7 days before the expected period, shows that ovulation happened. In irregular cycles the right day is hard to hit, so a low value does not rule ovulation out.\n\nProgesterone raises body temperature slightly, which is what temperature based cycle tracking picks up.',
			fem: 'Some people add progesterone to feminizing HRT, hoping for effects on breasts, sleep or mood. There is no agreed target level, and evidence for benefits is limited. After oral progesterone blood levels swing strongly with the time since the dose, so a single value says little.',
			masc: 'Stays low once testosterone stops ovulation.'
		},
		de: {
			what: 'Hormon der zweiten Zyklushälfte, gebildet vom Gelbkörper nach dem Eisprung. Es bereitet die Gebärmutterschleimhaut auf eine Schwangerschaft vor, später übernimmt die Plazenta. Die Nebennieren bilden bei allen Geschlechtern kleine Mengen.',
			why: 'Vor allem um einen Eisprung zu bestätigen, abgenommen etwa eine Woche vor der erwarteten Periode. Außerdem bei Kinderwunschbehandlung, in der frühen Schwangerschaft und bei Einnahme von Progesteron.',
			high: 'Die zweite Zyklushälfte, Schwangerschaft, Progesteron als Medikament.',
			low: 'Die erste Zyklushälfte, ein Zyklus ohne Eisprung, die Wechseljahre und von Natur aus bei Menschen ohne Zyklus.',
			more: 'Nach dem Eisprung wird aus dem leeren Eibläschen der Gelbkörper, der etwa zwei Wochen lang Progesteron abgibt. Ohne Schwangerschaft endet das, die Spiegel fallen und die Periode setzt ein. Ein deutlich erhöhter Wert um Tag 21 eines 28-Tage-Zyklus, oder 7 Tage vor der erwarteten Periode, zeigt, dass ein Eisprung stattgefunden hat. Bei unregelmäßigem Zyklus ist der richtige Tag schwer zu treffen, ein niedriger Wert schließt einen Eisprung daher nicht aus.\n\nProgesteron hebt die Körpertemperatur leicht an, genau das erfasst die Temperaturmethode der Zyklusbeobachtung.',
			fem: 'Manche ergänzen feminisierende HRT um Progesteron, in der Hoffnung auf Wirkungen auf Brust, Schlaf oder Stimmung. Es gibt keinen vereinbarten Zielwert, und die Belege für einen Nutzen sind begrenzt. Nach oralem Progesteron schwanken die Blutspiegel stark mit dem Abstand zur Einnahme, ein Einzelwert sagt daher wenig.',
			masc: 'Bleibt niedrig, sobald Testosteron den Eisprung unterbindet.'
		}
	},

	amh: {
		cites: ['steiner2017', 'caanen2015', 'wpath8'],
		en: {
			what: 'Anti-Müllerian hormone. In people with ovaries it comes from the small growing follicles, in people with testes from the Sertoli cells.',
			why: 'In people with ovaries a marker of the remaining egg reserve, used in fertility treatment, before egg freezing and before treatments that can harm the ovaries.',
			high: 'Many small follicles, typical of polycystic ovary syndrome. Also normal at a young age.',
			low: 'A small egg reserve, which shrinks with age and after chemotherapy, radiation or ovarian surgery.',
			more: 'The supply of eggs is fixed before birth and shrinks throughout life. AMH reflects how many small follicles are currently growing, so it falls steadily with age and becomes undetectable around menopause. It changes little across the cycle and can be drawn on any day.\n\nAMH predicts how many eggs a stimulation for IVF or egg freezing will yield, but not the chance of a natural pregnancy: in a cohort of women aged 30 to 44, those with low AMH conceived about as often as the others (Steiner 2017). In people with testes AMH is very high in childhood and falls at puberty.',
			masc: 'Studies disagree on how AMH changes on testosterone. One study that combined testosterone with ovarian suppression saw a clear fall within 16 weeks (Caanen 2015), others found it largely stable. AMH says nothing definite about future fertility, and testosterone is not reliable contraception. Fertility preservation is best discussed before starting.',
			note: 'Strongly age dependent, so no fixed cis female range is given here.'
		},
		de: {
			what: 'Anti-Müller-Hormon. Bei Menschen mit Eierstöcken stammt es aus den kleinen wachsenden Eibläschen, bei Menschen mit Hoden aus den Sertoli-Zellen.',
			why: 'Bei Menschen mit Eierstöcken ein Marker für die verbleibende Eizellreserve, genutzt in der Kinderwunschbehandlung, vor dem Einfrieren von Eizellen und vor Behandlungen, die den Eierstöcken schaden können.',
			high: 'Viele kleine Eibläschen, typisch für das polyzystische Ovarsyndrom. In jungen Jahren auch normal.',
			low: 'Eine kleine Eizellreserve, die mit dem Alter und nach Chemotherapie, Bestrahlung oder Operationen an den Eierstöcken schrumpft.',
			more: 'Der Vorrat an Eizellen steht schon vor der Geburt fest und schrumpft das ganze Leben lang. AMH zeigt, wie viele kleine Eibläschen gerade heranwachsen, es sinkt daher stetig mit dem Alter und ist um die Wechseljahre nicht mehr nachweisbar. Es schwankt im Zyklus wenig und kann an jedem Tag abgenommen werden.\n\nAMH sagt voraus, wie viele Eizellen eine Stimulation für IVF oder Social Freezing ergibt, aber nicht die Chance auf eine natürliche Schwangerschaft: In einer Kohorte von Frauen zwischen 30 und 44 wurden die mit niedrigem AMH etwa genauso oft schwanger wie die anderen (Steiner 2017). Bei Menschen mit Hoden ist AMH in der Kindheit sehr hoch und fällt in der Pubertät.',
			masc: 'Studien sind sich uneinig, wie sich AMH unter Testosteron verändert. Eine Studie, die Testosteron mit einer Unterdrückung der Eierstöcke kombinierte, sah einen deutlichen Abfall innerhalb von 16 Wochen (Caanen 2015), andere fanden es weitgehend stabil. AMH sagt nichts Sicheres über die spätere Fruchtbarkeit, und Testosteron ist keine verlässliche Verhütung. Fruchtbarkeitserhalt bespricht man am besten vor dem Start.',
			note: 'Stark altersabhängig, daher ist hier kein fester cis weiblicher Bereich angegeben.'
		}
	},

	'dhea-s': {
		cites: ['collet2023'],
		en: {
			what: 'Dehydroepiandrosterone sulfate, a weak androgen precursor made almost only by the adrenal glands. Tissues can turn it into testosterone and estradiol.',
			why: 'Tells androgens from the adrenal glands apart from those of the gonads, for example with acne, unwanted hair or early puberty.',
			high: 'Congenital adrenal hyperplasia, polycystic ovary syndrome in some people, DHEA supplements, and with very high values rarely an adrenal tumour.',
			low: 'Older age, adrenal or pituitary insufficiency, glucocorticoid medication.',
			more: 'DHEA-S has hardly any daily rhythm and is stable in blood, which makes it a convenient marker of adrenal androgen output. Levels start rising in mid childhood (adrenarche), peak in the twenties and then fall steadily, to a fraction by old age. Only age matched ranges make sense.',
			fem: 'Estradiol and antiandrogens act on the gonads, not the adrenal glands, so DHEA-S changes little. In one European cohort it fell by about a fifth during the first year of estradiol with cyproterone and then stayed stable, also after gonadectomy (Collet 2023).',
			note: 'Falls steadily with age, compare with age matched ranges.'
		},
		de: {
			what: 'Dehydroepiandrosteronsulfat, eine schwache Androgen-Vorstufe, die fast nur in den Nebennieren entsteht. Das Gewebe kann daraus Testosteron und Östradiol machen.',
			why: 'Trennt Androgene aus den Nebennieren von denen der Keimdrüsen, etwa bei Akne, unerwünschter Behaarung oder verfrühter Pubertät.',
			high: 'Adrenogenitales Syndrom, bei manchen ein polyzystisches Ovarsyndrom, DHEA-Präparate und bei sehr hohen Werten selten ein Nebennierentumor.',
			low: 'Höheres Alter, Unterfunktion von Nebenniere oder Hirnanhangsdrüse, Glukokortikoide als Medikament.',
			more: 'DHEA-S hat kaum einen Tagesrhythmus und ist im Blut stabil, das macht es zu einem bequemen Marker für die Androgenbildung der Nebennieren. Die Spiegel steigen ab der mittleren Kindheit (Adrenarche), erreichen in den Zwanzigern ihren Gipfel und fallen danach stetig, bis ins hohe Alter auf einen Bruchteil. Nur altersgerechte Bereiche ergeben Sinn.',
			fem: 'Östradiol und Antiandrogene wirken auf die Keimdrüsen, nicht auf die Nebennieren, DHEA-S ändert sich daher wenig. In einer europäischen Kohorte sank es im ersten Jahr unter Östradiol mit Cyproteron um etwa ein Fünftel und blieb danach stabil, auch nach einer Gonadektomie (Collet 2023).',
			note: 'Sinkt stetig mit dem Alter, vergleiche mit altersgerechten Bereichen.'
		}
	},

	cortisol: {
		cites: ['sp-cortisol', 'qureshi2007'],
		en: {
			what: 'The main stress hormone from the adrenal glands. It raises blood sugar, damps inflammation and helps the body cope with illness and strain.',
			why: 'Screens for adrenal insufficiency, too little cortisol, and gives a first hint of Cushing syndrome, too much.',
			high: 'The early morning, stress, acute illness, pain, intense exercise, a difficult draw, pregnancy, estrogen tablets and the pill (they raise the binding protein), rarely Cushing syndrome.',
			low: 'Draws in the afternoon or at night, glucocorticoid medication including sprays, creams or joint injections, rarely adrenal or pituitary insufficiency.',
			more: 'Cortisol follows a strong daily rhythm: it peaks shortly after waking, falls through the day and is lowest around midnight. A value only means something together with the time of the draw, and morning draws are the standard.\n\nAbout 90 percent circulates bound, mostly to cortisol binding globulin (CBG). Oral estrogen, including the pill, raises CBG and with it total cortisol without more active hormone, transdermal estradiol barely does (Qureshi 2007).\n\nA single random cortisol cannot confirm Cushing syndrome. That needs late night saliva cortisol, 24 hour urine or a dexamethasone suppression test, and insufficiency is confirmed with an ACTH stimulation test.',
			fem: 'Oral estradiol raises CBG and with it total cortisol, without more active hormone. Transdermal estradiol barely has this effect (Qureshi 2007).',
			note: 'Only compare draws taken at a similar time of day.'
		},
		de: {
			what: 'Das wichtigste Stresshormon aus den Nebennieren. Es hebt den Blutzucker, dämpft Entzündungen und hilft dem Körper, Krankheit und Belastung zu bewältigen.',
			why: 'Sucht nach einer Nebenniereninsuffizienz, also zu wenig Cortisol, und gibt einen ersten Hinweis auf ein Cushing-Syndrom, also zu viel.',
			high: 'Der frühe Morgen, Stress, akute Krankheit, Schmerzen, intensiver Sport, eine schwierige Abnahme, Schwangerschaft, Östrogentabletten und die Pille (sie erhöhen das Bindungseiweiß), selten ein Cushing-Syndrom.',
			low: 'Abnahmen am Nachmittag oder in der Nacht, Glukokortikoide als Medikament, auch als Spray, Creme oder Gelenkspritze, selten eine Unterfunktion von Nebenniere oder Hirnanhangsdrüse.',
			more: 'Cortisol folgt einem ausgeprägten Tagesrhythmus: Es erreicht kurz nach dem Aufwachen seinen Gipfel, fällt über den Tag und ist um Mitternacht am niedrigsten. Ein Wert sagt nur zusammen mit der Uhrzeit der Abnahme etwas, Standard sind Abnahmen am Morgen.\n\nEtwa 90 Prozent zirkulieren gebunden, vor allem an cortisolbindendes Globulin (CBG). Orales Östrogen, auch die Pille, erhöht CBG und damit das Gesamtcortisol ohne mehr wirksames Hormon, transdermales Östradiol kaum (Qureshi 2007).\n\nEin einzelner zufälliger Cortisolwert kann kein Cushing-Syndrom bestätigen. Dafür braucht es Speichelcortisol spät abends, 24-Stunden-Urin oder einen Dexamethason-Hemmtest, eine Unterfunktion wird mit einem ACTH-Test bestätigt.',
			fem: 'Orales Östradiol erhöht CBG und damit das Gesamtcortisol, ohne mehr wirksames Hormon. Transdermales Östradiol hat diesen Effekt kaum (Qureshi 2007).',
			note: 'Vergleiche nur Abnahmen zu ähnlicher Tageszeit.'
		}
	},

	tsh: {
		cites: ['sp-tsh', 'hollowell2002', 'arafah2001'],
		en: {
			what: 'Thyroid stimulating hormone from the pituitary. It drives the thyroid to make hormone, and thyroid hormone in turn damps TSH.',
			why: 'The most sensitive single test of thyroid function. Used for screening, with tiredness, weight changes, a racing heart or cycle problems, and to adjust thyroid medication.',
			high: 'An underactive thyroid, most often from Hashimoto thyroiditis, too little thyroid medication, iodine deficiency, recovery after a severe illness. Rises slightly with age.',
			low: 'An overactive thyroid (Graves disease, hot nodules), too much thyroid medication, early pregnancy, severe illness, high dose glucocorticoids, rarely pituitary failure.',
			more: 'The pituitary reacts very sensitively to small changes in thyroid hormone: a small drop in free T4 raises TSH many times over. That makes TSH the first value to leave its range, often before free T4 does. A raised TSH with normal free T4 is called subclinical hypothyroidism and is often only watched.\n\nTSH rises slightly with age and is often higher in older people without thyroid disease (Hollowell 2002). It is higher at night than during the day, so compare draws at a similar time. After a change of thyroid medication it needs six to eight weeks to settle.',
			fem: 'Oral estrogen raises thyroxine binding globulin, the protein that carries thyroid hormone. With a healthy thyroid TSH stays normal, but people taking levothyroxine may need a higher dose, so a TSH check a few months after starting oral estradiol makes sense (Arafah 2001).',
			note: 'µIU/ml, µU/ml and mU/l are the same number. High dose biotin supplements can disturb the measurement.'
		},
		de: {
			what: 'Thyreoidea-stimulierendes Hormon aus der Hirnanhangsdrüse. Es treibt die Schilddrüse zur Hormonbildung an, Schilddrüsenhormon bremst wiederum das TSH.',
			why: 'Der empfindlichste Einzeltest der Schilddrüsenfunktion. Genutzt zur Vorsorge, bei Müdigkeit, Gewichtsveränderungen, Herzrasen oder Zyklusstörungen und zur Einstellung von Schilddrüsenmedikamenten.',
			high: 'Eine Schilddrüsenunterfunktion, meist durch eine Hashimoto-Thyreoiditis, zu wenig Schilddrüsenmedikament, Jodmangel, die Erholung nach schwerer Krankheit. Steigt mit dem Alter leicht an.',
			low: 'Eine Schilddrüsenüberfunktion (Morbus Basedow, heiße Knoten), zu viel Schilddrüsenmedikament, frühe Schwangerschaft, schwere Krankheit, hoch dosierte Glukokortikoide, selten ein Ausfall der Hirnanhangsdrüse.',
			more: 'Die Hirnanhangsdrüse reagiert sehr empfindlich auf kleine Änderungen des Schilddrüsenhormons: Ein kleiner Abfall des freien T4 lässt TSH um ein Vielfaches steigen. Deshalb verlässt TSH seinen Bereich meist als erster Wert, oft bevor freies T4 es tut. Ein erhöhtes TSH bei normalem freien T4 heißt latente Hypothyreose und wird oft nur beobachtet.\n\nTSH steigt mit dem Alter leicht und ist bei älteren Menschen ohne Schilddrüsenerkrankung oft höher (Hollowell 2002). Nachts ist es höher als tagsüber, vergleiche daher Abnahmen zu ähnlicher Zeit. Nach einer Änderung des Schilddrüsenmedikaments braucht es sechs bis acht Wochen, bis es sich einpendelt.',
			fem: 'Orales Östrogen erhöht das thyroxinbindende Globulin, das Eiweiß, das Schilddrüsenhormon transportiert. Bei gesunder Schilddrüse bleibt TSH normal, wer aber Levothyroxin nimmt, braucht eventuell mehr. Eine TSH-Kontrolle einige Monate nach Beginn mit oralem Östradiol ist daher sinnvoll (Arafah 2001).',
			note: 'µIU/ml, µU/ml und mU/l sind dieselbe Zahl. Hoch dosiertes Biotin kann die Messung stören.'
		}
	},

	ft4: {
		cites: ['sp-tsh', 'arafah2001'],
		en: {
			what: 'The unbound, active part of thyroxine (T4), the main hormone the thyroid releases. Almost all T4 is bound to carrier proteins, only a tiny fraction circulates free.',
			why: 'Read together with TSH to tell how strong a thyroid problem is and where it sits, and to adjust thyroid medication.',
			high: 'An overactive thyroid, too much levothyroxine, a draw within a few hours of the tablet, some drugs such as amiodarone or heparin.',
			low: 'An underactive thyroid, pituitary failure (then TSH is not raised), severe illness.',
			more: 'Free T4 and TSH move in opposite directions when the thyroid itself is the problem. If both are low, the signal from the pituitary is missing (central hypothyroidism), which TSH alone would miss.\n\nMost labs measure free T4 by immunoassay, which can be disturbed by high dose biotin, by pregnancy and by unusual binding proteins. Values from different methods do not compare directly.',
			fem: 'Oral estrogen raises the carrier proteins, but free T4 usually stays normal with a healthy thyroid. People on levothyroxine may need a dose check.'
		},
		de: {
			what: 'Der ungebundene, wirksame Teil des Thyroxins (T4), des wichtigsten Hormons, das die Schilddrüse abgibt. Fast alles T4 ist an Transporteiweiße gebunden, nur ein winziger Teil zirkuliert frei.',
			why: 'Zusammen mit TSH gelesen, um zu erkennen, wie stark eine Schilddrüsenstörung ist und wo sie sitzt, und um Schilddrüsenmedikamente einzustellen.',
			high: 'Eine Schilddrüsenüberfunktion, zu viel Levothyroxin, eine Abnahme wenige Stunden nach der Tablette, manche Medikamente wie Amiodaron oder Heparin.',
			low: 'Eine Schilddrüsenunterfunktion, ein Ausfall der Hirnanhangsdrüse (dann ist TSH nicht erhöht), schwere Krankheit.',
			more: 'Freies T4 und TSH bewegen sich gegenläufig, wenn die Schilddrüse selbst das Problem ist. Sind beide niedrig, fehlt das Signal der Hirnanhangsdrüse (zentrale Hypothyreose), was TSH allein übersehen würde.\n\nDie meisten Labore messen freies T4 per Immunoassay, der durch hoch dosiertes Biotin, eine Schwangerschaft und ungewöhnliche Bindungseiweiße gestört werden kann. Werte verschiedener Methoden sind nicht direkt vergleichbar.',
			fem: 'Orales Östrogen erhöht die Transporteiweiße, freies T4 bleibt bei gesunder Schilddrüse aber meist normal. Wer Levothyroxin nimmt, sollte die Dosis prüfen lassen.'
		}
	},

	ft3: {
		cites: ['sp-tsh'],
		en: {
			what: 'The unbound form of T3, the most active thyroid hormone. Only about a fifth comes directly from the thyroid, the rest is converted from T4 in the tissues.',
			why: 'Adds information when TSH is low or an overactive thyroid is suspected, since some forms raise only T3.',
			high: 'An overactive thyroid, especially early or nodular forms, too much T3 medication.',
			low: 'An underactive thyroid, or less conversion from T4 during severe illness, fasting or strict dieting without any thyroid disease.'
		},
		de: {
			what: 'Die ungebundene Form von T3, dem wirksamsten Schilddrüsenhormon. Nur etwa ein Fünftel stammt direkt aus der Schilddrüse, der Rest wird im Gewebe aus T4 umgewandelt.',
			why: 'Ergänzt das Bild, wenn TSH niedrig ist oder eine Überfunktion vermutet wird, weil manche Formen nur T3 erhöhen.',
			high: 'Eine Schilddrüsenüberfunktion, besonders frühe oder knotige Formen, zu viel T3 als Medikament.',
			low: 'Eine Schilddrüsenunterfunktion oder weniger Umwandlung aus T4 bei schwerer Krankheit, Fasten oder strenger Diät, ohne dass die Schilddrüse krank ist.'
		}
	},

	'anti-tpo': {
		cites: ['sp-hashimoto', 'hollowell2002'],
		en: {
			what: 'Antibodies against thyroid peroxidase, the enzyme that builds thyroid hormone.',
			why: 'Detects autoimmune thyroid disease, mainly Hashimoto thyroiditis, the most common cause of an underactive thyroid where iodine intake is sufficient. Often checked when TSH is raised.',
			high: 'Hashimoto thyroiditis, Graves disease, thyroiditis after giving birth. Also found in many healthy people, especially women and older people.',
			low: 'Normal. A negative result does not fully rule out autoimmune thyroid disease.',
			more: 'In a large US survey 11 percent of people had TPO antibodies, more often women and older people (Hollowell 2002). Antibodies alone are not a disease. They raise the chance of developing an underactive thyroid over the following years, so TSH is worth checking now and then.\n\nThe antibodies can appear years before thyroid function changes, and their height does not track how active the disease is. Once they are known to be positive, repeated measurements add little.',
			note: 'Cutoffs depend strongly on the assay, use the lab range.'
		},
		de: {
			what: 'Antikörper gegen die Thyreoperoxidase, das Enzym, das Schilddrüsenhormon aufbaut.',
			why: 'Weist eine autoimmune Schilddrüsenerkrankung nach, vor allem die Hashimoto-Thyreoiditis, die häufigste Ursache einer Unterfunktion bei ausreichender Jodversorgung. Oft bestimmt, wenn TSH erhöht ist.',
			high: 'Hashimoto-Thyreoiditis, Morbus Basedow, eine Schilddrüsenentzündung nach der Geburt. Auch bei vielen Gesunden, besonders bei Frauen und älteren Menschen.',
			low: 'Normal. Ein negatives Ergebnis schließt eine autoimmune Schilddrüsenerkrankung nicht ganz aus.',
			more: 'In einer großen US-Erhebung hatten 11 Prozent der Menschen TPO-Antikörper, häufiger Frauen und Ältere (Hollowell 2002). Antikörper allein sind keine Krankheit. Sie erhöhen die Wahrscheinlichkeit, in den folgenden Jahren eine Unterfunktion zu entwickeln, deshalb lohnt sich ab und zu ein Blick auf das TSH.\n\nDie Antikörper können Jahre vor einer Funktionsänderung auftreten, und ihre Höhe zeigt nicht, wie aktiv die Erkrankung ist. Sind sie einmal als positiv bekannt, bringen wiederholte Messungen wenig.',
			note: 'Grenzwerte hängen stark vom Test ab, nutze den Laborbereich.'
		}
	}
};
