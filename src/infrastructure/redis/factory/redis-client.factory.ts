import type { ConfigService } from '@nestjs/config';

import { createClient } from 'redis';

export const redisConnectionFactory = async (
	configService: ConfigService,
): Promise<ReturnType<typeof createClient>> => {
	const REDIS_HOST = configService.getOrThrow<string>('REDIS_HOST');
	const REDIS_PORT = configService.getOrThrow<string>('REDIS_PORT');
	return await createClient({
		url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
	}).connect();
};
