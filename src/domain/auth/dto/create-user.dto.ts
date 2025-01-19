import { IsNotEmpty } from 'class-validator';

export class RequestCreateUserDto {
	@IsNotEmpty()
	socialPlatformId: string;

	@IsNotEmpty()
	profileImage: string;

	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	socialType: string;
}
