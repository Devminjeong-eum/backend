import { ConfigService } from '@nestjs/config';

import { PollyClient } from '@aws-sdk/client-polly';

import { RequireEnvironmentVariableException } from '#/common/exceptions/RequireEnvironmentVariableException';

const REGION = 'ap-northeast-2';

export const createAwsPollyClientFactory = (configService: ConfigService) => {
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

	const pollyClient = new PollyClient({ region: REGION });
	return pollyClient;
};
