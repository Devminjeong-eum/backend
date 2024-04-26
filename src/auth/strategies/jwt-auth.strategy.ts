import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CreateTokenDto } from '../dto/create-token.dto';

import { User } from '#/databases/entities/user.entity';
import { UserRepository } from '#/databases/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.accessToken;
				},
			]),
			secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
		});
	}

	async validate(
		{ id }: CreateTokenDto,
		done: (error: Error | null, user: User | null) => void,
	) {
		const user = await this.userRepository.findById(id);
		if (!user) {
			done(
				new UnauthorizedException('유효하지 않은 유저 계정입니다.'),
				null,
			);
		}
		done(null, user);
	}
}
