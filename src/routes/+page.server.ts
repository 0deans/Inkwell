import { db } from '$lib/server/db';
import { genres } from '$lib/server/schemas';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const [onePost] = await db.select().from(genres);
	const response = await platform?.env.AI.run('@cf/baai/bge-base-en-v1.5', { text: 'input' });
	return { onePost, response };
};
