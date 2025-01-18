import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { Migration1721144200051 } from './1721144200051-Migration';

config({
	path: `src/config/.env.development`,
});
const configService = new ConfigService();

export default new DataSource({
	type: 'postgres',
	host: configService.getOrThrow('DB_HOST'),
	port: configService.getOrThrow('DB_PORT'),
	username: configService.getOrThrow('DB_USERNAME'),
	password: configService.getOrThrow('DB_PASSWORD'),
	database: configService.getOrThrow('DB_DATABASE'),
	entities: ['src/databases/entities/*.entity.ts'],
	synchronize: false,
	logging: true,
	migrations: [Migration1721144200051],
	migrationsTableName: 'db_migrations',
	// TODO : 인증서를 적용하여 SSL 연결이 가능하도록 수정 필요
	ssl: {
		rejectUnauthorized: false,
	},
});
