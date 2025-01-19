import type { DynamicModule } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { REDIS_CLIENT } from './constant/redis-client.constant';
import { redisConnectionFactory } from './factory/redis-client.factory';

@Global()
@Module({})
export class RedisModule {
	static forRootAsync(): DynamicModule {
		return {
			module: RedisModule,
			imports: [ConfigModule],
			providers: [
				{
					provide: REDIS_CLIENT,
					inject: [ConfigService],
					useFactory: redisConnectionFactory,
				},
			],
			exports: [REDIS_CLIENT],
		};
	}
}
