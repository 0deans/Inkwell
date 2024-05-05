import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import type { RequestHandler } from '@sveltejs/kit';
import { genres } from '$lib/server/schemas';
import { DATABASE_URL } from '$env/static/private';

export const GET: RequestHandler = async ({ platform }) => {
	const sql = neon(DATABASE_URL);
	const db = drizzle(sql);
	const [onePost] = await db.select().from(genres);

	const response = await platform?.env.AI.run('@cf/baai/bge-base-en-v1.5', { text: 'input' });

	return new Response(JSON.stringify({ post: onePost, response }));
};
