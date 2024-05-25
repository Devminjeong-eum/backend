import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RequestCreateQuizSelectDto } from '#/quiz/dto/create-quiz-selection.dto';
import { RequestUpdateQuizSelectDto } from '#/quiz/dto/update-quiz-selection.dto';
import { QuizSelection } from '#databases/entities/quizSelection.entity';
import { Word } from '#databases/entities/word.entity';

@Injectable()
export class QuizSelectionRepository {
	constructor(
		@InjectRepository(QuizSelection)
		private readonly quizSelectionRepository: Repository<QuizSelection>,
	) {}

	async create(word: Word, createQuizSelectDto: RequestCreateQuizSelectDto) {
		const quizSelection = this.quizSelectionRepository.create({
			word,
			...createQuizSelectDto,
		});
		return this.quizSelectionRepository.save(quizSelection);
	}

	async update(
		quizSelectionId: string,
		updateFieldDto: RequestUpdateQuizSelectDto,
	): Promise<QuizSelection> {
		const updateResult = await this.quizSelectionRepository.update(
			quizSelectionId,
			updateFieldDto,
		);
		return updateResult.raw;
	}

	findById(quizSelectionId: string) {
		return this.quizSelectionRepository
			.createQueryBuilder('quizSelection')
			.where('quizSelection.id = :quizSelectionId', { quizSelectionId })
			.getOne();
	}

	findByWordId(wordId: string) {
		return this.quizSelectionRepository
			.createQueryBuilder('quizSelection')
			.leftJoinAndSelect(
				'quizSelection.word',
				'word',
				'word.id = :wordId',
				{ wordId },
			)
			.select([
				'quizSelection.id',
				'quizSelection.correct',
				'quizSelection.incorrectList',
				'word.name',
			])
			.getOne();
	}

	findRandomQuizSelection() {
		return this.quizSelectionRepository
			.createQueryBuilder('quizSelection')
			.select(['quizSelection.correct', 'quizSelection.incorrectList'])
			.leftJoin('quizSelection.word', 'word')
			.addSelect(['word.id', 'word.name', 'word.diacritic'])
			.orderBy('RANDOM()')
			.limit(10)
			.getRawMany();
	}
}
