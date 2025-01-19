import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { timestamps } from '../helper/timestamp.helper';

import { user } from './user.schema';
import { word } from './word.schema';

export const like = pgTable('like', {
	id: uuid().primaryKey().defaultRandom(),
	wordId: uuid()
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	userId: uuid()
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	...timestamps,
	deletedAt: timestamp({ mode: 'date' }),
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

export type LikeEntity = typeof like.$inferSelect;
