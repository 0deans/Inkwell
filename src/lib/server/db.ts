import { DATABASE_URL } from '$env/static/private';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schemas';

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });
