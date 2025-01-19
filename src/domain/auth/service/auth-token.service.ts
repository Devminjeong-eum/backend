import {
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import type { AuthTokenPayload } from "../interface/jwt-auth.interface";
import dayjs from "dayjs";

@Injectable()
export class AuthTokenService {
	constructor(
		private readonly jwtService: JwtService,
	) {}

	getAuthenticateToken({ userId }: { userId: string }) {
		const payload = { id: userId };
		const accessToken = this.jwtService.sign(payload, { expiresIn: "5m" });
		const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

		return { accessToken, refreshToken };
	}

	reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
		const payload = this.jwtService.verify<AuthTokenPayload>(
			refreshToken,
		);

		if (!payload) {
			throw new UnauthorizedException(
				"유효하지 않은 계정 정보입니다.",
			);
		}

		if (dayjs().isAfter(payload.exp * 1000)) {
			throw new UnauthorizedException('이미 만료된 리프레시 토큰입니다.');
		}

		return this.jwtService.sign(payload, { expiresIn: "5m" })
	}
}
