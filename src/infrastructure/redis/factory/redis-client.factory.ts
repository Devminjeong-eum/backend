import type { ConfigService } from '@nestjs/config';

import { createClient } from 'redis';

import type { RedisClient } from '../interface/redis-client.interface';

export const redisConnectionFactory = async (
	configService: ConfigService,
): Promise<RedisClient> => {
	const REDIS_HOST = configService.getOrThrow<string>('REDIS_HOST');
	const REDIS_PORT = configService.getOrThrow<string>('REDIS_PORT');
	return await createClient({
		url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
	}).connect();
};
