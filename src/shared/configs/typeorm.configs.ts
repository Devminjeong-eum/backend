import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
	private isDev: boolean;

	constructor(private readonly configService: ConfigService) {
		this.isDev = this.configService.getOrThrow('NODE_ENV') === 'development';
	}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'postgres',
			host: this.configService.getOrThrow('DB_HOST'),
			port: this.configService.getOrThrow('DB_PORT'),
			username: this.configService.getOrThrow('DB_USERNAME'),
			password: this.configService.getOrThrow('DB_PASSWORD'),
			database: this.configService.getOrThrow('DB_DATABASE'),
			synchronize: false,
			logging: this.isDev,
			entities: ['../databases/entities/*.entity.ts'],
			autoLoadEntities: true,
			retryAttempts: this.isDev ? 0 : 3,
			retryDelay: 3000,
			// TODO : 인증서를 적용하여 SSL 연결이 가능하도록 수정 필요
			ssl: {
				rejectUnauthorized: false,
			},
		};
	}
}
