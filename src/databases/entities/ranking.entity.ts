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
export class Ranking {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'smallint' })
	year: number;

	@Column({ type: 'smallint' })
	month: number;

	@Column({ type: 'smallint' })
	week: number;

	@Column({ type: 'smallint' })
	rank: number;

	@Column({ type: 'smallint', nullable: true })
	rankChange: number | null;

	@ManyToOne(() => Word, (word) => word.rankings)
	word: Relation<Word>;

	@Exclude()
	@CreateDateColumn({ type: 'timestamp' })
	createdAt?: Date;

	@Exclude()
	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt?: Date;
}
