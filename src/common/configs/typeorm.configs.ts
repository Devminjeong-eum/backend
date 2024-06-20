import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
	constructor(private readonly configService: ConfigService) {}

	private isDev = this.configService.get('NODE_ENV') === 'development';

	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'postgres',
			host: this.configService.get('DB_HOST'),
			port: this.configService.get('DB_PORT'),
			username: this.configService.get('DB_USERNAME'),
			password: this.configService.get('DB_PASSWORD'),
			database: this.configService.get('DB_DATABASE'),
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
