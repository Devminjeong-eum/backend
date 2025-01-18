import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { like } from './like.schema';

export const user = pgTable('user', {
  id: varchar('id').primaryKey(),
  name: varchar('name').notNull(),
  profileImage: varchar('profile_image').notNull(),
  socialType: varchar('social_type').notNull(),
  socialPlatformId: varchar('social_platform_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date' }).defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  likes: many(like),
}));