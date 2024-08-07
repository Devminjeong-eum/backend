import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class RequestUpdateWordTextToSpeechDto {
	@IsUUID()
	@Expose()
	@ApiProperty()
	wordId: string;

	@IsString()
	@Expose()
	@ApiProperty()
	text: string;
}

export class ResponseUpdateWordTextToSpeechDto {
	@IsUUID()
	@ApiProperty()
	uri: string;

	@IsString()
	@ApiProperty()
	wordName: string;
}
