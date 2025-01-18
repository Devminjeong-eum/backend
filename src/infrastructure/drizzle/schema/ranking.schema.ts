import { relations } from 'drizzle-orm';
import { pgTable, smallserial } from 'drizzle-orm/pg-core';
import { integer, smallint, timestamp } from 'drizzle-orm/pg-core';

import { word } from './word.schema';

export const ranking = pgTable('ranking', {
	id: smallserial().primaryKey(),
	year: smallint('year').notNull(),
	month: smallint('month').notNull(),
	week: smallint('week').notNull(),
	rank: smallint('rank').notNull(),
	rankChange: smallint('rank_change'),
	score: integer('score').notNull(),
	viewCount: integer('view_count').notNull(),
	addLikeCount: integer('add_like_count').notNull(),
	wordId: integer('word_id').references(() => word.id),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
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
