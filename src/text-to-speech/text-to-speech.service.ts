import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
	PollyClient,
	StartSpeechSynthesisTaskCommand,
	type StartSpeechSynthesisTaskCommandInput,
} from '@aws-sdk/client-polly';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { plainToInstance } from 'class-transformer';

import { TextToSpeechRepository } from '#/databases/repositories/text-to-speech.repository';
import { WordRepository } from '#/databases/repositories/word.repository';

import { InjectPollyClient } from './decorators/inject-polly-client.decorator';
import { InjectS3Bucket } from './decorators/inject-s3-bucket.decorator';
import {
	RequestCreateWordTextToSpeechDto,
	ResponseCreateWordTextToSpeechDto,
} from './dto/create-tts-text.dto';
import {
	RequestUpdateWordTextToSpeechDto,
	ResponseUpdateWordTextToSpeechDto,
} from './dto/update-tts-text.dto';

@Injectable()
export class TextToSpeechService {
	private readonly outputS3BucketName: string;
	private readonly TEST_PRESIGNED_EXPIRED = 20;

	constructor(
		@InjectPollyClient() private readonly pollyClient: PollyClient,
		@InjectS3Bucket() private readonly s3Client: S3Client,
		private readonly wordRepository: WordRepository,
		private readonly textToSpeechRepository: TextToSpeechRepository,
		private readonly configService: ConfigService,
	) {
		const s3BucketName =
			this.configService.get<string>('AWS_S3_BUCKET_NAME');

		if (!s3BucketName)
			throw new InternalServerErrorException(
				'AWS_S3_BUCKET_NAME 환경 변수가 존재하지 않습니다.',
			);
		this.outputS3BucketName = s3BucketName;
	}

	private createSpeechSyntesisTaskCommandParams(
		text: string,
	): StartSpeechSynthesisTaskCommandInput {
		return {
			OutputFormat: 'mp3',
			OutputS3BucketName: this.outputS3BucketName,
			OutputS3KeyPrefix: 'tts',
			Text: text,
			VoiceId: 'Joanna',
		};
	}

	async generateTextToSpeechAudio(word: string) {
		const speechSyntesisTaskCommandInstance =
			new StartSpeechSynthesisTaskCommand(
				this.createSpeechSyntesisTaskCommandParams(word),
			);

		try {
			const response = await this.pollyClient.send(
				speechSyntesisTaskCommandInstance,
			);
			const audioFileUri = response.SynthesisTask?.OutputUri;

			if (!audioFileUri) {
				throw new InternalServerErrorException(
					response.$metadata,
					`TTS 가 정상적으로 생성되지 않았습니다.`,
				);
			}
			return audioFileUri;
		} catch (error) {
			throw new InternalServerErrorException(
				error,
				`AWS Polly 를 실행하는 과정에서 문제가 발생했습니다.`,
			);
		}
	}

	async generateAudioPresignedUrl(wordId: string, delay: number = 5) {
		const word = await this.wordRepository.findById(wordId);

		if (!word)
			throw new BadRequestException(
				'해당 wordId 를 가진 단어는 존재하지 않습니다.',
			);

		const textToSpeech =
			await this.textToSpeechRepository.findByWordId(wordId);

		if (!textToSpeech)
			throw new BadRequestException(
				'해당 단어는 아직 TTS 가 생성되지 않았습니다.',
			);

		const getCommand = new GetObjectCommand({
			Bucket: this.outputS3BucketName,
			Key: textToSpeech.audioFileUri,
		});
		const presignedUrl = await getSignedUrl(this.s3Client, getCommand, {
			expiresIn: delay,
		});
		return presignedUrl;
	}

	async createWordTextToSpeech(
		createWordTextToSpeechDto: RequestCreateWordTextToSpeechDto,
	) {
		const { wordId, text } = createWordTextToSpeechDto;
		const word = await this.wordRepository.findById(wordId);

		if (!word)
			throw new BadRequestException(
				'해당 wordId 를 가진 단어는 존재하지 않습니다.',
			);

		const textToSpeech =
			await this.textToSpeechRepository.findByWordId(wordId);

		if (textToSpeech) {
			throw new BadRequestException(
				'이미 해당 단어를 기반으로 생성된 TTS 가 존재합니다.',
			);
		}

		const audioFileUri = await this.generateTextToSpeechAudio(text);
		await this.textToSpeechRepository.create({ word, text, audioFileUri });

		const presignedUrl = await this.generateAudioPresignedUrl(
			wordId,
			this.TEST_PRESIGNED_EXPIRED,
		);

		const responseCreateWordTextToSpeechDto = plainToInstance(
			ResponseCreateWordTextToSpeechDto,
			{
				uri: presignedUrl,
				wordName: word.name,
			},
		);

		return responseCreateWordTextToSpeechDto;
	}

	async updateWordTextToSpeech(
		updateWordTextToSpeechDto: RequestUpdateWordTextToSpeechDto,
	) {
		const { wordId, text } = updateWordTextToSpeechDto;
		const word = await this.wordRepository.findById(wordId);

		if (!word)
			throw new BadRequestException(
				'해당 wordId 를 가진 단어는 존재하지 않습니다.',
			);

		const textToSpeech =
			await this.textToSpeechRepository.findByWordId(wordId);

		if (textToSpeech?.text === text) {
			throw new BadRequestException(
				'기존 TTS 에 설정된 Text 와 동일합니다.',
			);
		}

		const audioFileUri = await this.generateTextToSpeechAudio(text);

		await this.textToSpeechRepository.update({
			wordId,
			text,
			audioFileUri,
		});

		const presignedUrl = await this.generateAudioPresignedUrl(
			wordId,
			this.TEST_PRESIGNED_EXPIRED,
		);

		const responseUpdateWordTextToSpeechDto = plainToInstance(
			ResponseUpdateWordTextToSpeechDto,
			{
				uri: presignedUrl,
				wordName: word.name,
			},
		);

		return responseUpdateWordTextToSpeechDto;
	}
}
