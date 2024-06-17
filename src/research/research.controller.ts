import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { AuthenticationGuard } from '#/auth/guard/auth.guard';
import { ApiDocs } from '#/common/decorators/swagger.decorator';
import { User } from '#databases/entities/user.entity';

import { RequestResearchBeforeQuitDto } from './dto/research-before-quit.dto';
import { ResearchService } from './research.service';

@ApiTags('Research')
@Controller('research')
export class ResearchController {
	constructor(private readonly researchService: ResearchService) {}

	@ApiDocs({
		summary: '탈퇴 전 진행하는 서비스 만족도 설문을 제출합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: Boolean,
		},
	})
	@UseGuards(AuthenticationGuard)
	@Post('/before-quit')
	async postResearchBeforeQuit(
		@AuthenticatedUser() user: User,
		@Body()
		beforeQuitRequestBody: Pick<
			RequestResearchBeforeQuitDto,
			'question1' | 'question2'
		>,
	) {
		const requestResearchBeforeQuitDto = plainToInstance(
			RequestResearchBeforeQuitDto,
			{
				userId: user.id,
				userName: user.name,
				...beforeQuitRequestBody,
			},
			{ exposeDefaultValues: true },
		);

		return await this.researchService.sendBeforeQuitResearch(
			requestResearchBeforeQuitDto,
		);
	}
}
