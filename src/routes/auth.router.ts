import { Router } from 'express';
import { wrapper } from '../utils/wrapper.util';
import {
  emailBodyValidation,
  passwordBodyValidation,
} from '../utils/validation/account.validation';
import { validate } from '../middlewares/validate.middleware';
import { IAuth } from '../interfaces/auth/auth.interface';
import { ResponseEntity } from '../utils/response.util';
import env from '../config/env.config';
import { authService } from '../utils/container.util';
import { loginAuthGuard } from '../middlewares/auth/login-auth.middleware';

export const authRouter = Router();

/**
 * @POST /auth/login
 * @Role none
 * 로그인
 */
authRouter.post(
  '/login',
  validate([emailBodyValidation, passwordBodyValidation]),
  wrapper(async (req, res, next) => {
    const input: IAuth.ILogin = req.body;

    // 로그인 로직 수행
    const accountInfo = await authService.login(input);

    // 토큰 발급
    const token = await authService.createToken(accountInfo);

    // 세션 생성
    await authService.setLoginSession(accountInfo.idx, token);

    // 응답 헤더에 발급된 토큰 발행
    res.cookie(env.SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      maxAge: env.LOGIN_TTL * 1000,
    });

    return res.status(201).send(ResponseEntity.SUCCESS());
  }),
);

/**
 * @POST /auth/logout
 * @Role loggedIn
 * 로그 아웃
 */
authRouter.post(
  '/logout',
  loginAuthGuard(),
  wrapper(async (req, res, next) => {
    const accountIdx = req.user.idx;

    await authService.destorySession(accountIdx);

    return res.send(ResponseEntity.SUCCESS('로그아웃 성공요'));
  }),
);
