import { APP_NAME } from './app';
import { analytes, unitChoices } from './data';
import { DRAWS_FORMAT } from './io';

/** Values only this app computes, an agent should never fill them */
const APP_ONLY = new Set(['egfr-f', 'egfr-m', 'egfr-cys-f', 'egfr-cys-m', 'bmi']);

const cell = (s: string) => s.replaceAll('|', '\\|');

function catalogueTable(): string {
	const rows = analytes
		.filter((a) => !APP_ONLY.has(a.id))
		.map((a) => {
			const units = unitChoices(a).filter((u) => u && u !== a.unit);
			return `| ${a.id} | ${cell(a.name.en)} | ${cell(a.name.de)} | ${cell((a.aliases ?? []).join(', '))} | ${cell(a.unit || '(none)')} | ${cell(units.join(', '))} |`;
		});
	return ['| id | English | German | also printed as | main unit | other accepted units |', '|---|---|---|---|---|---|', ...rows].join('\n');
}

const EXAMPLE = {
	format: DRAWS_FORMAT,
	version: 2,
	draws: [
		{
			date: '2025-12-08',
			time: '08:30',
			lab: 'Example Lab',
			rangesFor: 'female',
			fasting: true,
			notes: ['Report says: drawn 3 days after the last injection.'],
			results: [
				{ analyte: 'estradiol', printed: 'Östradiol', value: '187', unit: 'pg/ml', low: 30.9, high: 90.4 },
				{ analyte: 'testosterone', printed: 'Testosteron', value: '<0.10', unit: 'ng/ml', low: 0.08, high: 0.48, flag: 'L' },
				{ analyte: 'hemoglobin', printed: 'Hämoglobin', value: '13,1', unit: 'g/dl', low: 12, high: 16 },
				{ analyte: 'ldl', printed: 'LDL-Cholesterin', value: '96', unit: 'mg/dl', high: 116 },
				{ analyte: 'progesterone', printed: 'Progesteron', value: '0,4', unit: 'ng/ml', rangeText: 'Follikelphase 0,2 - 1,5; Lutealphase 1,7 - 27' },
				{ analyte: 'platelets', printed: 'Thrombozyten', value: '251', unit: '/nl', low: 150, high: 400 },
				{ analyte: null, printed: 'Selen', value: '98', unit: 'µg/l', low: 50, high: 120 }
			]
		}
	],
	notes: ['Report 1: draws on 2025-12-08.', 'Report 2: page 3 unreadable.']
};

