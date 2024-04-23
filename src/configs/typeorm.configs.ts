import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	TypeOrmModule,
	TypeOrmModuleOptions,
	TypeOrmOptionsFactory,
} from '@nestjs/typeorm';

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
			synchronize: this.isDev,
			logging: this.isDev,
			entities: [__dirname, '/../**/*.entity.ts'],
			autoLoadEntities: true,
		};
	}
}

export const GlobalTypeOrmModule = TypeOrmModule.forRootAsync({
	useClass: TypeOrmConfig,
});
