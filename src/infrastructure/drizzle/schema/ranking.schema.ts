import { relations } from 'drizzle-orm';
import { pgTable, smallserial, uuid } from 'drizzle-orm/pg-core';
import { integer, smallint } from 'drizzle-orm/pg-core';

import { timestamps } from '../helper/timestamp.helper';

import { word } from './word.schema';

export const ranking = pgTable('ranking', {
	id: smallserial().primaryKey(),
	year: smallint().notNull(),
	month: smallint().notNull(),
	week: smallint().notNull(),
	rank: smallint().notNull(),
	rankChange: smallint(),
	score: integer().notNull(),
	viewCount: integer().notNull(),
	addLikeCount: integer().notNull(),
	wordId: uuid()
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	...timestamps,
});

export const rankingRelations = relations(ranking, ({ one }) => ({
	word: one(word, {
		fields: [ranking.wordId],
		references: [word.id],
	}),
}));
