import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';

import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { WordService } from './word.service';

@Controller('word')
export class WordController {
	constructor(private readonly wordService: WordService) {}

	@Post()
	create(@Body() createWordDto: CreateWordDto) {
		return this.wordService.create(createWordDto);
	}

	@Get()
	findAll() {
		return this.wordService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.wordService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateWordDto: UpdateWordDto) {
		return this.wordService.update(+id, updateWordDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.wordService.remove(+id);
	}
}
