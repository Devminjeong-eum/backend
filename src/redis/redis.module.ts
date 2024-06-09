import {DynamicModule, Global, Module} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

const redisConnectionFactory = async (configService: ConfigService) => {
    const REDIS_PORT = configService.get<string>('REDIS_PORT');
    const client = createClient({
        url: `redis://localhost:${REDIS_PORT}`
    })
    await client.connect();
    console.log(client);
    return client;
}

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
                    useFactory: redisConnectionFactory
                }
            ],
            exports: [REDIS_CLIENT]
        }
    }
}