import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';
import { DataSource } from 'typeorm';

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
	synchronize: false,
	entities: ['src/**/*.entity.ts'],
	migrations: ['src/databases/migrations/*.ts'],
	migrationsTableName: 'db_migrations',
});
