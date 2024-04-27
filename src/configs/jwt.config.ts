import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
	constructor(private readonly configService: ConfigService) {}
	createJwtOptions(): JwtModuleOptions {
		return {
			secret: this.configService.get<string>('JWT_SECRET_KEY'),
			signOptions: {
				algorithm: 'HS256',
			},
		}
	}
}

export const JsonWebTokenModule = JwtModule.registerAsync({
	useClass: JwtConfig,
});
