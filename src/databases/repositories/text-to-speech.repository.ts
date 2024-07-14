import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TextToSpeech } from '#databases/entities/text-to-speech.entity';
import { Word } from '#databases/entities/word.entity';

@Injectable()
export class TextToSpeechRepository {
	constructor(
		@InjectRepository(TextToSpeech)
		private readonly textToSpeechRepository: Repository<TextToSpeech>,
	) {}

	async create({
		word,
		text,
		audioFileUri,
	}: {
		word: Word;
		text: string;
		audioFileUri: string;
	}) {
		const quizResult = this.textToSpeechRepository.create({
			word,
			text,
			audioFileUri,
		});

		return this.textToSpeechRepository.save(quizResult);
	}

	async findByWordId(wordId: string) {
		return this.textToSpeechRepository
			.createQueryBuilder('textToSpeech')
			.leftJoinAndSelect(
				'textToSpeech.word',
				'word',
				'word.id = :wordId',
				{ wordId },
			)
			.select(['textToSpeech.audioUri', 'word.name', 'word.id'])
			.getOne();
	}
}
