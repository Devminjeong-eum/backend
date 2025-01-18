import { Exclude } from 'class-transformer';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
	UpdateDateColumn,
} from 'typeorm';

import { Word } from './word.entity';

@Entity()
export class TextToSpeech {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'text' })
	audioFileUri: string;

	@Column({ type: 'varchar' })
	text: string;

	@OneToOne(() => Word, (word) => word.audioFile, { onDelete: 'CASCADE' })
	@JoinColumn()
	word: Relation<Word>;

	@Exclude()
	@CreateDateColumn({ type: 'timestamp' })
	createdAt?: Date;

	@Exclude()
	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt?: Date;
}
