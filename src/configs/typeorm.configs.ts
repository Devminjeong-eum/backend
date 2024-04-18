import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'postgres',
			url: '',
			host: 'localhost',
			port: 5432,
			username: '',
			password: '',
			database: '',
			synchronize: true,
			dropSchema: false,
			logging: true,
			entities: [__dirname, '/../**/*.entity.ts'],
		};
	}
}
