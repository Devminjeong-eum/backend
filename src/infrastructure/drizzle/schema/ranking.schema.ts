import { ApiProperty } from '@nestjs/swagger';

import {
	IsDate,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { relations } from 'drizzle-orm';
import { pgTable, smallserial, uuid } from 'drizzle-orm/pg-core';
import { integer, smallint } from 'drizzle-orm/pg-core';

import { timestamps } from '../helper/timestamp.helper';

import { word } from './word.schema';

export const ranking = pgTable('ranking', {
	id: smallserial().primaryKey(),
	year: smallint().notNull(),
	month: smallint().notNull(),
	week: smallint().notNull(),
	rank: smallint().notNull(),
	rankChange: smallint(),
	score: integer().notNull(),
	viewCount: integer().notNull(),
	addLikeCount: integer().notNull(),
	wordId: uuid()
		.notNull()
		.references(() => word.id, { onDelete: 'cascade' }),
	...timestamps,
});

export const rankingRelations = relations(ranking, ({ one }) => ({
	word: one(word, {
		fields: [ranking.wordId],
		references: [word.id],
	}),
}));

export type RankingEntity = typeof ranking.$inferSelect;

export class RankingSchema implements RankingEntity {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ type: Number, required: true })
	id: number;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ type: Number, required: true })
	year: number;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ type: Number, required: true })
	month: number;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ type: Number, required: true })
	week: number;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ type: Number, required: true })
	rank: number;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ type: Number, required: true })
	rankChange: number;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ type: Number, required: true })
	score: number;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ type: Number, required: true })
	viewCount: number;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({ type: Number, required: true })
	addLikeCount: number;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ type: String, required: true })
	wordId: string;

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
