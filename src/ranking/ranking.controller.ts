import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Post()
  create(@Body() createRankingDto: CreateRankingDto) {
    return this.rankingService.create(createRankingDto);
  }

  @Get()
  findAll() {
    return this.rankingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rankingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRankingDto: UpdateRankingDto) {
    return this.rankingService.update(+id, updateRankingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rankingService.remove(+id);
  }
}
