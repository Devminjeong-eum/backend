import {
	Controller,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserRole } from '#/infrastructure/drizzle/constant/user-role.constant';
import { ApiDocs } from '#/shared/decorators/swagger.decorator';
import { UseRoleGuard } from '#/shared/guard/user-role';

import {
	RequestCreateWordTextToSpeechDto,
	RequestUpdateWordTextToSpeechDto,
	ResponseCreateWordTextToSpeechDto,
	ResponseUpdateWordTextToSpeechDto,
} from './dto';
import { TextToSpeechService } from './service/text-to-speech.service';

@ApiTags('Text-To-Speech')
@Controller('tts')
export class TextToSpeechController {
	constructor(private readonly textToSpeechService: TextToSpeechService) {}

	@ApiDocs({
		summary: '기존에 생성했던 단어 TTS 를 수정합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseUpdateWordTextToSpeechDto,
		},
	})
	@UseRoleGuard(UserRole.ADMIN)
	@Patch('/update')
	async patchUpdateTextToSpeech(
		@Query() updateWordTextToSpeechDto: RequestUpdateWordTextToSpeechDto,
	) {
		return await this.textToSpeechService.updateWordTextToSpeech(
			updateWordTextToSpeechDto,
		);
	}

	@ApiDocs({
		summary: '기존에 생성했던 단어 TTS 를 수정합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: ResponseCreateWordTextToSpeechDto,
		},
	})
	@UseRoleGuard(UserRole.ADMIN)
	@Post('/create')
	async postCreateTextToSpeech(
		@Query() createWordTextToSpeechDto: RequestCreateWordTextToSpeechDto,
	) {
		return await this.textToSpeechService.createWordTextToSpeech(
			createWordTextToSpeechDto,
		);
	}

	@ApiDocs({
		summary: '단어 TTS 음성 파일을 받는 Presigned URL 을 생성합니다.',
		response: {
			statusCode: HttpStatus.OK,
			schema: String,
		},
	})
	@Get('/:wordId')
	async findTextToSpeechByWordId(@Param('wordId') wordId: string) {
		return await this.textToSpeechService.generateAudioPresignedUrl({
			wordId,
		});
	}
}
