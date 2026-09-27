import { ageAt, printedDecimals } from './data';
import * as f from './data/formulas';
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
			const step = 10 ** -printedDecimals(m.raw);
			const ok = Math.abs(m.value - expected) <= Math.max(0.035 * Math.abs(expected), 0.6 * step);
			out.push({ id, drawId: draw.id, date: draw.date, analyte, printed: m.value, expected, ok });
		};

		const [hct, rbc, hb] = [val('hematocrit'), val('erythrocytes'), val('hemoglobin')];
		if (hct && rbc) check('mcv', 'mcv', f.mcv(hct, rbc));
		if (hb && rbc) check('mch', 'mch', f.mch(hb, rbc));
		if (hb && hct) check('mchc', 'mchc', f.mchc(hb, hct));

		const [chol, hdl, ldl] = [val('cholesterol'), val('hdl'), val('ldl')];
		if (chol && hdl) check('nonHdl', 'non-hdl', f.nonHdl(chol, hdl));
		if (ldl && hdl) check('ldlHdl', 'ldl-hdl', f.ldlHdl(ldl, hdl));

		const [tt, shbg] = [val('testosterone'), val('shbg')];
		if (tt !== undefined && shbg) check('fai', 'fai', f.fai(tt, shbg));

		const a1c = val('hba1c');
		if (a1c) {
			check('hba1c', 'hba1c-ifcc', f.hba1cIfcc(a1c));
			check('eag', 'eag', f.eag(a1c));
		}

		const [iron, trf] = [val('iron'), val('transferrin')];
		if (iron !== undefined && trf) check('tsat', 'tsat', f.tsat(iron, trf));

		// The printed eGFR only needs to match one of the two equations, labs pick by the sex on file
		const crea = val('creatinine');
		const age = ageAt(profile.birth, draw.date);
		const egfr = v.get('egfr');
		if (crea && age !== undefined && egfr && !egfr.censor) {
			const sexes = draw.rangesFor ? [draw.rangesFor] : (['female', 'male'] as const);
			const options = sexes.map((s) => f.ckdEpi2009(crea, age, s));
			const best = options.reduce((a, b) => (Math.abs(b - egfr.value) < Math.abs(a - egfr.value) ? b : a));
			check('egfr', 'egfr', best);
		}
	}
	return out;
}
