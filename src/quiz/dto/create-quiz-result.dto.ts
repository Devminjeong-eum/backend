import { Expose, Transform } from 'class-transformer';
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

export class ResponseCreateQuizResultDto {
    @IsUUID()
    @Transform(({ obj }) => obj.id)
    @Expose()
	userId: string;
    
    @IsArray()
    @IsUUID()
    @MaxLength(10)
    @Expose()
    correctWordIds: string[];

    @IsArray()
    @IsUUID()
    @MaxLength(10)
    @Expose()
    incorrectWordIds: string[]; 
}