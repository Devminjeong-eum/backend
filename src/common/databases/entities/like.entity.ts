import {
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import { Word } from './word.entity';
import { User } from './user.entity';

@Entity({ name: 'like' })
export class Like {
	@PrimaryGeneratedColumn()
	id: string;

	@ManyToOne(() => Word, (word) => word.likes)
	word: Word;

	@ManyToOne(() => User, (user) => user.likes)
	user: User;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt?: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt?: Date;

	@DeleteDateColumn({ type: 'timestamp' })
	deletedAt?: Date;
}
