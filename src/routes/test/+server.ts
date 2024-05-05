import type { RequestHandler } from '@sveltejs/kit';
import { genres } from '$lib/server/schemas';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async ({ platform }) => {
	const [onePost] = await db.select().from(genres);
	const response = await platform?.env.AI.run('@cf/baai/bge-base-en-v1.5', { text: 'input' });
	return new Response(JSON.stringify({ post: onePost, response }));
};
