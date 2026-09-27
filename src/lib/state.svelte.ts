import { SLUG } from './app';
import { KIND_ORDER, boundsFor, isoDate, statusOf, type Basis, type Bounds, type Kind, type Status, type Units } from './analysis';
import type { XMode } from './chart/types';
import { DAY, groupBy, groupOrder, toTime } from './data';
import type { Analyte, GroupId, Measurement, Phase } from './data/types';
import { nameOf } from './i18n';
import { current } from './profiles.svelte';

export type View = 'grid' | 'compare' | 'matrix' | 'table';
export type { XMode };
export type Sort = 'group' | 'name' | 'count' | 'status' | 'recent';
export type DatePreset = 'all' | 'pre' | 'hrt' | 'latest' | 'year' | 'custom';

const defaults = {
	view: 'grid' as View,
	xMode: 'time' as XMode,
	xLabel: 'date' as 'date' | 'hrt',
	yScale: 'auto' as 'auto' | 'linear' | 'log',
	yFit: 'refs' as 'data' | 'refs',
	units: 'conv' as Units,
	basis: 'primary' as Basis,
	kinds: [...KIND_ORDER] as Kind[],
	bandFill: 'primary' as 'primary' | 'all' | 'none',
	showPhases: true,
	showEvents: true,
	labels: 'last' as 'none' | 'last' | 'extremes' | 'all',
	suspect: 'flag' as 'flag' | 'hide',
	derived: true,
	curve: 'linear' as 'linear' | 'step' | 'monotone',
	datePreset: 'all' as DatePreset,
	from: null as string | null,
	to: null as string | null,
	/** Exclusion lists, so new labs and phases show up without touching the filter */
	hiddenLabs: [] as string[],
	hiddenPhases: [] as string[],
	selection: null as string[] | null,
	preset: null as string | null,
	search: '',
	onlyOut: false,
	minPoints: 1,
	/** List catalogue values without results in the sidebar */
	showEmpty: false,
	sort: 'group' as Sort,
	cardSize: 'm' as 's' | 'm' | 'l',
	compare: [] as string[],
	/** Colour slot per compared analyte, kept when others are removed */
	compareSlots: {} as Record<string, number>,
	compareMode: 'range' as 'range' | 'index' | 'z',
	pinned: [] as string[],
	collapsed: [] as GroupId[]
};

export type Settings = typeof defaults;

const KEY = `${SLUG}:settings:v1`;

/** Settings that start empty, with the kind of value they hold once set */
const NULLABLE: Partial<Record<keyof Settings, string>> = { from: 'string', to: 'string', preset: 'string', selection: 'array' };

const shape = (v: unknown) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);

/** A stored value of the wrong kind falls back to its default */
function load(): Settings {
	try {
		const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
		const merged = structuredClone(defaults);
		for (const key of Object.keys(defaults) as (keyof Settings)[]) {
			const value = saved[key];
			const fits = shape(value) === shape(defaults[key]) || (key in NULLABLE && (value === null || shape(value) === NULLABLE[key]));
			if (key in saved && fits) (merged as Record<string, unknown>)[key] = value;
		}
		return merged;
	} catch {
		return structuredClone(defaults);
	}
}

export const settings: Settings = $state(load());

export function persist() {
	try {
		localStorage.setItem(KEY, JSON.stringify($state.snapshot(settings)));
	} catch {
		// Storage can be blocked, the app still works for this session
	}
}

export function resetSettings() {
	Object.assign(settings, structuredClone(defaults));
}

/** Filters that only make sense for one profile */
export function resetProfileFilters() {
	Object.assign(settings, { datePreset: 'all', from: null, to: null, hiddenLabs: [], hiddenPhases: [] });
}

/** A change after the draw on its start day covers draws from the next day on */
const firstDay = (p: Phase) => (p.afterDraw ? isoDate(toTime(p.start) + DAY) : p.start);

export function applyDatePreset(preset: DatePreset) {
	settings.datePreset = preset;
	const phases = current.built.phases.filter((p) => !p.implicit);
	const start = current.built.hrtStart && phases.length ? firstDay(phases[0]) : null;
	const latest = phases.at(-1);
	const ranges: Record<Exclude<DatePreset, 'custom'>, [string | null, string | null]> = {
		all: [null, null],
		pre: [null, start && isoDate(toTime(start) - DAY)],
		hrt: [start, null],
		latest: [latest ? firstDay(latest) : null, null],
		year: [isoDate(Date.now() - 365 * DAY), isoDate(Date.now())]
	};
	if (preset !== 'custom') [settings.from, settings.to] = ranges[preset];
}

