import type { Type } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T extends Type<any>> {
	@ApiProperty({
		enum: HttpStatus,
	})
	code: number;

	@ApiProperty({
		type: 'generic',
	})
	data: T;
}
