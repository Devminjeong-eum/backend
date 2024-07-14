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

import { TextToSpeechRepository } from '#/databases/repositories/text-to-speech.repository';
import { WordRepository } from '#/databases/repositories/word.repository';

import { InjectPollyClient } from './decorators/inject-polly-client.decorator';
import { InjectS3Bucket } from './decorators/inject-s3-bucket.decorator';

@Injectable()
export class TextToSpeechService {
	private readonly outputS3BucketName: string;

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
			Text: text,
			VoiceId: 'Joanna',
		};
	}

	async generateTextToSpeechAudio(word: string) {
		const speechSyntesisTaskCommandInstance =
			new StartSpeechSynthesisTaskCommand(
				this.createSpeechSyntesisTaskCommandParams(word),
			);

		const response = await this.pollyClient.send(
			speechSyntesisTaskCommandInstance,
		);

		if (!response.SynthesisTask) {
			throw new InternalServerErrorException(
				`${word} 단어에 대한 TTS 가 정상적으로 생성되지 않았습니다.`,
			);
		}

		return response.SynthesisTask.OutputUri;
	}

	async generateAudioPresignedUrl(wordId: string) {
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

		const putCommand = new GetObjectCommand({
			Bucket: this.outputS3BucketName,
			Key: textToSpeech.audioFileUri,
		});
		const presignedUrl = await getSignedUrl(this.s3Client, putCommand, {
			expiresIn: 5,
		});
		return presignedUrl;
	}
}
