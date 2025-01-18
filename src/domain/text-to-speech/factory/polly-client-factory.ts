import type { ConfigService } from '@nestjs/config';

import { PollyClient } from '@aws-sdk/client-polly';

const REGION = 'ap-northeast-2';

export const createAwsPollyClientFactory = (configService: ConfigService) => {
	const iamAccessKey = configService.getOrThrow<string>('AWS_IAM_ACCESS_KEY');
	const iamSecretAccessKey = configService.getOrThrow<string>(
		'AWS_IAM_SECRET_ACCESS_KEY',
	);

	const pollyClient = new PollyClient({
		region: REGION,
		credentials: {
			accessKeyId: iamAccessKey,
			secretAccessKey: iamSecretAccessKey,
		},
	});
	return pollyClient;
};
