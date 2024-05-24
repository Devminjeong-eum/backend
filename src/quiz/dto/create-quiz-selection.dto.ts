import { IsArray, IsString, IsUUID, Length } from 'class-validator';

export class RequestCreateQuizSelectDto {
	@IsUUID()
	wordId: string;

	@IsString()
	correct: string;

	@IsArray()
	@Length(3)
	incorrectList: string[];
}
