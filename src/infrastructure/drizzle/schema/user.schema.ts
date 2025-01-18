import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { like } from './like.schema';

export const user = pgTable('user', {
	id: varchar().primaryKey(),
	name: varchar().notNull(),
	profileImage: varchar().notNull(),
	socialType: varchar().notNull(),
	socialPlatformId: varchar().notNull(),
	createdAt: timestamp({ mode: 'date' }).defaultNow(),
	updatedAt: timestamp({ mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	deletedAt: timestamp({ mode: 'date' }),
});

export const userRelations = relations(user, ({ many }) => ({
	likes: many(like),
}));
