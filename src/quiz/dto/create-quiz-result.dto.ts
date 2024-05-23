import {
	IsArray,
	IsUUID,
    MaxLength,
} from 'class-validator';

export class RequestCreateQuizResultDto {
	@IsUUID()
	userId: string;

    @IsArray()
    @IsUUID()
    @MaxLength(10)
    correctWordIds: string[];

    @IsArray()
    @IsUUID()
    @MaxLength(10)
    incorrectWordIds: string[]; 
}