import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsNumber, IsString } from 'class-validator';
import { relations } from 'drizzle-orm';
import { pgTable, serial, uuid, varchar } from 'drizzle-orm/pg-core';

import { word } from './word.schema';

export const quizSelection = pgTable('quiz_selection', {
	id: serial().primaryKey(),
	wordId: uuid()
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	correct: varchar().notNull(),
	incorrectList: varchar().array().notNull(),
});

export const quizSelectionRelations = relations(quizSelection, ({ one }) => ({
	word: one(word, {
		fields: [quizSelection.wordId],
		references: [word.id],
	}),
}));

export type QuizSelectionEntity = typeof quizSelection.$inferSelect;

export class QuizSelectionSchema implements QuizSelectionEntity {
	@IsNumber()
	@ApiProperty({ type: Number, required: true })
	id: number;

	@IsString()
	@ApiProperty({ type: String, required: true })
	wordId: string;

	@IsString()
	@ApiProperty({ type: String, required: true })
	correct: string;

	@IsString({ each: true })
	@IsArray()
	@ApiProperty({ type: String, isArray: true, required: true })
	incorrectList: string[];
}
