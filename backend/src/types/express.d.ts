import { User } from '@shared/models';

declare module 'express' {
  interface Request {
    user: User;
  }
}
