import { boolean, timestamp } from 'drizzle-orm/pg-core';

export const softDelete = {
	deletedAt: timestamp({ mode: 'date' }),
	isDeleted: boolean().default(false).notNull(),
};
