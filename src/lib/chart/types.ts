import type { Kind, Status } from '../analysis';
import type { Measurement } from '../data/types';

export interface ChartPoint {
	t: number;
	/** Value in display units */
	v: number;
	m: Measurement;
	text: string;
	status: Status;
	lab?: { low?: number; high?: number };
}

export interface ChartSeries {
	id: string;
	name: string;
	color: string;
	unit: string;
	points: ChartPoint[];
}

export interface ChartBand {
	id: string;
	kind: Kind;
	label: string;
	low?: number;
	high?: number;
	range: string;
	filled: boolean;
}
