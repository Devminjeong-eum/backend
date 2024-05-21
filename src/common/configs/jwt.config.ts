import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
	constructor(private readonly configService: ConfigService) {}
	createJwtOptions(): JwtModuleOptions {
		const secret = this.configService.get<string>('JWT_SECRET_KEY');
		if (!secret) {
			throw new InternalServerErrorException(
				'JWT_SECRET_KEY 가 설정되어 있지 않습니다.',
			);
		}

		console.log(secret);

		return {
			secret,
			signOptions: {
				algorithm: 'HS256',
			},
		};
	}
}
