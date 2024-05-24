import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RequestCreateQuizSelectDto } from '#/quiz/dto/create-quiz-selection.dto';
import { QuizSelection } from '#databases/entities/quizSelection.entity';

@Injectable()
export class QuizSelectionRepository {
	constructor(
		@InjectRepository(QuizSelection)
		private readonly quizSelectionRepository: Repository<QuizSelection>,
	) {}

	async create(createQuizSelectDto: RequestCreateQuizSelectDto) {
		const quizSelection =
			this.quizSelectionRepository.create(createQuizSelectDto);

		return this.quizSelectionRepository.save(quizSelection);
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
			.leftJoinAndSelect('quizSelection.word', 'word')
			.where('word.id = :wordId', { wordId })
			.select([
				'quizSelection.id',
				'quizSelection.correct',
				'quizSelection.incorrectList',
				'word.id',
			])
			.getOne();
	}
}
