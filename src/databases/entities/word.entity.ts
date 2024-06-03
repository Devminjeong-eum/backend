import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import { Like } from './like.entity';

@Entity()
export class Word {
	@ApiProperty({
		description: '단어 별 고유 UUID 입니다.',
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		description: '단어 별로 부여되는 고유 Sequence 값입니다.',
	})
	@PrimaryGeneratedColumn()
	sequence: number;

	@ApiProperty({
		description: '단어의 이름입니다.',
	})
	@Column({ type: 'varchar', unique: true })
	name: string;

	@ApiProperty({
		description: '단어에 대한 설명입니다.',
	})
	@Column({ type: 'text' })
	description: string;

	@ApiProperty({
		description: '단어의 발음 기호 목록입니다.',
	})
	@Column({ type: 'varchar', array: true })
	diacritic: string[];

	@ApiProperty({
		description: '단어의 올바른 발음 예시 목록입니다.',
	})
	@Column({ type: 'varchar', array: true })
	pronunciation: string[];

	@ApiProperty({
		description: '단어의 잘못된 발음 예시 목록입니다.',
	})
	@Column({ type: 'varchar', array: true })
	wrongPronunciations: string[];

	@ApiProperty({
		description: '단어 사용 예문입니다.',
	})
	@Column({ type: 'text' })
	exampleSentence: string;

	@Exclude()
	@OneToMany(() => Like, (like) => like.word)
	likes: Like[];

	@Exclude()
	@CreateDateColumn({ type: 'timestamp' })
	createdAt?: Date;

	@Exclude()
	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt?: Date;
}
