import { ConfigService } from '@nestjs/config';

import { S3Client } from '@aws-sdk/client-s3';

import { RequireEnvironmentVariableException } from '#/common/exceptions/RequireEnvironmentVariableException';

const REGION = 'ap-northeast-2';

export const createAwsS3BucketFactory = (configService: ConfigService) => {
	const iamAccessKey = configService.get<string>('AWS_IAM_ACCESS_KEY');
	const iamSecretAccessKey = configService.get<string>(
		'AWS_IAM_SECRET_ACCESS_KEY',
	);

	if (!iamAccessKey || !iamSecretAccessKey) {
		const notExistsVariables = [
			iamAccessKey ? undefined : 'AWS_IAM_ACCESS_KEY',
			iamSecretAccessKey ? undefined : 'AWS_IAM_SECRET_ACCESS_KEY',
		]
			.filter(Boolean)
			.join(' ,');
		throw new RequireEnvironmentVariableException(notExistsVariables);
	}

	const s3Client = new S3Client({
		region: REGION,
		credentials: {
			accessKeyId: iamAccessKey,
			secretAccessKey: iamSecretAccessKey,
		},
	});
	return s3Client;
};
