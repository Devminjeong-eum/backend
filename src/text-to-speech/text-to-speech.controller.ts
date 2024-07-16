import {
	Controller,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AdminGuard } from '#/auth/guard/admin.guard';
import { ApiDocs } from '#/common/decorators/swagger.decorator';

import { RequestUpdateWordTextToSpeechDto } from './dto/update-tts-text.dto';
import { TextToSpeechService } from './text-to-speech.service';
import { RequestCreateWordTextToSpeechDto } from './dto/create-tts-text.dto';

@ApiTags('Text-To-Speech')
@Controller('text-to-speech')
export class TextToSpeechController {
	constructor(private readonly textToSpeechService: TextToSpeechService) {}

	@ApiDocs({
		summary: '기존에 생성했던 단어 TTS 를 수정합니다.',
	})
	@UseGuards(AdminGuard)
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
	})
	@UseGuards(AdminGuard)
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
			schema: Boolean,
			isPaginated: true,
		},
	})
	@Get('/:wordId')
	async findTextToSpeechByWordId(@Param('wordId') wordId: string) {
		return await this.textToSpeechService.generateAudioPresignedUrl(wordId);
	}
}
