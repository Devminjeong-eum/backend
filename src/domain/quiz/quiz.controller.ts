import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthenticatedUser } from '#/domain/auth/decorator/auth.decorator';
import { AdminGuard } from '#/domain/auth/guard/admin.guard';
import { AuthenticationGuard } from '#/domain/auth/guard/auth.guard';
import { UserInformationInterceptor } from '#/domain/user/interceptors/user-information.interceptor';
import { type UserEntity } from '#/infrastructure/drizzle/schema';
import { ApiDocs } from '#/shared/decorators/swagger.decorator';

import {
	RequestCreateQuizResultDto,
	ResponseCreateQuizResultDto,
} from './dto/create-quiz-result.dto';
import { ResponseQuizResultDto } from './dto/quiz-result.dto';
import { ResponseQuizSelectionDto } from './dto/quiz-selection.dto';
import { QuizBatchUpdateService } from './service/quiz-batch-update.service';
import { QuizResultService } from './service/quiz-result.service';
import { QuizSelectionService } from './service/quiz-selection.service';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
	constructor(
		private readonly quizResultService: QuizResultService,
		private readonly quizSelectionService: QuizSelectionService,
		private readonly quizBatchUpdateService: QuizBatchUpdateService,
	) {}

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
		@AuthenticatedUser() user: UserEntity,
		@Body('correctWordIds') correctWordIds: string[],
		@Body('incorrectWordIds') incorrectWordIds: string[],
	) {
		return this.quizResultService.createQuizResult({
			userId: user.id,
			correctWordIds,
			incorrectWordIds,
		});
	}

	@ApiDocs({
		summary: '특정 ID 에 대한 퀴즈 결과 데이터를 조회합니다.',
		params: {
			name: 'quizResultId',
			required: true,
			description: '조회할 퀴즈 결과 ID',
		},
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseQuizResultDto,
		},
	})
	@UseInterceptors(UserInformationInterceptor)
	@Get('/result/:quizResultId')
	async findQuizResultById(
		@AuthenticatedUser() user: UserEntity,
		@Param('quizResultId') quizResultId: string,
	) {
		return this.quizResultService.findQuizResultById({
			userId: user.id,
			quizResultId,
		});
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
		return this.quizSelectionService.findQuizSelectionRandom();
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
	@UseGuards(AdminGuard)
	@Patch('/selection/spread-sheet')
	patchUpdateSpreadSheet() {
		return this.quizBatchUpdateService.updateQuizSelectionList();
	}
}
