import { importSchema } from '#lib/agent.js';

export const prerender = true;

export function GET() {
	return new Response(JSON.stringify(importSchema(), null, 2), { headers: { 'content-type': 'application/json' } });
}
