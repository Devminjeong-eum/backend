import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	type Relation,
} from 'typeorm';

import { User } from '#databases/entities/user.entity';

@Entity()
export class QuizResult {
	@PrimaryColumn()
	id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: Relation<User>;

	@Column('uuid', { array: true })
	correctWordIds: string[];

	@Column('uuid', { array: true })
	incorrectWordIds: string[];

	@Column({ type: 'timestamp' })
	expiredAt: Date;
}
