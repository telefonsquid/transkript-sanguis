import { SLUG } from './app';
import { ageAt, analyteById, analytes as catalogue, buildProfile, customToAnalyte, nowIso, todayIso, type Built } from './data';
import type { Analyte, CustomAnalyte, Draw, Phase, Profile, Sex, Therapy } from './data/types';
import { demoProfiles } from './demo';
import { deleteProfileFiles } from './files';

interface Db {
	profiles: Profile[];
	active: string | null;
	/** When both disclaimers were accepted */
	consent: string | null;
	lastExport: string | null;
}

const KEY = `${SLUG}:db:v1`;

function load(): Db {
	const empty: Db = { profiles: [], active: null, consent: null, lastExport: null };
	try {
		const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
		if (!saved || !Array.isArray(saved.profiles)) return empty;
		return { ...empty, ...saved, profiles: saved.profiles.map(normalizeProfile) };
	} catch {
		return empty;
	}
}

/** Fills fields older or hand written data may lack */
export function normalizeProfile(p: Partial<Profile> & { id: string; name: string }): Profile {
	return {
		created: nowIso(),
		therapy: 'none',
		...p,
		phases: p.phases ?? [],
		reports: p.reports ?? [],
		draws: (p.draws ?? []).map((d) => ({ ...d, results: d.results ?? [] })),
		custom: p.custom ?? []
	};
}

export const db: Db = $state(load());

let saveError = $state<string | null>(null);

export function persistDb() {
	try {
		localStorage.setItem(KEY, JSON.stringify($state.snapshot(db)));
		saveError = null;
	} catch (e) {
		saveError = e instanceof Error ? e.message : String(e);
	}
}

export const storage = {
	get error() {
		return saveError;
	}
};

export const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;

export interface NewProfile {
	name: string;
	therapy: Therapy;
	sex?: Sex;
	birth?: string;
	height?: number;
	hrtStart?: string;
	hrtStartApprox?: boolean;
}

export function createProfile(input: NewProfile): Profile {
	const phases: Phase[] = input.hrtStart
		? [{ id: newId('phase'), label: 'HRT', start: input.hrtStart, approx: input.hrtStartApprox }]
		: [];
	const profile = normalizeProfile({
		id: newId('profile'),
		name: input.name.trim(),
		created: nowIso(),
		therapy: input.therapy,
		sex: input.sex ?? (input.therapy === 'feminizing' ? 'male' : input.therapy === 'masculinizing' ? 'female' : undefined),
		birth: input.birth || undefined,
		height: input.height || undefined,
		phases
	});
	db.profiles.push(profile);
	db.active = profile.id;
	return profile;
}

export function addProfile(p: Profile) {
	db.profiles.push(normalizeProfile(p));
}

export function profileById(id: string | null | undefined): Profile | undefined {
	return db.profiles.find((p) => p.id === id);
}

export async function deleteProfile(id: string) {
	db.profiles = db.profiles.filter((p) => p.id !== id);
	if (db.active === id) db.active = db.profiles[0]?.id ?? null;
	try {
		await deleteProfileFiles(id);
	} catch {
		// Missing file store only means there were no PDFs
	}
}

/** Adds the demo profiles, replacing earlier copies of them */
export function loadDemos(activate = true) {
	const demos = demoProfiles();
	db.profiles = [...db.profiles.filter((p) => !demos.some((d) => d.id === p.id)), ...demos];
	if (activate || !profileById(db.active)) db.active = demos[0].id;
}

export function setActive(id: string) {
	if (profileById(id)) db.active = id;
}

/** Inserts a draw or replaces the one with the same id, kept in date order */
export function saveDraw(profile: Profile, draw: Draw) {
	const i = profile.draws.findIndex((d) => d.id === draw.id);
	if (i >= 0) profile.draws[i] = draw;
	else profile.draws.push(draw);
	profile.draws.sort((a, b) => `${a.date}${a.time ?? ''}`.localeCompare(`${b.date}${b.time ?? ''}`));
}

export function deleteDraw(profile: Profile, drawId: string) {
	profile.draws = profile.draws.filter((d) => d.id !== drawId);
}

/** Creates a value the catalogue lacks, or reuses one with the same name and unit */
export function addCustom(profile: Profile, name: string, unit: string): CustomAnalyte {
	const same = profile.custom.find((c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.unit === unit.trim());
	if (same) return same;
	const slug = name
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	let id = `x-${slug || 'value'}`;
	for (let n = 2; profile.custom.some((c) => c.id === id); n++) id = `x-${slug}-${n}`;
	const custom = { id, name: name.trim(), unit: unit.trim() };
	profile.custom.push(custom);
	return custom;
}

/** Everything derived from the active profile */
class Current {
	profile = $derived(db.profiles.find((p) => p.id === db.active) ?? null);

	custom = $derived(new Map((this.profile?.custom ?? []).map((c) => [c.id, customToAnalyte(c)])));

	/** Catalogue plus the profile's own values */
	analytes: Analyte[] = $derived([...catalogue, ...this.custom.values()]);

	therapy: Therapy = $derived(this.profile?.therapy ?? 'none');

	age = $derived(ageAt(this.profile?.birth, todayIso()));

	built: Built = $derived(buildProfile(this.profile, (id) => this.lookup(id)));

	lookup(id: string): Analyte | undefined {
		return analyteById.get(id) ?? this.custom.get(id);
	}
}

export const current = new Current();

export const lookup = (id: string) => current.lookup(id);
