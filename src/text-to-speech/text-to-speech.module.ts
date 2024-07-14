import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PollyClient } from '@aws-sdk/client-polly';
import { S3Client } from '@aws-sdk/client-s3';

import { AWS_POLLY_CLIENT, AWS_S3_BUCKET } from './constant';
import { createAwsPollyClientFactory } from './factory/polly-client-factory';
import { createAwsS3BucketFactory } from './factory/s3-bucket-factory';
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
	providers: [TextToSpeechService, AwsPollyProvider, AwsS3BucketProvider],
	exports: [TextToSpeechService],
})
export class TextToSpeechModule {}
