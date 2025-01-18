import { BadRequestException, Injectable } from '@nestjs/common';

import { LikeRepository } from '#/infrastructure/database/repositories/like.repository';
import { WordRepository } from '#/infrastructure/database/repositories/word.repository';

@Injectable()
export class LikeService {
	constructor(
		private readonly likeRepository: LikeRepository,
		private readonly wordRepository: WordRepository,
	) {}

	async applyUserLike({
		wordId,
		userId,
	}: {
		wordId: string;
		userId: string;
	}) {
		const word = await this.wordRepository.findById(wordId);

		if (!word) {
			throw new BadRequestException('존재하지 않는 단어입니다.');
		}

		const isAlreadyApplied = await this.likeRepository.findByUserAndWord({
			wordId,
			userId: userId,
		});

		if (isAlreadyApplied) {
			throw new BadRequestException(
				'이미 해당 단어에 좋아요를 적용한 상태입니다.',
			);
		}

		await this.likeRepository.restore({
			wordId,
			userId,
		});

		const creationResult = await this.likeRepository.create({
			wordId,
			userId,
		});

		return !!creationResult;
	}

	async revertUserLike({
		wordId,
		userId,
	}: {
		wordId: string;
		userId: string;
	}) {
		const word = await this.wordRepository.findById(wordId);

		if (!word) {
			throw new BadRequestException('존재하지 않는 단어입니다.');
		}

		const revertResult = await this.likeRepository.softDelete({
			wordId,
			userId,
		});

		if (!revertResult.rowCount) {
			throw new BadRequestException(
				'해당 단어에 아직 좋아요를 누르지 않은 상태입니다.',
			);
		}

		return true;
	}
}
