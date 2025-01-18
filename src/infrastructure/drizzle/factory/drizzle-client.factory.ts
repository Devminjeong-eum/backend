import type { ConfigService } from '@nestjs/config';

import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import type { DrizzleModuleForRootOption } from '../interface/drizzle-module-option.interface';
import * as schema from '../schema';

export const createDrizzleClient = (
	configService: ConfigService,
	option?: DrizzleModuleForRootOption,
): NodePgDatabase<typeof schema> => {
	const isDevelopment =
		configService.getOrThrow('NODE_ENV') === 'development';

	const pool = new Pool({
		user: configService.getOrThrow('DB_USERNAME'),
		host: configService.getOrThrow('DB_HOST'),
		database: configService.getOrThrow('DB_DATABASE'),
		password: configService.getOrThrow('DB_PASSWORD'),
		port: parseInt(configService.getOrThrow<'number'>('DB_PORT')),
		// TODO : 인증서를 적용하여 SSL 연결이 가능하도록 수정 필요
		ssl: {
			rejectUnauthorized: false,
		},
		...option?.pool,
	});

	return drizzle({
		...option?.drizzle,
		client: pool,
		logger: isDevelopment,
		schema: { ...schema },
	});
};
