import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
	PollyClient,
	StartSpeechSynthesisTaskCommand,
	type StartSpeechSynthesisTaskCommandInput,
} from '@aws-sdk/client-polly';

import { InjectPollyClient } from './decorators/inject-polly-client.decorator';

@Injectable()
export class TextToSpeechService {
	private readonly outputS3BucketName: string;

	constructor(
		@InjectPollyClient() private readonly pollyClient: PollyClient,
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
}
