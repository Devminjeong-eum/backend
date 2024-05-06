import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Word {
	@ApiProperty({
		description: '단어 별 고유 UUID 입니다.',
		type: String,
	})
	@Expose()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		description: '단어의 이름입니다.',
		type: String,
	})
	@Expose()
	@Column({ type: 'varchar', unique: true })
	name: string;

	@ApiProperty({
		description: '단어에 대한 설명입니다.',
		type: String,
	})
	@Expose()
	@Column({ type: 'text' })
	description: string;

	@ApiProperty({
		description: '단어의 발음 기호 목록입니다.',
		type: Array<string>,
	})
	@Expose()
	@Column({ type: 'varchar', array: true })
	diacritic: string[];

	@ApiProperty({
		description: '단어의 올바른 발음 예시 목록입니다.',
		type: Array<string>,
	})
	@Expose()
	@Column({ type: 'varchar', array: true })
	pronunciation: string[];

	@ApiProperty({
		description: '단어의 잘못된 발음 예시 목록입니다.',
		type: Array<string>,
	})
	@Column({ type: 'varchar', array: true })
	wrongPronunciations: string[];

	@ApiProperty({
		description: '단어 사용 예문입니다.',
		type: String,
	})
	@Column({ type: 'text' })
	exampleSentence: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt?: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt?: Date;
}
