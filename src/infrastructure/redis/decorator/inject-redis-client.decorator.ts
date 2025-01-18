import { Inject } from '@nestjs/common';

import { REDIS_CLIENT } from '../constant/redis-client.constant';

export const InjectRedisClient = () => Inject(REDIS_CLIENT);
