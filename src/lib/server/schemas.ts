import { relations } from 'drizzle-orm';
import { index, integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { vector } from './pgvector';

export const genres = pgTable('genres', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text('name').notNull().unique()
});

export const authors = pgTable('authors', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$defaultFn(() => createId()),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull()
});

/* bug in drizzle-orm: custom types generated inside quotes
so we can't use dimensions in the custom type */
export const books = pgTable(
	'books',
	{
		id: text('id')
			.notNull()
			.primaryKey()
			.$defaultFn(() => createId()),
		title: text('title').notNull(),
		pageCount: integer('page_count').notNull(),
		year: integer('year').notNull(),
		embedding: vector('embedding').notNull()
	},
	(t) => ({ embeddingIdx: index('embedding_idx').on(t.embedding) })
);

export const bookGenres = pgTable(
	'book_genres',
	{
		bookId: text('book_id')
			.notNull()
			.references(() => books.id),
		genreId: text('genre_id')
			.notNull()
			.references(() => genres.id)
	},
	(t) => ({ pk: primaryKey({ columns: [t.bookId, t.genreId] }) })
);

export const bookAuthors = pgTable(
	'book_authors',
	{
		bookId: text('book_id')
			.notNull()
			.references(() => books.id),
		authorId: text('author_id')
			.notNull()
			.references(() => authors.id)
	},
	(t) => ({ pk: primaryKey({ columns: [t.bookId, t.authorId] }) })
);

export const bookGenreRelations = relations(bookGenres, ({ one }) => ({
	book: one(books, {
		fields: [bookGenres.bookId],
		references: [books.id]
	}),
	genre: one(genres, {
		fields: [bookGenres.genreId],
		references: [genres.id]
	})
}));

export const bookAuthorRelations = relations(bookAuthors, ({ one }) => ({
	book: one(books, {
		fields: [bookAuthors.bookId],
		references: [books.id]
	}),
	author: one(authors, {
		fields: [bookAuthors.authorId],
		references: [authors.id]
	})
}));

export const bookRelations = relations(books, ({ many }) => ({
	genres: many(bookGenres),
	authors: many(bookAuthors)
}));

export type Genre = typeof genres.$inferSelect;
export type Author = typeof authors.$inferSelect;
export type Book = typeof books.$inferSelect;

export type BookWithRelations = Book & {
	genres: Genre[];
	authors: Author[];
};
