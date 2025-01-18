import { IsArray, IsString, Length } from 'class-validator';

export class RequestCreateQuizSelectDto {
	@IsString()
	correct: string;

	@IsArray()
	@Length(3)
	incorrectList: string[];
}
