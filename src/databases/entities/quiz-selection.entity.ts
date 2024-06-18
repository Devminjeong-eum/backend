import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from 'typeorm';

import { Word } from './word.entity';

@Entity()
export class QuizSelection {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => Word, { eager: true })
	@JoinColumn()
	word: Relation<Word>;

	@Column({ type: 'varchar' })
	correct: string;

	@Column({ type: 'varchar', array: true })
	incorrectList: string[];
}
