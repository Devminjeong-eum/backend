import { relations } from 'drizzle-orm';
import {
	integer,
	pgTable,
	serial,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

import { word } from './word.schema';

export const wordSearch = pgTable('word_search', {
	id: serial().primaryKey(),
	keyword: varchar().notNull(),
	wordId: integer()
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	createdAt: timestamp({ mode: 'date' }).defaultNow(),
	updatedAt: timestamp({ mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const wordSearchRelations = relations(wordSearch, ({ one }) => ({
	word: one(word, {
		fields: [wordSearch.wordId],
		references: [word.id],
	}),
}));
