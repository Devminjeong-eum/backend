import { relations } from 'drizzle-orm';
import { pgTable, serial, text, uuid, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../helper/timestamp.helper';

import { word } from './word.schema';

export const textToSpeech = pgTable('text_to_speech', {
	id: serial().primaryKey(),
	audioFileUri: text().notNull(),
	text: varchar().notNull(),
	wordId: uuid()
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	...timestamps,
});

export const textToSpeechRelations = relations(textToSpeech, ({ one }) => ({
	word: one(word, {
		fields: [textToSpeech.wordId],
		references: [word.id],
	}),
}));

export type TextToSpeechEntity = typeof textToSpeech.$inferSelect;
