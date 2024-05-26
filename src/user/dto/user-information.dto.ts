import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserInformationDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	profileImage: string;

	@ApiProperty()
	socialType: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
