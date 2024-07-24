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
		const textToSpeech = this.textToSpeechRepository.create({
			word,
			text,
			audioFileUri,
		});

		return this.textToSpeechRepository.save(textToSpeech);
	}

	async update({
		wordId,
		text,
		audioFileUri,
	}: {
		wordId: string;
		text: string;
		audioFileUri: string;
	}) {
		const updateResult = await this.textToSpeechRepository
			.createQueryBuilder('textToSpeech')
			.update(TextToSpeech)
			.set({
				audioFileUri,
				text,
			})
			.where('textToSpeech.wordId = :wordId', { wordId })
			.execute();

		return updateResult;
	}

	async findByWordId(wordId: string) {
		return this.textToSpeechRepository
			.createQueryBuilder('textToSpeech')
			.leftJoin('textToSpeech.word', 'word')
			.where('word.id = :wordId', { wordId })
			.select(['textToSpeech.audioFileUri', 'word.name', 'word.id'])
			.getOne();
	}
}
