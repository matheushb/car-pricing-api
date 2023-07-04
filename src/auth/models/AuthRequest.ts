import { User } from '@prisma/client';
import { Request } from 'express';
export class AuthRequest extends Request {
  user: User;
}
