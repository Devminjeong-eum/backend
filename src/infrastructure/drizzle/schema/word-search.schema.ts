import { ApiProperty } from '@nestjs/swagger';

import {
	IsDate,
	IsNotEmpty,
	IsNumber,
	IsPositive,
	IsString,
	IsUUID,
} from 'class-validator';
import { relations } from 'drizzle-orm';
import { pgTable, serial, uuid, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../helper/timestamp.helper';

import { word } from './word.schema';

export const wordSearch = pgTable('word_search', {
	id: serial().primaryKey(),
	keyword: varchar().notNull(),
	wordId: uuid()
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	...timestamps,
});

export const wordSearchRelations = relations(wordSearch, ({ one }) => ({
	wordId: one(word, {
		fields: [wordSearch.wordId],
		references: [word.id],
	}),
}));

export type WordSearchEntity = typeof wordSearch.$inferSelect;

export class WordSearchSchema implements WordSearchEntity {
	@IsNumber()
	@IsPositive()
	@ApiProperty({ type: Number, required: true })
	id: number;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ type: String, required: true })
	keyword: string;

	@IsUUID(5)
	@IsNotEmpty()
	@ApiProperty({ type: String, required: true })
	wordId: string;

	@IsDate()
	@ApiProperty({
		type: Date,
		required: true,
		example: '2025-01-23T13:00:00.000Z',
	})
	createdAt: Date;

	@IsDate()
	@ApiProperty({
		type: Date,
		required: true,
		example: '2025-01-23T13:30:00.000Z',
	})
	updatedAt: Date;
}
