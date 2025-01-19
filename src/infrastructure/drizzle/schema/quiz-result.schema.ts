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