export function agentInstructions(): string {
	return `# ${APP_NAME}: extract blood test results

You get one or more laboratory reports as PDF or images. Extract every numeric result and answer with a single JSON document in the format below. The user imports it into ${APP_NAME}, an app that runs only in their browser. They review everything before it is saved, so completeness and exact copying matter more than interpretation. The app does every unit conversion itself: your job is to copy, never to calculate.

## Rules

### Draws

1. **One draw per sampling date.** Use the date the blood was taken (German reports: "Abnahme", "Entnahme", "Probenentnahme", "Abnahmedatum"). Only if no sampling date is printed, use the receipt date ("Eingang"), never the print or report date. If several reports contain the same draw, output it once.
2. **Cumulative reports** ("Kumulativbefund", "Verlauf") show earlier draws as extra columns: output every column as its own draw. Read one column at a time from top to bottom and keep each value on the row of its analyte. Neighbouring columns are the most common source of wrong values.
3. **Count before you answer.** Start the top level \`notes\` with one line per report listing the sampling dates you found ("Report 2: 2026-08-27, 2026-09-21"), then check that each of them is a draw in your answer.
4. **\`rangesFor\`**: "female" or "male" when the report shows which sex the reference ranges were chosen for, for example a "Geschlecht: w" or "Sex: M" field, or ranges labelled for women or men. Otherwise leave it out.
5. **\`fasting\`**: true or false only when the report says so. **\`lab\`**: a short name of the laboratory.

### Results

6. **\`value\`**: copy exactly as printed, as a string. Keep "<" and ">" ("<0.10") and the decimal comma or point. Do not round, do not convert, do not add thousands separators or flags.
7. **\`unit\`**: the unit exactly as printed next to the value, in plain text ("µmol/l", "/nl", "10^9/l", "mU/l"). The catalogue lists every unit the app accepts per value. If the printed unit is not listed, still copy it as printed and add a \`note\` to the result: the user picks the matching unit on import. Never convert a value into another unit. Leave \`unit\` out if none is printed.
8. **\`low\` and \`high\`**: the printed reference range as two JSON numbers with a decimal point, in the printed unit. "3,5 - 5,1" becomes \`"low": 3.5, "high": 5.1\`. "< 50" or "bis 50" gives only \`high\`, "> 60" only \`low\`. Copy every digit: "2 - 9,5" is 2 and 9.5, not 2 and 95.
9. **\`rangeText\`**: only for ranges that are not one lower and upper bound, such as ranges per cycle phase or "siehe Befund". Copy them as printed and leave \`low\` and \`high\` out.
10. **\`flag\`**: the printed marker, if any (H, L, +, -, *, ↑, ↓).
11. **\`analyte\`**: the id from the catalogue whose name, German name or alias matches the printed name. Watch the unit: HbA1c in % and in mmol/mol, and Lp(a) in mg/dl and in nmol/l, have separate ids. If nothing fits, use \`null\` and still include the result. **\`printed\`**: the analyte name exactly as printed.
12. **Only numbers.** Skip qualitative results such as "negativ" or "siehe Befund" and mention them in the draw's \`notes\`. A limit like "< 0.1" is a number and belongs in the results.
13. **Computed values the lab prints** (eGFR, LDL/HDL ratio, non-HDL, free androgen index, transferrin saturation) are results too. Use their ids.
14. **Unreadable parts** (folds, stamps, cut off scans): leave the value out and add a note. Never guess a value.
15. **Sample problems** printed by the lab ("hämolytisch", "lipämisch", "falsches Röhrchen", "falsche Abnahme"): add a \`note\` to the affected result, or to the draw if the whole sample is affected.

### Output

16. **Plain text everywhere.** No LaTeX (\`$\\mu$\`, \`\\text{}\`), no Markdown inside strings, no citation markers such as "[cite: 3]".
17. **No personal data.** Never output the patient's name, date of birth, address, insurance or case numbers, doctors' names, file names or any other identifier. Refer to reports as "Report 1", "Report 2" in the order you got them.
18. **Check your work.** Before answering, go through every result once more against the report: the value, the unit, both range bounds and the column's date.
19. **Answer with the JSON only**, in one \`\`\`json code block. Put anything worth saying into the top level \`notes\` array.

Many reports at once lower the accuracy. With more than about five reports, ask the user to send them in smaller batches.

## Format

\`\`\`json
${JSON.stringify(EXAMPLE, null, 2)}
\`\`\`

Fields: \`date\` is YYYY-MM-DD, \`time\` is HH:MM (optional). \`value\` is a string, \`low\` and \`high\` are numbers. Every field except \`date\`, \`results\`, \`value\` and \`analyte\` is optional.

## Catalogue

${catalogueTable()}
`;
}

export function importSchema() {
	const ids = analytes.filter((a) => !APP_ONLY.has(a.id)).map((a) => a.id);
	return {
		$schema: 'https://json-schema.org/draft/2020-12/schema',
		title: `${APP_NAME} draws import`,
		type: 'object',
		required: ['format', 'version', 'draws'],
		properties: {
			format: { const: DRAWS_FORMAT },
			version: { const: 2 },
			notes: { type: 'array', items: { type: 'string' } },
			draws: {
				type: 'array',
				items: {
					type: 'object',
					required: ['date', 'results'],
					properties: {
						date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Date the blood was taken' },
						time: { type: 'string', pattern: '^\\d{2}:\\d{2}$' },
						lab: { type: 'string' },
						rangesFor: { enum: ['female', 'male'] },
						fasting: { type: 'boolean' },
						notes: { type: 'array', items: { type: 'string' } },
						results: {
							type: 'array',
							items: {
								type: 'object',
								required: ['analyte', 'value'],
								properties: {
									analyte: { anyOf: [{ enum: ids }, { type: 'null' }] },
									printed: { type: 'string' },
									value: { type: 'string', description: 'Exactly as printed, "<" and ">" included' },
									unit: { type: 'string', description: 'Exactly as printed, plain text, never converted' },
									low: { type: 'number', description: 'Lower bound of the printed range, in the printed unit' },
									high: { type: 'number', description: 'Upper bound of the printed range, in the printed unit' },
									rangeText: { type: 'string', description: 'Only for printed ranges that are not one lower and upper bound' },
									flag: { type: 'string' },
									note: { type: 'string' }
								},
								additionalProperties: false
							}
						}
					},
					additionalProperties: false
				}
			}
		},
		additionalProperties: false
	};
}
