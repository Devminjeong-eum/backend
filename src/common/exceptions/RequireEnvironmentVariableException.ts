import { InternalServerErrorException } from '@nestjs/common';

export class RequireEnvironmentVariableException extends InternalServerErrorException {
	constructor(public requiredVariable: string) {
		super(`${requiredVariable} 변수가 .env 파일에 존재하지 않습니다.`);
	}
}
