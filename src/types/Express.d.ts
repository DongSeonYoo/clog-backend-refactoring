import { IJwtPayload } from '../interface/auth/jwt-payload.interface';

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}

export {};
