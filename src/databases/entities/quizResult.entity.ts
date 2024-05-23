import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '#databases/entities/user.entity';
import { Word } from '#databases/entities/word.entity';

@Entity()
export class QuizResult {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: User;

	@ManyToOne(() => Word)
	@JoinColumn({ name: 'correctWordIds' })
	correctWordIds: Word[];

	@ManyToOne(() => Word)
	@JoinColumn({ name: 'incorrectWordIds' })
	incorrectWordIds: string[];
}
