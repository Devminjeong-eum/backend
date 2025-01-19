import { Inject } from '@nestjs/common';

import { DRIZZLE_CLIENT } from '../constant/drizzle.constant';

export const InjectDrizzleClient = () => Inject(DRIZZLE_CLIENT);
