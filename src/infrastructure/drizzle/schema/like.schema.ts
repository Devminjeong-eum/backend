import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { timestamps } from '../helper/timestamp.helper';

import { user } from './user.schema';
import { word } from './word.schema';
import { Exclude } from 'class-transformer';

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

export class LikeSchema implements LikeEntity {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ type: String, required: true })
	id: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ type: String, required: true })
	wordId: string;

	@IsString()
	@IsNotEmpty()
	@IsUUID(5)
	@ApiProperty({ type: String, required: true, format: 'uuid' })
	userId: string;

	@IsDate()
	@ApiProperty({ type: Date })
	createdAt: Date;

	@IsDate()
	@ApiProperty({ type: Date })
	updatedAt: Date;

	@IsDate()
	@Exclude()
	@ApiProperty({ type: Date })
	deletedAt: Date | null;
}
