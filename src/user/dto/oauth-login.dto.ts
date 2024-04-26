import { IsNotEmpty } from "class-validator";

export class RequestOAuthLoginDto {
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    profileImage!: string;

    @IsNotEmpty()
    nickname!: string;
}