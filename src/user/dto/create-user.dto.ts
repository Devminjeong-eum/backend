import { IsNotEmpty } from "class-validator";

export class RequestCreateUserDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    profileImage: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    socialType: string;
}