import { analytes, isIsoDate, parseValue, unitFactor } from './data';
import type { Analyte, Draw, Profile, Result, Sex } from './data/types';
import { fileKey, getFile, putFile } from './files';

export const EXPORT_FORMAT = 'laborwerte/export';
export const DRAWS_FORMAT = 'laborwerte/draws';

export function download(name: string, data: string | Blob, type = 'application/json') {
	const blob = typeof data === 'string' ? new Blob([data], { type }) : data;
	const url = URL.createObjectURL(blob);
	const link = Object.assign(document.createElement('a'), { href: url, download: name });
	link.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* Full backups */

export interface ExportedFile {
	profile: string;
	report: string;
	name: string;
	type: string;
	/** Base64 */
	data: string;
}

export interface ExportFile {
	format: typeof EXPORT_FORMAT;
	version: 1;
	exported: string;
	profiles: Profile[];
	files?: ExportedFile[];
}

function toBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let bin = '';
	for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
	return btoa(bin);
}

function fromBase64(data: string, type: string): Blob {
	const bin = atob(data);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return new Blob([bytes], { type });
}

export async function buildExport(profiles: Profile[], withFiles: boolean): Promise<ExportFile> {
	const out: ExportFile = { format: EXPORT_FORMAT, version: 1, exported: new Date().toISOString(), profiles };
	if (!withFiles) return out;

	out.files = [];
	for (const p of profiles) {
		for (const r of p.reports.filter((r) => r.file)) {
			const blob = await getFile(fileKey(p.id, r.id)).catch(() => undefined);
			if (!blob) continue;
			out.files.push({ profile: p.id, report: r.id, name: r.file!.name, type: blob.type || r.file!.type, data: toBase64(await blob.arrayBuffer()) });
		}
	}
	return out;
}

/** Puts exported PDFs back, under the profile ids they were imported as */
export async function restoreFiles(files: ExportedFile[], ids: Record<string, string>) {
	for (const f of files) {
		const profile = ids[f.profile];
		if (profile) await putFile(fileKey(profile, f.report), fromBase64(f.data, f.type));
	}
}

/* Reading pasted or uploaded JSON */

export interface AgentResult {
	analyte?: string | null;
	printed?: string | null;
	value: string | number;
	unit?: string | null;
	ref?: string | null;
	flag?: string | null;
	note?: string | null;
}

export interface AgentDraw {
	date: string;
	time?: string | null;
	lab?: string | null;
	rangesFor?: Sex | null;
	fasting?: boolean | null;
	notes?: string[] | null;
	results: AgentResult[];
}

export interface DrawsFile {
	format: typeof DRAWS_FORMAT;
	version: 1;
	draws: AgentDraw[];
	notes?: string[];
}

export type Identified = { kind: 'export'; file: ExportFile } | { kind: 'draws'; file: DrawsFile } | { kind: 'error'; reason: 'json' | 'format' };

/** Accepts the raw answer of a chat assistant, code fences and chatter around the JSON included */
export function identify(text: string): Identified {
	const start = text.indexOf('{');
	const end = text.lastIndexOf('}');
	if (start < 0 || end < start) return { kind: 'error', reason: 'json' };

	let data: unknown;
	try {
		data = JSON.parse(text.slice(start, end + 1));
	} catch {
		return { kind: 'error', reason: 'json' };
	}
	if (!data || typeof data !== 'object') return { kind: 'error', reason: 'format' };

	const obj = data as Record<string, unknown>;
	if (obj.format === EXPORT_FORMAT && Array.isArray(obj.profiles)) return { kind: 'export', file: obj as unknown as ExportFile };
	if (Array.isArray(obj.draws) && (obj.format === DRAWS_FORMAT || obj.format === undefined)) {
		const draws = (obj.draws as unknown[]).filter((d): d is AgentDraw => !!d && typeof d === 'object' && Array.isArray((d as AgentDraw).results));
		return { kind: 'draws', file: { format: DRAWS_FORMAT, version: 1, draws, notes: Array.isArray(obj.notes) ? (obj.notes as string[]) : undefined } };
	}
	return { kind: 'error', reason: 'format' };
}

/* Matching printed names to the catalogue */

