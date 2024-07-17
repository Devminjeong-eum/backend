import { Module, Provider, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PollyClient } from '@aws-sdk/client-polly';
import { S3Client } from '@aws-sdk/client-s3';

import { AuthModule } from '#/auth/auth.module';
import { TextToSpeech } from '#/databases/entities/text-to-speech.entity';
import { TextToSpeechRepository } from '#/databases/repositories/text-to-speech.repository';
import { WordModule } from '#/word/word.module';

import { AWS_POLLY_CLIENT, AWS_S3_BUCKET } from './constant';
import { createAwsPollyClientFactory } from './factory/polly-client-factory';
import { createAwsS3BucketFactory } from './factory/s3-bucket-factory';
import { TextToSpeechController } from './text-to-speech.controller';
import { TextToSpeechService } from './text-to-speech.service';

const AwsPollyProvider: Provider<PollyClient> = {
	provide: AWS_POLLY_CLIENT,
	useFactory: createAwsPollyClientFactory,
	inject: [ConfigService],
};

const AwsS3BucketProvider: Provider<S3Client> = {
	provide: AWS_S3_BUCKET,
	useFactory: createAwsS3BucketFactory,
	inject: [ConfigService],
};

@Module({
	imports: [
		TypeOrmModule.forFeature([TextToSpeech]),
		AuthModule,
		forwardRef(() => WordModule),
	],
	controllers: [TextToSpeechController],
	providers: [
		// Service
		TextToSpeechService,
		// Repository
		TextToSpeechRepository,
		// AWS Provider
		AwsPollyProvider,
		AwsS3BucketProvider,
	],
	exports: [TextToSpeechService, TextToSpeechRepository],
})
export class TextToSpeechModule {}
