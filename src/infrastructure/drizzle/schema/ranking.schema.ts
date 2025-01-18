import { relations } from 'drizzle-orm';
import { pgTable, smallserial } from 'drizzle-orm/pg-core';
import { integer, smallint, timestamp } from 'drizzle-orm/pg-core';

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
	wordId: integer().references(() => word.id),
	createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updatedAt', { mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const rankingRelations = relations(ranking, ({ one }) => ({
	word: one(word, {
		fields: [ranking.wordId],
		references: [word.id],
	}),
}));
