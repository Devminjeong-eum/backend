import { PickType } from '@nestjs/mapped-types';

import { LikeSchema } from '#/infrastructure/drizzle/schema/like.schema';

export class RequestRevertLikeDto extends PickType(LikeSchema, ['wordId']) {}
