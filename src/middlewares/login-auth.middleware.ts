import { RequestHandler } from 'express';
import { wrapper } from '../utils/wrapper.util';
import { UnauthorizedException } from '../utils/custom-error.util';
import { TokenManager } from '../utils/token-manager.util';
import { redisService } from '../utils/container.util';
import env from '../config/env.config';

export const loginAuthGuard = (): RequestHandler => {
  return wrapper(async (req, res, next) => {
    // 토큰이 존재하지 않는 경우
    const token: string | undefined = req.cookies[env.SESSION_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다');
    }

    // 토큰이 조작되거나 올바르지 않은 경우
    const payload = TokenManager.verify(token);
    if (!payload) {
      res.clearCookie(env.SESSION_COOKIE_NAME);
      throw new UnauthorizedException('로그인 후 이용가능합니다');
    }

    // 세션저장소에 로그인한 유저가 존재하지 않는 경우
    const findLoggedInUser = await redisService.client.get(`session:${payload.idx}`);
    if (!findLoggedInUser) {
      console.log('세션저장소에 로그인한 유저가 존재하지 않는 경우');
      throw new UnauthorizedException('로그인 후 이용가능합니다');
    }

    // 세션 갱신
    await redisService.client.expire(`session:${payload.idx}`, env.LOGIN_TTL);

    req.user = {
      ...payload,
    };

    return next();
  });
};
