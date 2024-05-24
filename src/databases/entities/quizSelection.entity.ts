import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Word } from './word.entity';

@Entity()
export class QuizSelection {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => Word, { eager: true })
	word: Word;

	@Column()
	correct: string;

	@Column({ array: true })
	incorrectList: string[];
}
