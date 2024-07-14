import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AWS_POLLY_CLIENT } from './constant';
import { createAwsPollyClientFactory } from './factory/polly-client-factory';
import { TextToSpeechService } from './text-to-speech.service';
import { PollyClient } from '@aws-sdk/client-polly';

const AwsPollyProvider: Provider<PollyClient> = {
	provide: AWS_POLLY_CLIENT,
	useFactory: createAwsPollyClientFactory,
	inject: [ConfigService],
};

@Module({
	providers: [TextToSpeechService, AwsPollyProvider],
})
export class TextToSpeechModule {}
