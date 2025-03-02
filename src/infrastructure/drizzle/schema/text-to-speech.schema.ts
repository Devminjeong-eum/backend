import { ApiProperty } from '@nestjs/swagger';

import {
	IsDate,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUrl,
} from 'class-validator';
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

export class TextToSpeechSchema implements TextToSpeechEntity {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ type: Number, required: true })
	id: number;

	@IsUrl()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		format: 'uri',
		required: true,
		example: 'https://example.com/audio/file.mp3',
	})
	audioFileUri: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ type: String, required: true, example: 'Hello world!' })
	text: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ type: String, required: true, example: 'word12345' })
	wordId: string;

	@IsDate()
	@ApiProperty({
		type: Date,
		required: true,
		example: '2025-01-23T13:00:00.000Z',
	})
	createdAt: Date;

	@IsDate()
	@IsOptional()
	@ApiProperty({
		type: Date,
		required: false,
		example: '2025-01-23T13:30:00.000Z',
	})
	updatedAt: Date;
}
