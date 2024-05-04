import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import type { RequestHandler } from '@sveltejs/kit';
import { genres } from '$lib/server/schemas';

export const GET: RequestHandler = async () => {
	const sql = neon(process.env.DATABASE_URL!);
	const db = drizzle(sql);
	const [onePost] = await db.select().from(genres);
	return new Response(JSON.stringify({ post: onePost }));
};
