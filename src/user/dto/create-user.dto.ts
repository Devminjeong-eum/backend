import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestCreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    profileImage: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    socialType: string;
}