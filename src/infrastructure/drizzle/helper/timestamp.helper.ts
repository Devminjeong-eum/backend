import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
	createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
};
