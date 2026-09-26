import { blood } from './analytes/blood';
import { chemistry } from './analytes/chemistry';
import { hormones } from './analytes/hormones';
import { metabolism } from './analytes/metabolism';
import { nutrients } from './analytes/nutrients';
import { T } from './analytes/refs';
import { info } from './info';
import { sourceById } from './sources';
import { unitConflicts } from './units';
import type { Analyte, AnalyteDef, Group, GroupId, Preset } from './types';

const defs: AnalyteDef[] = [...hormones, ...blood, ...chemistry, ...metabolism, ...nutrients];

/** Catalogue entries joined with their texts. A gap in the texts fails the build instead of showing an empty panel */
export const analytes: Analyte[] = defs.map((a) => {
	const text = info[a.id];
	if (!text) throw new Error(`No info text for ${a.id}`);

	const fields = (lang: 'en' | 'de') => Object.keys(text[lang]).sort().join();
	if (fields('en') !== fields('de')) throw new Error(`English and German texts of ${a.id} differ in their fields`);

	for (const id of text.cites ?? []) if (!sourceById.has(id)) throw new Error(`${a.id} cites unknown source ${id}`);

	// A wrong factor would skew every value converted through it, rounded published factors still pass
	const conflicts = unitConflicts(a as Analyte);
	if (conflicts.length) throw new Error(`${a.id} lists units whose factors disagree: ${conflicts.join(', ')}`);
	return { ...a, info: { en: text.en, de: text.de }, cites: text.cites };
});
export const analyteById = new Map(analytes.map((a) => [a.id, a]));

export const groups: Group[] = [
	{ id: 'hormones', label: T('Sex hormones', 'Sexualhormone') },
	{ id: 'adrenal', label: T('Adrenal', 'Nebenniere') },
	{ id: 'thyroid', label: T('Thyroid', 'Schilddrüse') },
	{ id: 'blood-count', label: T('Blood count', 'Blutbild') },
	{ id: 'differential', label: T('White cell differential', 'Differentialblutbild') },
	{ id: 'coagulation', label: T('Clotting', 'Gerinnung') },
	{ id: 'kidney', label: T('Kidney', 'Niere') },
	{ id: 'liver', label: T('Liver & protein', 'Leber & Eiweiß') },
	{ id: 'lipids', label: T('Lipids', 'Fettstoffwechsel') },
	{ id: 'glucose', label: T('Glucose metabolism', 'Zuckerstoffwechsel') },
	{ id: 'electrolytes', label: T('Electrolytes & minerals', 'Elektrolyte & Mineralstoffe') },
	{ id: 'iron', label: T('Iron', 'Eisen') },
	{ id: 'vitamins', label: T('Vitamins', 'Vitamine') },
	{ id: 'pancreas', label: T('Pancreas', 'Bauchspeicheldrüse') },
	{ id: 'cardiac', label: T('Heart & muscle', 'Herz & Muskel') },
	{ id: 'inflammation', label: T('Inflammation', 'Entzündung') },
	{ id: 'prostate', label: T('Prostate', 'Prostata') },
	{ id: 'body', label: T('Body', 'Körper') },
	{ id: 'other', label: T('Your own values', 'Eigene Werte') }
];
export const groupById = new Map(groups.map((g) => [g.id, g]));

export function groupOrder(id: GroupId): number {
	return groups.findIndex((g) => g.id === id);
}

/** Analytes with a cis female and a cis male reference, the ones HRT is expected to move */
const sexSpecific = analytes.filter((a) => a.refs.some((r) => r.kind === 'female') && a.refs.some((r) => r.kind === 'male')).map((a) => a.id);

const LIPIDS = ['cholesterol', 'hdl', 'ldl', 'non-hdl', 'triglycerides'];

