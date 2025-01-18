import { relations } from 'drizzle-orm';
import {
	integer,
	pgTable,
	text,
	timestamp,
	varchar,
    serial,
} from 'drizzle-orm/pg-core';

import { word } from './word.schema';

export const textToSpeech = pgTable('text_to_speech', {
	id: serial().primaryKey(),
	audioFileUri: text('audio_file_uri').notNull(),
	text: varchar('text').notNull(),
	wordId: integer('word_id')
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
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
