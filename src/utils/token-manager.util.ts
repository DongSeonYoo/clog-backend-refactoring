import jwt from 'jsonwebtoken';
import env from '../config/env.config';
import { IJwtPayload } from '../interfaces/auth/jwt-payload.interface';

export namespace TokenManager {
  export const generate = (userInfo: IJwtPayload) => {
    const issuer = 'ecodot';

    return jwt.sign(userInfo, env.JWT_SECRET_KEY, {
      issuer,
    });
  };

  export const verify = (token: string): IJwtPayload | null => {
    try {
      const payload = <IJwtPayload>jwt.verify(token, env.JWT_SECRET_KEY);
      if (typeof payload === 'string') {
        return null;
      }

      return payload;
    } catch (error) {
      return null;
    }
  };
}
