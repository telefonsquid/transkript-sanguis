export type Lang = 'en' | 'de';

/** Text in every UI language */
export type Text = Record<Lang, string>;

export type Sex = 'female' | 'male';

export type Therapy = 'feminizing' | 'masculinizing' | 'none';

export type HrtTherapy = Exclude<Therapy, 'none'>;

export type GroupId =
	| 'hormones'
	| 'adrenal'
	| 'thyroid'
	| 'blood-count'
	| 'differential'
	| 'coagulation'
	| 'electrolytes'
	| 'kidney'
	| 'liver'
	| 'pancreas'
	| 'lipids'
	| 'glucose'
	| 'cardiac'
	| 'inflammation'
	| 'iron'
	| 'vitamins'
	| 'prostate'
	| 'body'
	| 'other';

/** Kind of reference context, drives colour and filtering */
export type RefKind = 'target' | 'context' | 'trans' | 'clinical' | 'adult' | 'female' | 'male';

export interface Reference {
	id: string;
	kind: RefKind;
	label: Text;
	low?: number;
	high?: number;
	note?: Text;
	source: string;
	/** Only shown for profiles on this hormone therapy */
	therapy?: HrtTherapy;
	/** Age band in years the range was measured in */
	age?: [number, number];
}

export interface AnalyteInfo {
	what: string;
	why: string;
	high?: string;
	low?: string;
	/** What changes on feminizing HRT */
	fem?: string;
	/** What changes on masculinizing HRT */
	masc?: string;
	note?: string;
}

export interface Analyte {
	id: string;
	name: Text;
	/** Other names labs print, in any language, used for search and import matching */
	aliases?: string[];
	/** Canonical unit, every value is stored in it */
	unit: string;
	/** Other units labs print, with the factor that turns them into the canonical unit */
	units?: { unit: string; factor: number }[];
	si?: { unit: string; factor: number; decimals?: number };
	decimals: number;
	group: GroupId;
	scale?: 'log' | 'linear';
	info: Record<Lang, AnalyteInfo>;
	refs: Reference[];
	/** Reference judged against by default, per therapy */
	primary?: Partial<Record<Therapy | 'any', string>>;
	related?: string[];
	/** Formula of a computed series */
	derived?: Text;
	/** Added by a profile, not part of the catalogue */
	custom?: boolean;
}

export interface Range {
	low?: number;
	high?: number;
	text: string;
}

export interface Measurement {
	analyte: string;
	drawId: string;
	date: string;
	t: number;
	/** In the analyte's canonical unit */
	value: number;
	censor?: '<' | '>';
	/** Value exactly as printed */
	raw: string;
	/** Unit as printed, when it differs from the canonical one */
	printedUnit?: string;
	labRef?: Range;
	labFlag?: string;
	lab: string;
	report?: string;
	rangesFor?: Sex;
	phase: string;
	suspect?: string;
	derived?: Text;
	note?: string;
}

export interface Source {
	id: string;
	short: string;
	title: string;
	url?: string;
}

export interface Group {
	id: GroupId;
	label: Text;
}

export interface Preset {
	id: string;
	label: Text;
	description: Text;
	analytes: string[];
	/** Only offered to profiles on this therapy */
	therapy?: Therapy;
}

/* Profile data, everything below lives only in the browser */

export interface Phase {
	id: string;
	label: string;
	start: string;
	approx?: boolean;
	/** Change took effect after the blood draw on its start date */
	afterDraw?: boolean;
	regimen?: string;
	note?: string;
}

export interface ReportMeta {
	id: string;
	lab?: string;
	issued?: string;
	title?: string;
	note?: string;
	/** A PDF kept in this browser's file store */
	file?: { name: string; type: string; size: number };
}

/** One result exactly as printed on the report */
export interface Result {
	analyte: string;
	value: string;
	unit?: string;
	ref?: string;
	flag?: string;
	/** Name as printed on the report */
	printed?: string;
	note?: string;
	suspect?: string;
}

export interface Draw {
	id: string;
	date: string;
	time?: string;
	lab?: string;
	report?: string;
	/** Sex the lab based its printed ranges on */
	rangesFor?: Sex;
	fasting?: boolean;
	notes?: string[];
	results: Result[];
}

export interface CustomAnalyte {
	id: string;
	name: string;
	unit: string;
	group?: GroupId;
}

export interface Profile {
	id: string;
	name: string;
	created: string;
	therapy: Therapy;
	/** Sex assigned at birth, used for kidney equations and ranges before HRT */
	sex?: Sex;
	/** YYYY or YYYY-MM-DD */
	birth?: string;
	height?: number;
	/** Medication phases, the first one on an HRT profile marks the HRT start */
	phases: Phase[];
	reports: ReportMeta[];
	draws: Draw[];
	custom: CustomAnalyte[];
	demo?: boolean;
}