export const normName = (s: string) =>
	s
		.toLowerCase()
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ß/g, 'ss')
		.normalize('NFKD')
		.replace(/[^a-z0-9µ]+/g, '');

let nameIndex: Map<string, string> | undefined;

function index(): Map<string, string> {
	if (nameIndex) return nameIndex;
	nameIndex = new Map();
	for (const a of analytes) {
		for (const n of [a.id, a.name.en, a.name.de, ...(a.aliases ?? [])]) {
			const key = normName(n);
			if (key && !nameIndex.has(key)) nameIndex.set(key, a.id);
		}
	}
	return nameIndex;
}

export function matchName(name: string | null | undefined): string | undefined {
	if (!name) return undefined;
	return index().get(normName(name));
}

/* Import preview */

export type RowProblem = 'value' | 'unit' | 'analyte' | 'duplicate';

export interface PreviewRow {
	key: string;
	printed: string;
	analyte: string | null;
	value: string;
	unit: string;
	ref: string;
	flag: string;
	note: string;
	action: 'import' | 'custom' | 'drop';
}

export interface PreviewDraw {
	key: string;
	date: string;
	time: string;
	lab: string;
	rangesFor?: Sex;
	fasting?: boolean;
	notes: string[];
	rows: PreviewRow[];
	/** Id of a draw already stored on the same date */
	existing?: string;
	mode: 'new' | 'merge' | 'skip';
}

const str = (v: unknown) => (v === undefined || v === null ? '' : String(v).trim());

export function toPreview(file: DrawsFile, profile: Profile | null, lookup: (id: string) => Analyte | undefined): PreviewDraw[] {
	return file.draws.map((d, i) => {
		const date = str(d.date).slice(0, 10);
		const existing = profile?.draws.find((x) => x.date === date)?.id;
		const rows = (d.results ?? []).map((r, j): PreviewRow => {
			const given = str(r.analyte);
			const id = given && lookup(given) ? given : (matchName(given) ?? matchName(r.printed));
			return {
				key: `${i}-${j}`,
				printed: str(r.printed) || (id ? '' : given),
				analyte: id ?? null,
				value: str(r.value),
				unit: str(r.unit),
				ref: str(r.ref),
				flag: str(r.flag),
				note: str(r.note),
				action: id ? 'import' : 'custom'
			};
		});
		return {
			key: String(i),
			date,
			time: str(d.time),
			lab: str(d.lab),
			rangesFor: d.rangesFor === 'female' || d.rangesFor === 'male' ? d.rangesFor : undefined,
			fasting: typeof d.fasting === 'boolean' ? d.fasting : undefined,
			notes: (d.notes ?? []).map(str).filter(Boolean),
			rows,
			existing,
			mode: existing ? 'merge' : 'new'
		};
	});
}

export function rowProblem(row: PreviewRow, rows: PreviewRow[], lookup: (id: string) => Analyte | undefined): RowProblem | undefined {
	if (row.action === 'drop') return undefined;
	if (!parseValue(row.value)) return 'value';
	if (row.action === 'custom') return undefined;
	const a = row.analyte ? lookup(row.analyte) : undefined;
	if (!a) return 'analyte';
	if (unitFactor(a, row.unit) === undefined) return 'unit';
	if (rows.some((r) => r !== row && r.action === 'import' && r.analyte === row.analyte)) return 'duplicate';
	return undefined;
}

export function drawProblem(d: PreviewDraw): 'date' | undefined {
	return isIsoDate(d.date) ? undefined : 'date';
}

export function toResult(row: PreviewRow, analyte: string): Result {
	const r: Result = { analyte, value: row.value };
	if (row.unit) r.unit = row.unit;
	if (row.ref) r.ref = row.ref;
	if (row.flag) r.flag = row.flag;
	if (row.printed) r.printed = row.printed;
	if (row.note) r.note = row.note;
	return r;
}

export function newDraw(id: string, d: PreviewDraw): Draw {
	const draw: Draw = { id, date: d.date, results: [] };
	if (d.time) draw.time = d.time;
	if (d.lab) draw.lab = d.lab;
	if (d.rangesFor) draw.rangesFor = d.rangesFor;
	if (d.fasting !== undefined) draw.fasting = d.fasting;
	if (d.notes.length) draw.notes = d.notes;
	return draw;
}
