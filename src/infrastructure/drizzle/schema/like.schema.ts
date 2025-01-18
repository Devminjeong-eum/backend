import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './user.schema';
import { word } from './word.schema';

export const like = pgTable('like', {
  id: uuid().primaryKey().defaultRandom(),
  wordId: uuid()
    .notNull()
    .references(() => word.id, { onDelete: 'cascade' }),
  userId: uuid()
    .notNull()
    .references(() => word.id, { onDelete: 'cascade' }),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
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