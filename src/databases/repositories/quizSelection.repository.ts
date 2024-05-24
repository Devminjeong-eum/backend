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
}
