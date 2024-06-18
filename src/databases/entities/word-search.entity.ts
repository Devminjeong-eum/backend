import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
	UpdateDateColumn,
} from 'typeorm';

import { Word } from './word.entity';

@Entity()
export class WordSearch {
	@Exclude()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({
		description: '특정 단어와 대응되는 검색 키워드입니다.',
	})
	@Column({ type: 'varchar' })
	keyword: string;

	@Exclude()
	@ManyToOne(() => Word, (word) => word.likes, { onDelete: 'CASCADE' })
	word: Relation<Word>;

	@Exclude()
	@CreateDateColumn({ type: 'timestamp' })
	createdAt?: Date;

	@Exclude()
	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt?: Date;
}
