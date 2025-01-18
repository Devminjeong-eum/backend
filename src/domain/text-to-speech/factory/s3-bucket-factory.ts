import type { ConfigService } from '@nestjs/config';

import { S3Client } from '@aws-sdk/client-s3';

const REGION = 'ap-northeast-2';

export const createAwsS3BucketFactory = (configService: ConfigService) => {
	const iamAccessKey = configService.getOrThrow<string>('AWS_IAM_ACCESS_KEY');
	const iamSecretAccessKey = configService.getOrThrow<string>(
		'AWS_IAM_SECRET_ACCESS_KEY',
	);

	const s3Client = new S3Client({
		region: REGION,
		credentials: {
			accessKeyId: iamAccessKey,
			secretAccessKey: iamSecretAccessKey,
		},
	});
	return s3Client;
};
