import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';

import { User } from '#databases/entities/user.entity';
import { LikeRepository } from '#databases/repositories/like.repository';
import { WordRepository } from '#databases/repositories/word.repository';

import { RequestCreateLikeDto } from './dto/create-like.dto';
import { RequestRevertLikeDto } from './dto/revert-like.dto';

@Injectable()
export class LikeService {
	constructor(
		private readonly likeRepository: LikeRepository,
		private readonly wordRepository: WordRepository,
	) {}

	async applyUserLike(createLikeDto: RequestCreateLikeDto, user: User) {
		const { wordId } = createLikeDto;
		const word = await this.wordRepository.findById(wordId);

		if (!word) {
			throw new BadRequestException('존재하지 않는 단어입니다.');
		}

		const restoreResult = await this.likeRepository.restore(word, user);

		if (!restoreResult.affected) {
			throw new InternalServerErrorException(
				'좋아요가 정상적으로 적용되지 않았습니다.',
			);
		}

		return !!restoreResult.affected;
	}

	async revertUserLike(revertLikeDto: RequestRevertLikeDto, user: User) {
		const { wordId } = revertLikeDto;
		const word = await this.wordRepository.findById(wordId);

		if (!word) {
			throw new BadRequestException('존재하지 않는 단어입니다.');
		}

		const revertResult = await this.likeRepository.softDelete(word, user);

		if (!revertResult.affected) {
			throw new InternalServerErrorException(
				'좋아요가 정상적으로 취소되지 않았습니다.',
			);
		}

		return !!revertResult.affected;
	}
}
