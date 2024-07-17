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
	host: configService.get('DB_HOST'),
	port: configService.get('DB_PORT'),
	username: configService.get('DB_USERNAME'),
	password: configService.get('DB_PASSWORD'),
	database: configService.get('DB_DATABASE'),
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
