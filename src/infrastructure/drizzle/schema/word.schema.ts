import { relations } from 'drizzle-orm';
import {
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';

import { like } from './like.schema';
import { ranking } from './ranking.schema';
import { textToSpeech } from './text-to-speech.schema';

export const word = pgTable('word', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull().unique(),
	description: text('description').notNull(),
	diacritic: varchar('diacritic').array().notNull(),
	pronunciation: varchar('pronunciation').array().notNull(),
	wrongPronunciations: varchar('wrong_pronunciations').array().notNull(),
	exampleSentence: text('example_sentence').notNull(),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
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
