import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { AuthenticatedUser } from '#/auth/decorator/auth.decorator';
import { AuthenticationGuard } from '#/auth/guard/auth.guard';
import { ApiDocs } from '#/common/decorators/swagger.decorator';
import { UserInformationInterceptor } from '#/user/interceptors/user-information.interceptor';
import { User } from '#databases/entities/user.entity';

import {
	RequestCreateQuizResultDto,
	ResponseCreateQuizResultDto,
} from './dto/create-quiz-result.dto';
import {
	RequestQuizResultDto,
	ResponseQuizResultDto,
} from './dto/quiz-result.dto';
import { ResponseQuizSelectionDto } from './dto/quiz-selection.dto';
import { QuizService } from './quiz.service';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@ApiDocs({
		summary: '사용자가 풀이한 퀴즈 결과를 저장합니다.',
		body: {
			type: RequestCreateQuizResultDto,
		},
		response: {
			statusCode: HttpStatus.CREATED,
			schema: ResponseCreateQuizResultDto,
		},
	})
	@UseGuards(AuthenticationGuard)
	@Post('/result')
	async createQuizResult(
		@AuthenticatedUser() user: User,
		@Body('correctWordIds') correctWordIds: string[],
		@Body('incorrectWordIds') incorrectWordIds: string[],
	) {
		const createQuizResultDto = plainToInstance(
			RequestCreateQuizResultDto,
			{ correctWordIds, incorrectWordIds },
		);
		return this.quizService.createQuizResult(user, createQuizResultDto);
	}

	@ApiDocs({
		summary: '특정 ID 에 대한 퀴즈 결과 데이터를 조회합니다.',
		params: {
			name: 'quizResultId',
			required: true,
			description: '조회할 퀴즈 결과 UUID (id)',
		},
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseQuizResultDto,
		},
	})
	@UseInterceptors(UserInformationInterceptor)
	@Get('/result/:quizResultId')
	async findQuizResultById(
		@AuthenticatedUser() user: User,
		@Param('quizResultId', new ParseUUIDPipe({ version: undefined }))
		quizResultId: string,
	) {
		const quizResultDto = plainToInstance(RequestQuizResultDto, {
			userId: user?.id,
			quizResultId,
		});

		return this.quizService.findQuizResultById(quizResultDto);
	}

	@ApiDocs({
		summary: '생성된 퀴즈들 중 무작위로 10개를 선정합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseQuizSelectionDto,
		},
	})
	@Get('/selection')
	findQuizSelectionRandom() {
		return this.quizService.findQuizSelectionRandom();
	}

	@ApiDocs({
		summary:
			'데브말싸미 Google Spread Sheet 를 기반으로 퀴즈 목록을 갱신합니다.',
		headers: {
			name: 'Authorization',
			required: true,
			description: '어드민 전용 Api Key',
		},
	})
	@UseGuards(AuthenticationGuard)
	@Patch('/selection/spread-sheet')
	patchUpdateSpreadSheet() {
		return this.quizService.updateQuizSelectionList();
	}
}
