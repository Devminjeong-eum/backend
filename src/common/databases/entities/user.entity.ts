import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';

import { Like } from './like.entity';

@Entity({ name: 'user' })
export class User {
	@PrimaryColumn({ type: 'varchar', unique: true })
	id: string;

	@Column({ type: 'varchar' })
	name: string;

	@Column({ type: 'varchar' })
	profileImage: string;

	@Column({
		type: 'enum',
		enum: ['kakao'],
	})
	socialType: string;

	@OneToMany(() => Like, (like) => like.user)
	likes: Like[];

	@CreateDateColumn({ type: 'timestamp' })
	createdAt?: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt?: Date;

	@DeleteDateColumn({ type: 'timestamp' })
	deletedAt?: Date;
}
