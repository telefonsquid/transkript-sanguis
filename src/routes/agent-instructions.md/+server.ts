import { agentInstructions } from '#lib/agent.js';

export const prerender = true;

export function GET() {
	return new Response(agentInstructions(), { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
