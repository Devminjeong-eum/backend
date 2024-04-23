import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
	constructor(private readonly configService: ConfigService) {}
	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'postgres',
			host: this.configService.get('DB_HOST'),
			port: this.configService.get('DB_PORT'),
			username: this.configService.get('DB_USERNAME'),
			password: this.configService.get('DB_PASSWORD'),
			database: this.configService.get('DB_DATABASE'),
			synchronize: true,
			dropSchema: false,
			logging: true,
			entities: [__dirname, '/../**/*.entity.ts'],
		};
	}
}

export const GlobalTypeOrmModule = TypeOrmModule.forRootAsync({
	useClass: TypeOrmConfig,
})