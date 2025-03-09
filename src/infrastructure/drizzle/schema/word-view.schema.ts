import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { relations } from 'drizzle-orm';
import { date, integer, pgTable, uuid } from 'drizzle-orm/pg-core';

import { word } from './word.schema';

export const wordView = pgTable('word_view', {
	viewCount: integer().notNull(),
	viewedAt: date({ mode: 'date' }),
	wordId: uuid()
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
});

export const wordViewRelation = relations(wordView, ({ one }) => ({
	word: one(word, {
		fields: [wordView.wordId],
		references: [word.id],
	}),
}));

export type WordViewEntity = typeof wordView.$inferSelect;

export class WordViewSchema implements WordViewEntity {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ type: Number, required: true })
	viewCount: number;

	@IsDate()
	@ApiProperty({
		type: Date,
		required: true,
		example: '2025-01-23T13:00:00.000Z',
	})
	viewedAt: Date;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ type: String, required: true, example: 'word12345' })
	wordId: string;
}
