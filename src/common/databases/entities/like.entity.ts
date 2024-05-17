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
import { Expose } from 'class-transformer';

@Entity({ name: 'like' })
export class Like {
	@PrimaryGeneratedColumn()
	id: string;

	@ManyToOne(() => Word, (word) => word.likes)
	word: Word;

	@ManyToOne(() => User, (user) => user.likes)
	user: User;

	@Expose()
	@CreateDateColumn({ type: 'timestamp' })
	createdAt?: Date;

	@Expose()
	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt?: Date;

	@Expose()
	@DeleteDateColumn({ type: 'timestamp', nullable: true })
	deletedAt?: Date;
}
