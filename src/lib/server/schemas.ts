import { pgTable, text } from 'drizzle-orm/pg-core';

export const genres = pgTable('genres', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull().unique()
});

export type Genre = typeof genres.$inferSelect;
