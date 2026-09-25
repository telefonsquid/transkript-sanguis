import { APP_NAME } from './app';
import { analytes } from './data';
import { DRAWS_FORMAT } from './io';

/** Values only this app computes, an agent should never fill them */
const APP_ONLY = new Set(['egfr-f', 'egfr-m', 'egfr-cys-f', 'egfr-cys-m', 'bmi']);

const cell = (s: string) => s.replaceAll('|', '\\|');

function catalogueTable(): string {
	const rows = analytes
		.filter((a) => !APP_ONLY.has(a.id))
		.map((a) => {
			const units = [...(a.units ?? []).map((u) => u.unit), ...(a.si ? [a.si.unit] : [])];
			return `| ${a.id} | ${cell(a.name.en)} | ${cell(a.name.de)} | ${cell((a.aliases ?? []).join(', '))} | ${cell(a.unit)} | ${cell([...new Set(units)].join(', '))} |`;
		});
	return ['| id | English | German | also printed as | unit | other units the app converts |', '|---|---|---|---|---|---|', ...rows].join('\n');
}

const EXAMPLE = {
	format: DRAWS_FORMAT,
	version: 1,
	draws: [
		{
			date: '2025-12-08',
			time: '08:30',
			lab: 'Example Lab',
			rangesFor: 'female',
			fasting: true,
			notes: ['Report says: drawn 3 days after the last injection.'],
			results: [
				{ analyte: 'estradiol', printed: 'Östradiol', value: '187', unit: 'pg/ml', ref: '30.9 - 90.4' },
				{ analyte: 'testosterone', printed: 'Testosteron', value: '<0.10', unit: 'ng/ml', ref: '0.08 - 0.48', flag: 'L' },
				{ analyte: 'hemoglobin', printed: 'Hämoglobin', value: '13,1', unit: 'g/dl', ref: '12,0 - 16,0' },
				{ analyte: null, printed: 'Selen', value: '98', unit: 'µg/l', ref: '50 - 120' }
			]
		}
	],
	notes: ['Page 3 of the second report was unreadable.']
};

export function agentInstructions(): string {
	return `# ${APP_NAME}: extract blood test results

You get one or more laboratory reports as PDF or images. Extract every numeric result and answer with a single JSON document in the format below. The user imports it into ${APP_NAME}, an app that runs only in their browser. They review everything before it is saved, so completeness and exact copying matter more than interpretation.

## Rules

1. **One draw per sampling date.** Use the date the blood was taken (German reports: "Abnahme", "Entnahme", "Probenentnahme", "Abnahmedatum"). Only if no sampling date is printed, use the receipt date ("Eingang"), never the print or report date. Cumulative reports ("Kumulativbefund", "Verlauf") show earlier draws as extra columns: output every column as its own draw. If several reports contain the same draw, output it once.
2. **Copy values exactly as printed.** Keep "<" and ">" ("<0.10"). Keep a decimal comma or point as printed. Do not round, do not convert units, do not add thousands separators, do not add flags to the value.
3. **\`unit\`**: the unit exactly as printed next to the value.
4. **\`ref\`**: the printed reference range as text, for example "3.5 - 5.1", "< 50", "> 60". Leave it out if none is printed.
5. **\`flag\`**: the printed marker, if any (H, L, +, -, *, ↑, ↓).
6. **\`analyte\`**: the id from the catalogue below whose name, German name or alias matches the printed name. Watch the unit: HbA1c in % and in mmol/mol, and Lp(a) in mg/dl and in nmol/l, have separate ids. If nothing fits, use \`null\` and still include the result. The user maps it later.
7. **\`printed\`**: the analyte name exactly as printed.
8. **Only numbers.** Skip qualitative results such as "negativ" or "siehe Befund" and mention them in the draw's \`notes\`. A limit like "< 0.1" is a number and belongs in the results.
9. **Computed values the lab prints** (eGFR, LDL/HDL ratio, non-HDL, free androgen index, transferrin saturation) are results too. Use their ids.
10. **\`rangesFor\`**: "female" or "male" only when the report shows which sex the reference ranges were chosen for (for example a "Geschlecht" field, or ranges labelled for women or men). Otherwise leave it out.
11. **\`fasting\`**: true or false only when the report says so.
12. **\`lab\`**: a short name of the laboratory.
13. **No personal data.** Never output the patient's name, date of birth, address, insurance or case numbers, doctors' names or any other identifier. The format has no field for them on purpose.
14. **Unreadable parts** (folds, stamps, cut off scans): leave the value out and add a note. Never guess a value.
15. **Sample problems** printed by the lab ("hämolytisch", "lipämisch", "falsches Röhrchen", "falsche Abnahme"): add a \`note\` to the affected result, or to the draw if the whole sample is affected.
16. **Answer with the JSON only**, in one \`\`\`json code block. Put anything worth saying into the top level \`notes\` array.

## Format

\`\`\`json
${JSON.stringify(EXAMPLE, null, 2)}
\`\`\`

Fields: \`date\` is YYYY-MM-DD, \`time\` is HH:MM (optional). \`value\` is a string. Every field except \`date\`, \`results\`, \`value\` and \`analyte\` is optional.

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
			version: { const: 1 },
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
									unit: { type: 'string' },
									ref: { type: 'string' },
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
