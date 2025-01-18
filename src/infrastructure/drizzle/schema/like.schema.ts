import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './user.schema';
import { word } from './word.schema';

export const like = pgTable('like', {
	id: uuid('id').primaryKey().defaultRandom(),
	wordId: uuid('word_id')
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	userId: uuid('user_id')
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	deletedAt: timestamp('deleted_at', { mode: 'date' }),
});

export const likeRelations = relations(like, ({ one }) => ({
	word: one(word, {
		fields: [like.wordId],
		references: [word.id],
	}),
	user: one(user, {
		fields: [like.userId],
		references: [user.id],
	}),
}));