function matches(a: Analyte, q: string): boolean {
	if (!q) return true;
	const hay = [a.id, a.name.en, a.name.de, ...(a.aliases ?? [])].join(' ').toLowerCase();
	return q
		.toLowerCase()
		.split(/\s+/)
		.every((word) => hay.includes(word));
}

interface Judged {
	bounds?: Bounds;
	status: Status;
}

const UNJUDGED: Judged = { status: 'none' };

class Filtered {
	/** Every value of the profile judged once against the current basis */
	judged = $derived(
		new Map(
			current.built.measurements.map((m): [Measurement, Judged] => {
				const a = current.lookup(m.analyte);
				const bounds = a && boundsFor(a, m, settings.basis, current.subject);
				return [m, { bounds, status: statusOf(m, bounds) }];
			})
		)
	);

	judge(m: Measurement): Judged {
		return this.judged.get(m) ?? UNJUDGED;
	}

	/** Values that pass date, lab, phase and quality filters */
	measurements = $derived.by(() => {
		const from = settings.from ? toTime(settings.from, '00:00') : -Infinity;
		const to = settings.to ? toTime(settings.to, '23:59') : Infinity;
		const labs = new Set(settings.hiddenLabs);
		const phases = new Set(settings.hiddenPhases);
		return current.built.measurements.filter(
			(m) =>
				m.t >= from &&
				m.t <= to &&
				!labs.has(m.lab) &&
				!phases.has(m.phase) &&
				(settings.derived || !m.derived) &&
				(settings.suspect !== 'hide' || !m.suspect)
		);
	});

	byAnalyte = $derived(groupBy(this.measurements, (m) => m.analyte));

	/** Every blood draw left after filtering, used for the evenly spaced x axis */
	drawTimes = $derived([...new Set(this.measurements.map((m) => m.t))].sort((a, b) => a - b));

	domain = $derived.by((): [number, number] => {
		const times = this.drawTimes;
		const lo = settings.from ? toTime(settings.from, '00:00') : (times[0] ?? 0);
		const hi = settings.to ? toTime(settings.to, '23:59') : (times.at(-1) ?? 1);
		return [Math.min(lo, times[0] ?? lo), Math.max(hi, times.at(-1) ?? hi)];
	});

	outOfRange = $derived.by(() => {
		const outside = [...this.byAnalyte].filter(([, list]) =>
			list.some((m) => {
				const s = this.judge(m).status;
				return s === 'low' || s === 'high';
			})
		);
		return new Set(outside.map(([id]) => id));
	});

	visible = $derived.by(() => {
		const sel = settings.selection ? new Set(settings.selection) : null;
		const list = current.analytes.filter(
			(a) =>
				(!sel || sel.has(a.id)) &&
				(this.byAnalyte.get(a.id)?.length ?? 0) >= settings.minPoints &&
				matches(a, settings.search) &&
				(!settings.onlyOut || this.outOfRange.has(a.id))
		);
		return sortAnalytes(list, this.byAnalyte);
	});
}

function latestStatusRank(list: Measurement[] | undefined): number {
	const last = list?.at(-1);
	if (!last) return 3;
	const s = filtered.judge(last).status;
	return s === 'high' || s === 'low' ? 0 : s === 'none' ? 2 : 1;
}

function sortAnalytes(list: Analyte[], byAnalyte: Map<string, Measurement[]>): Analyte[] {
	const catalogue = new Map(current.analytes.map((a, i) => [a.id, i]));
	const pinned = new Set(settings.pinned);
	const key: Record<Sort, (a: Analyte, b: Analyte) => number> = {
		group: (a, b) => groupOrder(a.group) - groupOrder(b.group) || catalogue.get(a.id)! - catalogue.get(b.id)!,
		name: (a, b) => nameOf(a).localeCompare(nameOf(b)),
		count: (a, b) => (byAnalyte.get(b.id)?.length ?? 0) - (byAnalyte.get(a.id)?.length ?? 0),
		status: (a, b) => latestStatusRank(byAnalyte.get(a.id)) - latestStatusRank(byAnalyte.get(b.id)),
		recent: (a, b) => (byAnalyte.get(b.id)?.at(-1)?.t ?? 0) - (byAnalyte.get(a.id)?.at(-1)?.t ?? 0)
	};
	return [...list].sort((a, b) => Number(pinned.has(b.id)) - Number(pinned.has(a.id)) || key[settings.sort](a, b));
}

export const filtered = new Filtered();

export function toggle<T>(list: T[], item: T): T[] {
	return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}
