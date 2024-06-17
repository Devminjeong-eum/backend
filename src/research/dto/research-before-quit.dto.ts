import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RequestResearchBeforeQuitDto {
	@IsString()
	userId: string;

    @IsString()
	userName: string;

    @IsString()
    @IsNotEmpty()
	@ApiProperty({
		description: '첫번째 객관식 질문에 대해 유저가 선택한 답변',
	})
    question1: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
		description: '두번째 객관식 질문에 대해 유저가 작성한 답변',
	})
    question2: string;
}