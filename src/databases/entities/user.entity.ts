import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar' })
	name: string;

	@Column({ type: 'varchar', unique: true })
	email: string;

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
