import { BadRequestException, Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { QuizSelectionRepository } from '#/infrastructure/database/repositories/quiz-selection.repository';

import { ResponseQuizSelectionDto } from '../dto/quiz-selection.dto';

@Injectable()
export class QuizSelectionService {
	constructor(
		private readonly quizSelectionRepository: QuizSelectionRepository,
	) {}
	async findQuizSelectionByWordId(wordId: string) {
		const quizSelection =
			await this.quizSelectionRepository.findByWordId(wordId);

		if (!quizSelection) {
			throw new BadRequestException(
				'해당 단어 ID 를 가진 퀴즈 선택 데이터가 없습니다.',
			);
		}

		return quizSelection;
	}

	async findQuizSelectionRandom() {
		const quizSelectionList =
			await this.quizSelectionRepository.findRandomQuizSelection();

		const responseQuizSelectionDto = plainToInstance(
			ResponseQuizSelectionDto,
			quizSelectionList,
			{ excludeExtraneousValues: true },
		);

		return responseQuizSelectionDto;
	}
}
