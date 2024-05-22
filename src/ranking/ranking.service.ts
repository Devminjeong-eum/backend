import { Injectable } from '@nestjs/common';

@Injectable()
export class RankingService {
  findAll() {
    return `This action returns all ranking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ranking`;
  }

  remove(id: number) {
    return `This action removes a #${id} ranking`;
  }
}