export const presets: Preset[] = [
	{
		id: 'fem-essentials',
		therapy: 'feminizing',
		label: T('Transition essentials', 'Das Wichtigste zur Transition'),
		description: T(
			'Sex hormones, the pituitary signals, and the values that move most visibly once testosterone is suppressed.',
			'Sexualhormone, die Signale der Hirnanhangsdrüse und die Werte, die sich nach der Testosteronunterdrückung am deutlichsten bewegen.'
		),
		analytes: ['estradiol', 'testosterone', 'free-t-calc', 'shbg', 'fai', 'lh', 'fsh', 'prolactin', 'hemoglobin', 'hematocrit', 'erythrocytes', 'creatinine', 'egfr-f', 'egfr-m', 'weight', 'bmi']
	},
	{
		id: 'fem-monitoring',
		therapy: 'feminizing',
		label: T('HRT safety monitoring', 'HRT-Sicherheitskontrollen'),
		description: T(
			'What guidelines ask to check regularly on feminizing HRT: hormones, prolactin, liver, blood count, kidney, potassium, lipids, glucose.',
			'Was Leitlinien unter feminisierender HRT regelmäßig kontrollieren: Hormone, Prolaktin, Leber, Blutbild, Niere, Kalium, Blutfette, Zucker.'
		),
		analytes: ['estradiol', 'testosterone', 'prolactin', 'alt', 'ast', 'ggt', 'alp', 'hemoglobin', 'hematocrit', 'creatinine', 'egfr-f', 'potassium', ...LIPIDS, 'glucose', 'hba1c', 'crp', 'bmi', 'psa']
	},
	{
		id: 'masc-essentials',
		therapy: 'masculinizing',
		label: T('Transition essentials', 'Das Wichtigste zur Transition'),
		description: T(
			'Testosterone and how much of it is free, the pituitary signals, estradiol and the red cell values testosterone drives.',
			'Testosteron und wie viel davon frei ist, die Signale der Hirnanhangsdrüse, Östradiol und die roten Blutwerte, die Testosteron antreibt.'
		),
		analytes: ['testosterone', 'free-t-calc', 'shbg', 'fai', 'estradiol', 'lh', 'fsh', 'hemoglobin', 'hematocrit', 'erythrocytes', 'creatinine', 'egfr-f', 'egfr-m', 'weight', 'bmi']
	},
	{
		id: 'masc-monitoring',
		therapy: 'masculinizing',
		label: T('HRT safety monitoring', 'HRT-Sicherheitskontrollen'),
		description: T(
			'What guidelines ask to check regularly on masculinizing HRT: testosterone, hematocrit, liver, lipids, glucose, weight.',
			'Was Leitlinien unter maskulinisierender HRT regelmäßig kontrollieren: Testosteron, Hämatokrit, Leber, Blutfette, Zucker, Gewicht.'
		),
		analytes: ['testosterone', 'estradiol', 'hemoglobin', 'hematocrit', 'alt', 'ast', 'ggt', 'alp', ...LIPIDS, 'glucose', 'hba1c', 'weight', 'bmi']
	},
	{
		id: 'heart',
		label: T('Heart & metabolism', 'Herz & Stoffwechsel'),
		description: T('Lipids, glucose and inflammation markers used to judge cardiovascular risk.', 'Blutfette, Zucker und Entzündungsmarker zur Einschätzung des Herz-Kreislauf-Risikos.'),
		analytes: [...LIPIDS, 'apob', 'lpa', 'lpa-molar', 'glucose', 'hba1c', 'insulin', 'homa-ir', 'crp', 'bmi']
	},
	{
		id: 'nutrients',
		label: T('Iron & vitamins', 'Eisen & Vitamine'),
		description: T('Iron stores, B12, folate and vitamin D, with the red cell values they feed into.', 'Eisenspeicher, B12, Folsäure und Vitamin D mit den roten Blutwerten, die davon abhängen.'),
		analytes: ['ferritin', 'iron', 'transferrin', 'tsat', 'b12', 'folate', 'homocysteine', 'vitamin-d', 'hemoglobin', 'mcv', 'mch']
	},
	{
		id: 'sex-specific',
		label: T('Sex-specific ranges', 'Geschlechtsspezifische Bereiche'),
		description: T('Analytes with different reference ranges for cis women and cis men.', 'Werte mit unterschiedlichen Referenzbereichen für cis Frauen und cis Männer.'),
		analytes: sexSpecific
	}
];
