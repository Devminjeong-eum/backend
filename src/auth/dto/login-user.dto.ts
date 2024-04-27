import { IsNotEmpty } from 'class-validator';

export class RequestLoginUserDto {
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	nickname: string;

	@IsNotEmpty()
	profileImage: string;
}
