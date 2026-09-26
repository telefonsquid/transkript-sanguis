import type { AnalyteInfo, InfoEntry, Lang } from '../types';

type Texts = Record<Lang, Partial<AnalyteInfo>>;

// Shared by red cell count, haemoglobin and hematocrit
const RED_CELLS: Texts = {
	en: {
		fem: 'Testosterone drives red cell production. Once it is suppressed, red cell count, haemoglobin and hematocrit fall into the cis female range, mostly within the first year. A large Dutch cohort therefore recommends judging them against female ranges after one year of HRT (Boekhout-Berends 2023). A value that stays in the male range can mean testosterone is not suppressed enough.',
		masc: 'Testosterone drives red cell production, so values rise into the cis male range within the first year. Too many red cells thicken the blood and raise the risk of clots. Smoking, long acting undecanoate injections, higher age, a high BMI and lung conditions raise that risk (Madsen 2021). WPATH advises checking hematocrit before starting, about every three months in the first year and then once or twice a year. The Endocrine Society guideline for cis men suggests pausing or lowering testosterone above 54 percent.'
	},
	de: {
		fem: 'Testosteron treibt die Bildung roter Blutkörperchen an. Sobald es unterdrückt ist, fallen Erythrozyten, Hämoglobin und Hämatokrit in den cis weiblichen Bereich, meist innerhalb des ersten Jahres. Eine große niederländische Kohorte empfiehlt daher, sie nach einem Jahr HRT an weiblichen Bereichen zu messen (Boekhout-Berends 2023). Bleibt ein Wert im männlichen Bereich, ist Testosteron vielleicht nicht ausreichend unterdrückt.',
		masc: 'Testosteron treibt die Bildung roter Blutkörperchen an, die Werte steigen daher im ersten Jahr in den cis männlichen Bereich. Zu viele rote Blutkörperchen machen das Blut dicker und erhöhen das Risiko für Gerinnsel. Rauchen, Depotspritzen mit Undecanoat, höheres Alter, ein hoher BMI und Lungenerkrankungen erhöhen dieses Risiko (Madsen 2021). WPATH rät, den Hämatokrit vor dem Start, im ersten Jahr etwa alle drei Monate und danach ein- bis zweimal im Jahr zu prüfen. Die Leitlinie der Endocrine Society für cis Männer schlägt über 54 Prozent vor, Testosteron zu pausieren oder zu senken.'
	}
};

// Shared by the clotting values that people on estrogen tend to look at
const CLOT_RISK: Texts = {
	en: {
		fem: 'Estrogen raises clotting factors made in the liver and is linked to a higher risk of thrombosis, most clearly with oral estrogen and together with smoking. Routine clotting tests such as Quick, INR, aPTT or D-dimer do not measure that risk, so normal values do not rule it out. With other risk factors, such as smoking, earlier clots, a family history or long immobility, estradiol through the skin (gel or patch) is often preferred.'
	},
	de: {
		fem: 'Östrogen erhöht die in der Leber gebildeten Gerinnungsfaktoren und geht mit einem höheren Thromboserisiko einher, am deutlichsten bei oralem Östrogen und zusammen mit Rauchen. Übliche Gerinnungstests wie Quick, INR, aPTT oder D-Dimer messen dieses Risiko nicht, normale Werte schließen es daher nicht aus. Bei weiteren Risikofaktoren wie Rauchen, früheren Gerinnseln, familiärer Vorbelastung oder langer Bettlägerigkeit wird Östradiol über die Haut (Gel oder Pflaster) oft bevorzugt.'
	}
};

interface Cell {
	id: string;
	cites?: string[];
	en: AnalyteInfo;
	de: AnalyteInfo;
}

