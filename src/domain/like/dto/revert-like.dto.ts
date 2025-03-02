import { PickType } from '@nestjs/mapped-types';

import { LikeSchema } from '#/infrastructure/drizzle/schema';

export class RequestRevertLikeDto extends PickType(LikeSchema, ['wordId']) {}
