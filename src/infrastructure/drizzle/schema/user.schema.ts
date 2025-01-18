import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { like } from './like.schema';
import { timestamps } from '../helper/timestamp.helper';

export const user = pgTable('user', {
	id: varchar().notNull().primaryKey(),
	name: varchar().notNull(),
	profileImage: varchar().notNull(),
	socialType: varchar().notNull(),
	socialPlatformId: varchar().notNull(),
	deletedAt: timestamp({ mode: 'date' }),
	...timestamps,
});

export const userRelations = relations(user, ({ many }) => ({
	likes: many(like),
}));
