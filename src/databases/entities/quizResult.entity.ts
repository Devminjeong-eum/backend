import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '#databases/entities/user.entity';

@Entity()
export class QuizResult {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: User;

	@Column('uuid', { array: true })
	correctWordIds: string[];
  
	@Column('uuid', { array: true })
	incorrectWordIds: string[];

	@Column({ type: 'timestamp' })
	expiredAt: Date;
}
