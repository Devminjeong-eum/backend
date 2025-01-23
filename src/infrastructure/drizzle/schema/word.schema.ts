import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsDate, IsString, IsUUID } from 'class-validator';
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

export class WordSchema implements WordEntity {
	@IsUUID()
	@ApiProperty({ type: String, format: 'uuid', required: true })
	id: string;

	@IsString()
	@ApiProperty({ type: String, required: true })
	name: string;

	@IsString()
	@ApiProperty({ type: String, required: true })
	description: string;

	@IsArray()
	@IsString({ each: true })
	@ApiProperty({ type: [String], required: true })
	diacritic: string[];

	@IsArray()
	@IsString({ each: true })
	@ApiProperty({ type: [String], required: true })
	pronunciation: string[];

	@IsArray()
	@IsString({ each: true })
	@ApiProperty({ type: [String], required: true })
	wrongPronunciations: string[];

	@IsString()
	@ApiProperty({ type: String, required: true })
	exampleSentence: string;

	@IsDate()
	@ApiProperty({
		type: Date,
		required: true,
		example: '2024-06-18T17:52:40.581Z',
	})
	createdAt: Date;

	@IsDate()
	@ApiProperty({
		type: Date,
		required: true,
		example: '2024-07-06T15:00:01.685Z',
	})
	updatedAt: Date;
}
