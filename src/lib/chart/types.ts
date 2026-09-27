import type { Kind, Status } from '../data/judge';
import type { Measurement } from '../data/types';

export type XMode = 'time' | 'draws' | 'points';

export interface ChartPoint {
	t: number;
	/** Value in display units */
	v: number;
	m: Measurement;
	text: string;
	status: Status;
}

export interface ChartSeries {
	id: string;
	name: string;
	color: string;
	unit: string;
	points: ChartPoint[];
}

export interface BandStep {
	t: number;
	low?: number;
	high?: number;
}

export interface ChartBand {
	id: string;
	/** Reference kind, which also picks the colour */
	kind?: Kind;
	/** Colour for bands that stand for no reference kind */
	color?: string;
	label: string;
	low?: number;
	high?: number;
	/** Limits that change over time, each owns the span halfway to its neighbours */
	steps?: BandStep[];
	range: string;
	filled: boolean;
}
