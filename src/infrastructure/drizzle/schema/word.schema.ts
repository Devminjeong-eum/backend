import { relations } from 'drizzle-orm';
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../helper/timestamp.helper';

import { like } from './like.schema';
import { ranking } from './ranking.schema';
import { textToSpeech } from './text-to-speech.schema';

export const word = pgTable('word', {
	id: uuid().primaryKey().defaultRandom(),
	name: varchar().notNull().unique(),
	description: text().notNull(),
	diacritic: varchar().array().notNull(),
	pronunciation: varchar().array().notNull(),
	wrongPronunciations: varchar().array().notNull(),
	exampleSentence: text().notNull(),
	...timestamps,
});

export const wordRelations = relations(word, ({ one, many }) => ({
	likes: many(like),
	wordSearches: many(like),
	rankings: many(ranking),
	audioFile: one(textToSpeech, {
		fields: [word.id],
		references: [textToSpeech.wordId],
	}),
}));

export type WordEntity = typeof word.$inferSelect;
