import { Injectable } from '@nestjs/common';

import { PaginationOptionDto } from '#/common/dto/pagination.dto';
import { WordRepository } from '#databases/repositories/word.repository';

@Injectable()
export class WordService {
	constructor(private readonly wordRepository: WordRepository) {}

	async getWordList(paginationOptionDto: PaginationOptionDto) {
		return await this.wordRepository.findWithList(paginationOptionDto);
	}
}
