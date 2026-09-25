import { ageAt, ckdEpi2009 } from './data';
import type { Measurement, Profile } from './data/types';

export type CheckId = 'mcv' | 'mch' | 'mchc' | 'nonHdl' | 'ldlHdl' | 'fai' | 'hba1c' | 'eag' | 'egfr' | 'tsat';

export interface Check {
	id: CheckId;
	drawId: string;
	date: string;
	/** Analyte the printed value belongs to */
	analyte: string;
	printed: number;
	expected: number;
	ok: boolean;
}

/** Decimals a printed value was given with */
const decimals = (raw: string) => raw.match(/[.,](\d+)\s*$/)?.[1].length ?? 0;

/**
 * Recomputes printed values from the other values of the same draw. Rounding on the report
 * and small method differences are allowed, anything beyond that hints at a typo or a unit mixup.
 */
export function runChecks(profile: Profile | null, measurements: Measurement[]): Check[] {
	if (!profile) return [];
	const out: Check[] = [];
	const byDraw = Map.groupBy(
		measurements.filter((m) => !m.derived && !m.censor),
		(m) => m.drawId
	);

	for (const draw of profile.draws) {
		const list = byDraw.get(draw.id) ?? [];
		const v = new Map(list.map((m) => [m.analyte, m]));
		const val = (id: string) => v.get(id)?.value;

		const check = (id: CheckId, analyte: string, expected: number | undefined) => {
			const m = v.get(analyte);
			if (!m || expected === undefined || !Number.isFinite(expected)) return;
			const step = 10 ** -decimals(m.raw);
			const ok = Math.abs(m.value - expected) <= Math.max(0.035 * Math.abs(expected), 0.6 * step);
			out.push({ id, drawId: draw.id, date: draw.date, analyte, printed: m.value, expected, ok });
		};

		const [hct, rbc, hb] = [val('hematocrit'), val('erythrocytes'), val('hemoglobin')];
		if (hct && rbc) check('mcv', 'mcv', (hct / rbc) * 10);
		if (hb && rbc) check('mch', 'mch', (hb / rbc) * 10);
		if (hb && hct) check('mchc', 'mchc', (hb / hct) * 100);

		const [chol, hdl, ldl] = [val('cholesterol'), val('hdl'), val('ldl')];
		if (chol && hdl) check('nonHdl', 'non-hdl', chol - hdl);
		if (ldl && hdl) check('ldlHdl', 'ldl-hdl', ldl / hdl);

		const [tt, shbg] = [val('testosterone'), val('shbg')];
		if (tt !== undefined && shbg) check('fai', 'fai', ((tt * 3.467) / shbg) * 100);

		const a1c = val('hba1c');
		if (a1c) {
			check('hba1c', 'hba1c-ifcc', (a1c - 2.15) * 10.929);
			check('eag', 'eag', 28.7 * a1c - 46.7);
		}

		const [iron, trf] = [val('iron'), val('transferrin')];
		if (iron !== undefined && trf) check('tsat', 'tsat', (iron * 70.9) / trf);

		// The printed eGFR only needs to match one of the two equations, labs pick by the sex on file
		const crea = val('creatinine');
		const age = ageAt(profile.birth, draw.date);
		const egfr = v.get('egfr');
		if (crea && age !== undefined && egfr && !egfr.censor) {
			const sexes = draw.rangesFor ? [draw.rangesFor] : (['female', 'male'] as const);
			const options = sexes.map((s) => ckdEpi2009(crea, age, s));
			const best = options.reduce((a, b) => (Math.abs(b - egfr.value) < Math.abs(a - egfr.value) ? b : a));
			check('egfr', 'egfr', best);
		}
	}
	return out;
}
