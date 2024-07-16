import { Inject } from '@nestjs/common';

import { AWS_S3_BUCKET } from '../constant';

export const InjectS3Bucket = () => {
	return Inject(AWS_S3_BUCKET);
};