// Differential cell types, each becomes a percentage and an absolute entry
const CELLS: Cell[] = [
	{
		id: 'neutrophils',
		cites: ['merz2023'],
		en: {
			what: 'The most common white cells, first responders against bacteria and fungi.',
			why: '',
			high: 'Bacterial infection, inflammation, physical stress, cortisone, smoking, pregnancy. High neutrophils with low lymphocytes and eosinophils is the typical pattern of stress hormones.',
			low: 'Viral infections, some medications, autoimmune conditions, bone marrow problems. In people with the Duffy null blood type, common with African ancestry, counts are lower without any disease.',
			note: 'The Duffy null blood type is found in most people of Sub-Saharan African ancestry and in under 1 percent of people of European or Asian ancestry. Their neutrophils are lower without a higher infection risk, and standard ranges can wrongly flag them (Merz 2023).'
		},
		de: {
			what: 'Die häufigsten weißen Blutkörperchen, erste Abwehr gegen Bakterien und Pilze.',
			why: '',
			high: 'Bakterielle Infektion, Entzündung, körperlicher Stress, Kortison, Rauchen, Schwangerschaft. Hohe Neutrophile mit niedrigen Lymphozyten und Eosinophilen ist das typische Muster von Stresshormonen.',
			low: 'Virusinfekte, manche Medikamente, Autoimmunerkrankungen, Knochenmarkprobleme. Bei Menschen mit der Blutgruppe Duffy-negativ, häufig bei afrikanischer Abstammung, sind die Werte ohne Krankheit niedriger.',
			note: 'Die Blutgruppe Duffy-negativ findet sich bei den meisten Menschen mit Abstammung aus Subsahara-Afrika und bei unter 1 Prozent der Menschen europäischer oder asiatischer Abstammung. Ihre Neutrophilen sind niedriger, ohne dass das Infektionsrisiko steigt, und Standardbereiche können sie fälschlich markieren (Merz 2023).'
		}
	},
	{
		id: 'lymphocytes',
		en: {
			what: 'T, B and NK cells, the adaptive immune system that remembers pathogens and makes antibodies.',
			why: '',
			high: 'Viral infections such as glandular fever, whooping cough, rarely a disease of the lymphatic system.',
			low: 'Acute stress, cortisone, some infections including HIV, some medications.'
		},
		de: {
			what: 'T-, B- und NK-Zellen, das erworbene Immunsystem, das sich Erreger merkt und Antikörper bildet.',
			why: '',
			high: 'Virusinfekte wie Pfeiffersches Drüsenfieber, Keuchhusten, selten eine Erkrankung des lymphatischen Systems.',
			low: 'Akuter Stress, Kortison, manche Infektionen einschließlich HIV, manche Medikamente.'
		}
	},
	{
		id: 'monocytes',
		en: {
			what: 'Large white cells that move into tissue and become macrophages, which eat pathogens and debris.',
			why: '',
			high: 'Chronic infection or inflammation, the recovery phase after an infection, rarely a bone marrow disorder.',
			low: 'Rarely meaningful alone.'
		},
		de: {
			what: 'Große weiße Blutkörperchen, die ins Gewebe wandern und zu Makrophagen werden, die Erreger und Zelltrümmer fressen.',
			why: '',
			high: 'Chronische Infektion oder Entzündung, die Erholungsphase nach einer Infektion, selten eine Knochenmarkerkrankung.',
			low: 'Allein selten von Bedeutung.'
		}
	},
	{
		id: 'eosinophils',
		en: {
			what: 'White cells involved in allergies and the defence against parasites.',
			why: '',
			high: 'Allergies, hay fever, asthma, eczema, parasites, some drugs.',
			low: 'Acute stress or cortisone. Usually meaningless alone.'
		},
		de: {
			what: 'Weiße Blutkörperchen, die an Allergien und der Abwehr von Parasiten beteiligt sind.',
			why: '',
			high: 'Allergien, Heuschnupfen, Asthma, Ekzeme, Parasiten, manche Medikamente.',
			low: 'Akuter Stress oder Kortison. Allein meist bedeutungslos.'
		}
	},
	{
		id: 'basophils',
		en: {
			what: 'The rarest white cells, which release histamine in allergic reactions.',
			why: '',
			high: 'Allergic reactions, rarely a bone marrow disorder.',
			low: 'Not meaningful.'
		},
		de: {
			what: 'Die seltensten weißen Blutkörperchen, die bei allergischen Reaktionen Histamin freisetzen.',
			why: '',
			high: 'Allergische Reaktionen, selten eine Knochenmarkerkrankung.',
			low: 'Ohne Bedeutung.'
		}
	},
	{
		id: 'ig',
		en: {
			what: 'Young precursors of neutrophils that normally stay in the bone marrow.',
			why: '',
			high: 'Infection, inflammation, pregnancy, anything that drives the bone marrow hard. Small amounts are common.',
			low: 'Not meaningful.'
		},
		de: {
			what: 'Junge Vorstufen der Neutrophilen, die normalerweise im Knochenmark bleiben.',
			why: '',
			high: 'Infektion, Entzündung, Schwangerschaft, alles, was das Knochenmark stark antreibt. Kleine Mengen sind häufig.',
			low: 'Ohne Bedeutung.'
		}
	}
];

