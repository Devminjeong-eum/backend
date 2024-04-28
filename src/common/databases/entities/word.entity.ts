import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Word {
	@PrimaryGeneratedColumn('uuid')
	id: string;

    @Column({ type: 'varchar', unique: true })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar' })
    diacritic: string;

    @Column({ type: 'varchar', array: true })
    pronunciation: string[];

    @Column({ type: 'varchar', array: true })
    wrongPronunciations: string[];

    @Column({ type: 'text' })
    exampleSentence: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt?: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt?: Date;
}
