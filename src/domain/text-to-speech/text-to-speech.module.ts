import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { PollyClient } from '@aws-sdk/client-polly';
import type { S3Client } from '@aws-sdk/client-s3';

import { AuthModule } from '#/domain/auth/auth.module';
import { TextToSpeechRepository } from '#/infrastructure/drizzle/repository/text-to-speech.repository';
import { WordRepository } from '#/infrastructure/drizzle/repository/word.repository';


import { AWS_POLLY_CLIENT, AWS_S3_BUCKET } from './constant';
import { createAwsPollyClientFactory } from './factory/polly-client-factory';
import { createAwsS3BucketFactory } from './factory/s3-bucket-factory';
import { TextToSpeechService } from './service/text-to-speech.service';
import { TextToSpeechController } from './text-to-speech.controller';
import { UserRepository } from '#/infrastructure/drizzle/repository/user.repository';

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
	imports: [AuthModule],
	controllers: [TextToSpeechController],
	providers: [
		// Service
		TextToSpeechService,
		// Repository
		TextToSpeechRepository,
		WordRepository,
		UserRepository,
		// AWS Provider
		AwsPollyProvider,
		AwsS3BucketProvider,
	],
	exports: [TextToSpeechService, TextToSpeechRepository],
})
export class TextToSpeechModule {}
