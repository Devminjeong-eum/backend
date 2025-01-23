import { PickType } from '@nestjs/mapped-types';

import { LikeSchema } from '#/infrastructure/drizzle/schema/like.schema';

export class RequestCreateLikeDto extends PickType(LikeSchema, ['wordId']) {}
