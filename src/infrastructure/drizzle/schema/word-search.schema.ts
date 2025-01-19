import { relations } from 'drizzle-orm';
import {
	pgTable,
	serial,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';

import { word } from './word.schema';
import { timestamps } from '../helper/timestamp.helper';

export const wordSearch = pgTable('word_search', {
	id: serial().primaryKey(),
	keyword: varchar().notNull(),
	wordId: uuid()
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	...timestamps,
});

export const wordSearchRelations = relations(wordSearch, ({ one }) => ({
	wordId: one(word, {
		fields: [wordSearch.wordId],
		references: [word.id],
	}),
}));

export type WordSearchEntity = typeof wordSearch.$inferSelect;