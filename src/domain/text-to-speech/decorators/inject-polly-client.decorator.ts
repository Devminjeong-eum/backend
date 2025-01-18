import { Inject } from '@nestjs/common';

import { AWS_POLLY_CLIENT } from '../constant';

export const InjectPollyClient = () => {
	return Inject(AWS_POLLY_CLIENT);
};
