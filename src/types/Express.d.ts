import { IJwtPayload } from '../interfaces/auth/jwt-payload.interface';

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}

export {};
