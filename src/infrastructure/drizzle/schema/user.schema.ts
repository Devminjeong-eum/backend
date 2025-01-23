import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsOptional, IsString, IsUrl } from 'class-validator';
import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../helper/timestamp.helper';

import { like } from './like.schema';

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

export type UserEntity = typeof user.$inferSelect;

export class UserSchema implements UserEntity {
	@IsString()
	@ApiProperty({ type: String, required: true, example: 'user12345' })
	id: string;

	@IsString()
	@ApiProperty({ type: String, required: true, example: 'John Doe' })
	name: string;

	@IsUrl()
	@IsOptional()
	@ApiProperty({
		type: String,
		format: 'uri',
		required: false,
		example: 'https://example.com/profile-image.jpg',
	})
	profileImage: string;

	@IsString()
	@ApiProperty({ type: String, required: true, example: 'google' })
	socialType: string;

	@IsString()
	@ApiProperty({ type: String, required: true, example: '123456789' })
	socialPlatformId: string;

	@IsDate()
	@IsOptional()
	@ApiProperty({
		type: Date,
		required: false,
		example: '2025-01-23T13:30:00.000Z',
	})
	deletedAt: Date;

	@IsDate()
	@ApiProperty({
		type: Date,
		required: true,
		example: '2025-01-23T13:00:00.000Z',
	})
	createdAt: Date;

	@IsDate()
	@IsOptional()
	@ApiProperty({
		type: Date,
		required: false,
		example: '2025-01-23T13:30:00.000Z',
	})
	updatedAt: Date;
}
