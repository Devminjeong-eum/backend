import { Controller, Get } from '@nestjs/common';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
	constructor() {}

	@ApiOperation({
		summary: '서버 Ping 조회용',
	})
	@ApiResponse({
		status: 200,
		description: '요청 성공시',
	})
	@Get()
	getHello(): string {
		return 'Pong!'
	}
}
