import { Expose } from 'class-transformer';
import {
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
	UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Word } from './word.entity';

@Entity({ name: 'like' })
export class Like {
	@PrimaryGeneratedColumn()
	id: string;

	@ManyToOne(() => Word, (word) => word.likes, { onDelete: 'CASCADE' })
	word: Relation<Word>;

	@ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
	user: Relation<User>;

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
