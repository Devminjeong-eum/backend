import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';

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

	@CreateDateColumn({ type: 'timestamp' })
	createdAt?: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt?: Date;

	@DeleteDateColumn({ type: 'timestamp' })
	deletedAt?: Date;
}
