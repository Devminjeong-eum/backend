import { IsArray, IsString, Length } from 'class-validator';

export class RequestUpdateQuizSelectDto {
	@IsString()
	correct: string;

	@IsArray()
	@Length(3)
	incorrectList: string[];
}
