import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './user.schema';

export const quizResult = pgTable('quiz_result', {
	id: uuid('id').primaryKey(),
	userId: uuid()
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	correctWordIds: uuid().array().notNull(),
	incorrectWordIds: uuid().array().notNull(),
	expiredAt: timestamp({ mode: 'date' }).notNull(),
});

export const quizResultRelations = relations(quizResult, ({ one }) => ({
	user: one(user, {
		fields: [quizResult.userId],
		references: [user.id],
	}),
}));

export type QuizResultEntity = typeof quizResult.$inferSelect;

export class QuizSchema implements QuizResultEntity {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ type: String, required: true })
	id: string;

	@IsString()
	@IsNotEmpty()
	@IsUUID(5)
	@ApiProperty({ type: String, required: true, format: 'uuid' })
	userId: string;

	@IsString({ each: true })
	@IsArray()
	@ApiProperty({ type: String, isArray: true, required: true })
	correctWordIds: string[];

	@IsString({ each: true })
	@IsArray()
	@ApiProperty({ type: String, isArray: true, required: true })
	incorrectWordIds: string[];

	@IsDate()
	@ApiProperty({ type: Date, required: true })
	expiredAt: Date;
}