const PCT = {
	en: { what: ' Share of all white cells.', why: 'Part of the differential blood count, which breaks the white cell count down by cell type.' },
	de: { what: ' Anteil an allen weißen Blutkörperchen.', why: 'Teil des Differentialblutbilds, das die Leukozyten nach Zelltyp aufschlüsselt.' }
};

const ABS = {
	en: { what: ' Absolute count per nanolitre.', why: 'The absolute count matters more than the percentage, because a percentage moves whenever another cell type changes.' },
	de: { what: ' Absolute Anzahl pro Nanoliter.', why: 'Die absolute Zahl sagt mehr als der Prozentwert, weil sich Prozente verschieben, sobald sich ein anderer Zelltyp ändert.' }
};

// Percentage and absolute entry of one cell type
function differential(cell: Cell): [string, InfoEntry][] {
	const entry = (kind: typeof PCT): InfoEntry => ({
		cites: cell.cites,
		en: { ...cell.en, what: cell.en.what + kind.en.what, why: kind.en.why },
		de: { ...cell.de, what: cell.de.what + kind.de.what, why: kind.de.why }
	});
	return [
		[`${cell.id}-pct`, entry(PCT)],
		[`${cell.id}-abs`, entry(ABS)]
	];
}

export const blood: Record<string, InfoEntry> = {
	leukocytes: {
		en: {
			what: 'All white blood cells together: the cells of the immune system travelling in the blood.',
			why: 'A basic screen for infection, inflammation and bone marrow problems. The differential count breaks it down by cell type.',
			high: 'Infection, inflammation, physical or emotional stress, smoking, cortisone, pregnancy. Mild short lived rises just above the range are common and usually harmless.',
			low: 'Viral infections, some medications, autoimmune or bone marrow conditions. Slightly lower counts without disease are common with the Duffy null blood type.',
			note: '/nl, G/l and 10⁹/l are the same number.'
		},
		de: {
			what: 'Alle weißen Blutkörperchen zusammen: die Zellen des Immunsystems, die im Blut unterwegs sind.',
			why: 'Grundlegender Suchtest auf Infektion, Entzündung und Knochenmarkprobleme. Das Differentialblutbild schlüsselt ihn nach Zelltyp auf.',
			high: 'Infektion, Entzündung, körperlicher oder seelischer Stress, Rauchen, Kortison, Schwangerschaft. Leichte, kurze Anstiege knapp über den Bereich sind häufig und meist harmlos.',
			low: 'Virusinfekte, manche Medikamente, Autoimmun- oder Knochenmarkerkrankungen. Etwas niedrigere Werte ohne Krankheit sind bei der Blutgruppe Duffy-negativ häufig.',
			note: '/nl, G/l und 10⁹/l sind dieselbe Zahl.'
		}
	},

	erythrocytes: {
		cites: ['greene2019', 'boekhout2023', 'madsen2021', 'wpath8', 'bhasin2018'],
		en: {
			what: 'The number of red blood cells, which carry oxygen from the lungs to the tissues.',
			why: 'Read together with haemoglobin and hematocrit to find anaemia or too many red cells.',
			high: 'Testosterone, dehydration, smoking, living at altitude, lung disease or sleep apnoea, rarely a bone marrow disorder. Thalassaemia trait gives many small cells.',
			low: 'Anaemia from blood loss, iron or vitamin deficiency, chronic disease, pregnancy.',
			...RED_CELLS.en,
			note: '/pl, T/l and 10¹²/l are the same number.'
		},
		de: {
			what: 'Die Anzahl der roten Blutkörperchen, die Sauerstoff von der Lunge ins Gewebe bringen.',
			why: 'Zusammen mit Hämoglobin und Hämatokrit gelesen, um eine Blutarmut oder zu viele rote Blutkörperchen zu erkennen.',
			high: 'Testosteron, Flüssigkeitsmangel, Rauchen, Leben in großer Höhe, Lungenerkrankungen oder Schlafapnoe, selten eine Knochenmarkerkrankung. Eine Thalassämie-Anlage ergibt viele kleine Zellen.',
			low: 'Blutarmut durch Blutverlust, Eisen- oder Vitaminmangel, chronische Erkrankungen, Schwangerschaft.',
			...RED_CELLS.de,
			note: '/pl, T/l und 10¹²/l sind dieselbe Zahl.'
		}
	},

	hemoglobin: {
		cites: ['who-hb2024', 'sp-ida', 'sp-polycythemia', 'greene2019', 'boekhout2023', 'madsen2021', 'wpath8', 'bhasin2018'],
		en: {
			what: 'The iron containing protein inside red blood cells that binds oxygen.',
			why: 'The key number for anaemia. It also mirrors how much testosterone acts, which makes it useful on hormone therapy.',
			high: 'Testosterone, dehydration, smoking, lung disease or sleep apnoea, living at altitude, rarely a bone marrow disorder called polycythaemia vera.',
			low: 'Anaemia: blood loss including heavy periods, iron, B12 or folate deficiency, chronic inflammation or kidney disease, pregnancy.',
			more: 'The WHO defines anaemia as haemoglobin below 12.0 g/dl in non pregnant women and below 13.0 g/dl in men (WHO 2024). The gap between the sexes comes mostly from testosterone, which stimulates the kidney hormone erythropoietin and the bone marrow, and partly from menstrual blood loss.\n\nIron deficiency is the most common cause of anaemia worldwide. Haemoglobin falls late, after the iron stores (ferritin) are already empty, and the red cells become small and pale (low MCV and MCH). A B12 or folate deficiency makes them large instead.\n\nToo much haemoglobin is called erythrocytosis. It often comes from outside the bone marrow: testosterone, smoking, low oxygen during sleep or at altitude. Dehydration raises the value only on paper, because the red cells are simply less diluted.',
			...RED_CELLS.en,
			note: 'Conversion: 1 g/dl = 0.6206 mmol/l.'
		},
		de: {
			what: 'Das eisenhaltige Eiweiß in den roten Blutkörperchen, das Sauerstoff bindet.',
			why: 'Der wichtigste Wert für Blutarmut. Außerdem spiegelt es, wie viel Testosteron wirkt, das macht es unter Hormontherapie nützlich.',
			high: 'Testosteron, Flüssigkeitsmangel, Rauchen, Lungenerkrankungen oder Schlafapnoe, Leben in großer Höhe, selten eine Knochenmarkerkrankung namens Polycythaemia vera.',
			low: 'Blutarmut: Blutverlust einschließlich starker Periode, Eisen-, B12- oder Folsäuremangel, chronische Entzündung oder Nierenerkrankung, Schwangerschaft.',
			more: 'Die WHO definiert Blutarmut als Hämoglobin unter 12,0 g/dl bei nicht schwangeren Frauen und unter 13,0 g/dl bei Männern (WHO 2024). Der Unterschied zwischen den Geschlechtern kommt vor allem vom Testosteron, das das Nierenhormon Erythropoetin und das Knochenmark anregt, und teils vom Blutverlust durch die Periode.\n\nEisenmangel ist weltweit die häufigste Ursache einer Blutarmut. Hämoglobin fällt spät, wenn die Eisenspeicher (Ferritin) schon leer sind, und die roten Blutkörperchen werden klein und blass (niedriges MCV und MCH). Ein B12- oder Folsäuremangel macht sie dagegen groß.\n\nZu viel Hämoglobin heißt Erythrozytose. Sie kommt oft von außerhalb des Knochenmarks: Testosteron, Rauchen, Sauerstoffmangel im Schlaf oder in der Höhe. Flüssigkeitsmangel hebt den Wert nur auf dem Papier, weil die roten Blutkörperchen einfach weniger verdünnt sind.',
			...RED_CELLS.de,
			note: 'Umrechnung: 1 g/dl = 0,6206 mmol/l.'
		}
	},

	hematocrit: {
		cites: ['sp-polycythemia', 'greene2019', 'boekhout2023', 'madsen2021', 'wpath8', 'bhasin2018'],
		en: {
			what: 'The share of blood volume taken up by red cells.',
			why: 'Moves with haemoglobin. A high hematocrit makes blood thicker, which is why it is the value to watch on testosterone.',
			high: 'Testosterone, dehydration, smoking, lung disease or sleep apnoea, altitude. Also rises artificially when red cells swell in a sample that waited too long.',
			low: 'Anaemia, or dilution, for example late in pregnancy or after large amounts of fluid.',
			more: 'Blood gets more viscous as hematocrit rises, and above about 50 percent it flows noticeably worse. That is why hematocrit, not haemoglobin, is the usual threshold for acting on too many red cells.\n\nAnalysers calculate hematocrit from the red cell count and the average cell size (MCV). If a sample waits too long before analysis, the cells swell and hematocrit and MCV rise while MCH stays the same. Such a pattern points at the sample, not the body.',
			...RED_CELLS.en
		},
		de: {
			what: 'Der Anteil der roten Blutkörperchen am Blutvolumen.',
			why: 'Bewegt sich mit dem Hämoglobin. Ein hoher Hämatokrit macht das Blut dicker, deshalb ist er unter Testosteron der Wert, auf den man achtet.',
			high: 'Testosteron, Flüssigkeitsmangel, Rauchen, Lungenerkrankungen oder Schlafapnoe, Höhe. Steigt auch künstlich, wenn Zellen in einer zu lange gelagerten Probe anschwellen.',
			low: 'Blutarmut oder Verdünnung, etwa spät in der Schwangerschaft oder nach großen Flüssigkeitsmengen.',
			more: 'Mit steigendem Hämatokrit wird das Blut zähflüssiger, über etwa 50 Prozent fließt es spürbar schlechter. Deshalb ist der Hämatokrit, nicht das Hämoglobin, die übliche Schwelle, um bei zu vielen roten Blutkörperchen zu handeln.\n\nMessgeräte berechnen den Hämatokrit aus der Zahl der roten Blutkörperchen und ihrer mittleren Größe (MCV). Wartet eine Probe zu lange auf die Messung, schwellen die Zellen an, Hämatokrit und MCV steigen, während MCH gleich bleibt. Ein solches Muster weist auf die Probe hin, nicht auf den Körper.',
			...RED_CELLS.de
		}
	},

	mcv: {
		en: {
			what: 'The average size of a red blood cell (hematocrit ÷ red cell count).',
			why: 'Sorts anaemias by cause: small cells point to iron, large cells to B12, folate or alcohol.',
			high: 'Vitamin B12 or folate deficiency, alcohol, liver disease, an underactive thyroid, some drugs. Also red cells swelling in a sample that waited too long before analysis.',
			low: 'Iron deficiency or thalassaemia trait, less often chronic inflammation.'
		},
		de: {
			what: 'Die durchschnittliche Größe eines roten Blutkörperchens (Hämatokrit ÷ Erythrozytenzahl).',
			why: 'Ordnet Blutarmut nach Ursache: kleine Zellen weisen auf Eisen, große auf B12, Folsäure oder Alkohol.',
			high: 'Vitamin-B12- oder Folsäuremangel, Alkohol, Lebererkrankung, Schilddrüsenunterfunktion, manche Medikamente. Auch Zellschwellung in einer zu lange gelagerten Probe.',
			low: 'Eisenmangel oder Thalassämie-Anlage, seltener eine chronische Entzündung.'
		}
	},

	mch: {
		en: {
			what: 'The average amount of haemoglobin per red cell (haemoglobin ÷ red cell count).',
			why: 'Like MCV, helps sort anaemias. Unaffected by cells swelling in the tube, which makes it a good cross check.',
			high: 'Large red cells, as with B12 or folate deficiency.',
			low: 'Iron deficiency or thalassaemia trait.'
		},
		de: {
			what: 'Die durchschnittliche Hämoglobinmenge pro rotem Blutkörperchen (Hämoglobin ÷ Erythrozytenzahl).',
			why: 'Hilft wie MCV, Blutarmut einzuordnen. Unbeeinflusst von Zellschwellung im Röhrchen, daher eine gute Gegenprobe.',
			high: 'Große rote Blutkörperchen, etwa bei B12- oder Folsäuremangel.',
			low: 'Eisenmangel oder Thalassämie-Anlage.'
		}
	},

	mchc: {
		en: {
			what: 'The haemoglobin concentration inside the red cells (haemoglobin ÷ hematocrit).',
			why: 'Very stable in healthy people, so an odd value often points at a measurement problem.',
			high: 'Hereditary spherocytosis, or a sample issue such as very fatty blood (lipaemia) or cold agglutinins.',
			low: 'Advanced iron deficiency. Also appears when red cells swell in a stored sample.'
		},
		de: {
			what: 'Die Hämoglobinkonzentration in den roten Blutkörperchen (Hämoglobin ÷ Hämatokrit).',
			why: 'Bei Gesunden sehr stabil, ein auffälliger Wert deutet daher oft auf ein Messproblem.',
			high: 'Erbliche Sphärozytose oder ein Probenproblem wie sehr fettreiches Blut (Lipämie) oder Kälteagglutinine.',
			low: 'Fortgeschrittener Eisenmangel. Tritt auch auf, wenn Zellen in einer gelagerten Probe anschwellen.'
		}
	},

	rdw: {
		en: {
			what: 'How much red cells vary in size.',
			why: 'Rises early in iron or vitamin deficiencies, before MCV moves, and helps tell iron deficiency from thalassaemia trait.',
			high: 'Developing or mixed deficiencies, recent blood loss, a transfusion, recovery from anaemia with many young cells.',
			note: 'Depends on the analyser, so values from different labs compare poorly.'
		},
		de: {
			what: 'Wie stark die roten Blutkörperchen in der Größe schwanken.',
			why: 'Steigt früh bei Eisen- oder Vitaminmangel, noch bevor sich MCV ändert, und hilft, Eisenmangel von einer Thalassämie-Anlage zu unterscheiden.',
			high: 'Beginnende oder gemischte Mangelzustände, kürzlicher Blutverlust, eine Transfusion, die Erholung von einer Blutarmut mit vielen jungen Zellen.',
			note: 'Hängt vom Messgerät ab, Werte verschiedener Labore sind schlecht vergleichbar.'
		}
	},

	platelets: {
		en: {
			what: 'Small cell fragments that plug injured vessels and start blood clotting.',
			why: 'Screens for bleeding tendency and bone marrow problems.',
			high: 'Inflammation, iron deficiency, after bleeding or surgery, after removal of the spleen, rarely a bone marrow disorder.',
			low: 'Viral infections, medications including heparin, immune destruction, liver disease with a large spleen, pregnancy. Clumping in the tube can fake a low count, which a repeat in a citrate tube clears up.'
		},
		de: {
			what: 'Kleine Zellbruchstücke, die verletzte Gefäße abdichten und die Blutgerinnung starten.',
			why: 'Suchtest auf Blutungsneigung und Knochenmarkprobleme.',
			high: 'Entzündung, Eisenmangel, nach Blutungen oder Operationen, nach Entfernung der Milz, selten eine Knochenmarkerkrankung.',
			low: 'Virusinfekte, Medikamente einschließlich Heparin, Abbau durch das Immunsystem, Lebererkrankung mit großer Milz, Schwangerschaft. Verklumpung im Röhrchen kann einen niedrigen Wert vortäuschen, eine Wiederholung im Citratröhrchen klärt das.'
		}
	},

	mpv: {
		en: {
			what: 'The average platelet size. Young platelets fresh from the bone marrow are larger.',
			why: 'Helps interpret an abnormal platelet count: large platelets with a low count suggest the marrow is replacing platelets used up elsewhere.',
			note: 'Rises in samples that wait long in EDTA tubes and depends on the analyser.'
		},
		de: {
			what: 'Die durchschnittliche Größe der Blutplättchen. Junge Plättchen frisch aus dem Knochenmark sind größer.',
			why: 'Hilft, eine auffällige Thrombozytenzahl einzuordnen: große Plättchen bei niedriger Zahl sprechen dafür, dass das Knochenmark anderswo verbrauchte Plättchen ersetzt.',
			note: 'Steigt in Proben, die lange im EDTA-Röhrchen warten, und hängt vom Messgerät ab.'
		}
	},

	nrbc: {
		en: {
			what: 'Immature red cells that still have a nucleus. Normally they stay in the bone marrow.',
			why: 'Any in adult blood points at marrow stress, for example severe anaemia, low oxygen or a bone marrow disorder. Zero is normal.'
		},
		de: {
			what: 'Unreife rote Blutkörperchen, die noch einen Kern haben. Normalerweise bleiben sie im Knochenmark.',
			why: 'Jeder Nachweis bei Erwachsenen deutet auf Stress im Knochenmark, etwa bei schwerer Blutarmut, Sauerstoffmangel oder einer Knochenmarkerkrankung. Null ist normal.'
		}
	},

	'nrbc-abs': {
		en: {
			what: 'Absolute count of nucleated red cells.',
			why: 'Zero is normal.'
		},
		de: {
			what: 'Absolute Anzahl der Normoblasten.',
			why: 'Null ist normal.'
		}
	},

	...Object.fromEntries(CELLS.flatMap(differential)),

	quick: {
		cites: ['wpath8'],
		en: {
			what: 'How fast blood clots through the external pathway, as a percentage of normal. The German way of reporting prothrombin time.',
			why: 'Checks the clotting factors made in the liver: liver function, vitamin K status, and the dose of vitamin K antagonists such as phenprocoumon.',
			high: 'Not a concern.',
			low: 'Slower clotting: vitamin K antagonists, vitamin K deficiency, liver disease.',
			...CLOT_RISK.en,
			note: 'The lower the Quick value, the higher the INR.'
		},
		de: {
			what: 'Wie schnell das Blut über den äußeren Weg gerinnt, in Prozent der Norm. Die in Deutschland übliche Angabe der Thromboplastinzeit.',
			why: 'Prüft die in der Leber gebildeten Gerinnungsfaktoren: Leberfunktion, Vitamin-K-Versorgung und die Dosis von Vitamin-K-Antagonisten wie Phenprocoumon.',
			high: 'Unbedenklich.',
			low: 'Langsamere Gerinnung: Vitamin-K-Antagonisten, Vitamin-K-Mangel, Lebererkrankung.',
			...CLOT_RISK.de,
			note: 'Je niedriger der Quick-Wert, desto höher die INR.'
		}
	},

	inr: {
		en: {
			what: 'Prothrombin time standardised across labs. 1.0 is normal clotting speed.',
			why: 'The international way to report prothrombin time and to steer vitamin K antagonists, which usually aim for 2 to 3.',
			high: 'Slower clotting: vitamin K antagonists, liver disease, vitamin K deficiency.',
			low: 'Not a concern.'
		},
		de: {
			what: 'Laborübergreifend standardisierte Thromboplastinzeit. 1,0 ist normale Gerinnungsgeschwindigkeit.',
			why: 'Die internationale Angabe der Thromboplastinzeit und zur Steuerung von Vitamin-K-Antagonisten, die meist auf 2 bis 3 zielen.',
			high: 'Langsamere Gerinnung: Vitamin-K-Antagonisten, Lebererkrankung, Vitamin-K-Mangel.',
			low: 'Unbedenklich.'
		}
	},

	aptt: {
		en: {
			what: 'Clotting time through the internal pathway.',
			why: 'Screens for bleeding disorders such as haemophilia or von Willebrand disease before surgery, and monitors heparin.',
			high: 'Heparin, lupus anticoagulant (which paradoxically raises the clot risk), clotting factor deficiencies.',
			low: 'Usually a sampling effect, not meaningful alone.'
		},
		de: {
			what: 'Gerinnungszeit über den inneren Weg.',
			why: 'Suchtest auf Blutgerinnungsstörungen wie Hämophilie oder Von-Willebrand-Syndrom vor Operationen und Kontrolle von Heparin.',
			high: 'Heparin, Lupus-Antikoagulans (das paradoxerweise das Thromboserisiko erhöht), Mangel an Gerinnungsfaktoren.',
			low: 'Meist ein Abnahmeeffekt, allein nicht aussagekräftig.'
		}
	},

	fibrinogen: {
		en: {
			what: 'The clotting protein that becomes the fibrin mesh of a clot. Made in the liver.',
			why: 'Shows clotting capacity, for example with heavy bleeding. It also rises with inflammation, like CRP.',
			high: 'Inflammation, pregnancy, smoking, estrogen, older age.',
			low: 'Consumption in severe clotting activation, liver disease, inherited deficiency.'
		},
		de: {
			what: 'Das Gerinnungseiweiß, aus dem das Fibrinnetz eines Gerinnsels entsteht. Gebildet in der Leber.',
			why: 'Zeigt die Gerinnungsfähigkeit, etwa bei starken Blutungen. Steigt außerdem wie CRP bei Entzündungen.',
			high: 'Entzündung, Schwangerschaft, Rauchen, Östrogen, höheres Alter.',
			low: 'Verbrauch bei starker Gerinnungsaktivierung, Lebererkrankung, angeborener Mangel.'
		}
	},

	'd-dimer': {
		cites: ['sp-ddimer', 'esc-pe2019', 'favaloro2020', 'wpath8'],
		en: {
			what: 'A breakdown product of fibrin, released when the body dissolves a clot.',
			why: 'Rules out a fresh thrombosis or pulmonary embolism when the clinical suspicion is low or moderate.',
			high: 'Thrombosis or embolism, but also infection, inflammation, surgery, injury, pregnancy, cancer and older age. A high value alone proves nothing.',
			low: 'Not a concern.',
			more: 'D-dimer is sensitive but not specific: almost every fresh clot raises it, but so do many other things. Its value lies in a normal result, which together with a low clinical probability makes a thrombosis or embolism so unlikely that no scan is needed. A raised value only means further tests.\n\nD-dimer rises with age, so a fixed cutoff flags many older people. The ESC recommends an age adjusted cutoff from 50 on: age × 0.01 mg/l FEU, for example 0.7 mg/l at 70 (ESC 2019). It is not meant for screening people without symptoms.',
			...CLOT_RISK.en,
			note: 'Some labs report D-dimer units (DDU) instead of fibrinogen equivalent units (FEU). The same sample reads about half as high in DDU (Favaloro 2020).'
		},
		de: {
			what: 'Ein Abbauprodukt von Fibrin, entsteht, wenn der Körper ein Gerinnsel auflöst.',
			why: 'Schließt eine frische Thrombose oder Lungenembolie aus, wenn der klinische Verdacht gering oder mäßig ist.',
			high: 'Thrombose oder Embolie, aber auch Infektion, Entzündung, Operationen, Verletzungen, Schwangerschaft, Krebs und höheres Alter. Ein hoher Wert allein beweist nichts.',
			low: 'Unbedenklich.',
			more: 'D-Dimer ist empfindlich, aber nicht spezifisch: Fast jedes frische Gerinnsel erhöht es, viele andere Dinge aber auch. Sein Wert liegt im normalen Ergebnis, das zusammen mit einer geringen klinischen Wahrscheinlichkeit eine Thrombose oder Embolie so unwahrscheinlich macht, dass keine Bildgebung nötig ist. Ein erhöhter Wert bedeutet nur weitere Untersuchungen.\n\nD-Dimer steigt mit dem Alter, ein fester Grenzwert markiert daher viele ältere Menschen. Die ESC empfiehlt ab 50 einen altersangepassten Grenzwert: Alter × 0,01 mg/l FEU, also etwa 0,7 mg/l mit 70 (ESC 2019). Als Suchtest bei Menschen ohne Beschwerden ist es nicht gedacht.',
			...CLOT_RISK.de,
			note: 'Manche Labore geben D-Dimer-Einheiten (DDU) statt Fibrinogen-Äquivalent-Einheiten (FEU) an. Dieselbe Probe ergibt in DDU etwa halb so hohe Zahlen (Favaloro 2020).'
		}
	}
};
