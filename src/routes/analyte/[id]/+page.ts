import type { PageLoad } from './$types';

/** Custom values live in the profile, so the id is only checked once the page renders */
export const load: PageLoad = ({ params }) => ({ id: params.id });
