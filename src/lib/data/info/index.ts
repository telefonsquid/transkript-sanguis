import type { InfoEntry } from '../types';
import { blood } from './blood';
import { chemistry } from './chemistry';
import { hormones } from './hormones';
import { metabolism } from './metabolism';
import { nutrients } from './nutrients';

/** Explanations per analyte id, kept apart from the ranges so the catalogue stays readable */
export const info: Record<string, InfoEntry> = { ...hormones, ...blood, ...chemistry, ...metabolism, ...nutrients };
