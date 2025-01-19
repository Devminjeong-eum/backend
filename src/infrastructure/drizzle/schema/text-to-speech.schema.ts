import { relations } from 'drizzle-orm';
import {
	pgTable,
	text,
	varchar,
	serial,
	uuid,
} from 'drizzle-orm/pg-core';

import { word } from './word.schema';
import { timestamps } from '../helper/timestamp.helper';

export const textToSpeech = pgTable('text_to_speech', {
	id: serial().primaryKey(),
	audioFileUri: text().notNull(),
	text: varchar().notNull(),
	wordId: uuid()
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	...timestamps,
});

export const textToSpeechRelations = relations(
	textToSpeech,
	({ one }) => ({
		word: one(word, {
			fields: [textToSpeech.wordId],
			references: [word.id],
		}),
	}),
);

export type TextToSpeechEntity = typeof textToSpeech.$inferSelect;