import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Test')
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
		return 'Pong!';
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Get('/favicon.ico')
	getPreventFavicon() {
		return true;
	}
}
