import type { Request } from 'express';

export interface RequestWithViewerId extends Request {
	viewerId: string;
}
