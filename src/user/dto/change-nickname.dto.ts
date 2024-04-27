import { IsNotEmpty, IsUUID } from "class-validator";

export class RequestChangeNicknameDto {
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    nickname: string;
}