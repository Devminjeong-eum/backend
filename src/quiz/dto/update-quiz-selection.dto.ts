import { IsArray, IsString, IsUUID, Length } from 'class-validator';

export class RequestUpdateQuizSelectDto {
	@IsUUID()
	wordId: string;

	@IsString()
	correct: string;

	@IsArray()
	@Length(3)
	incorrectList: string[];
}
