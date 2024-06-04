import { Router } from 'express';
import { wrapper } from '../utils/wrapper.util';
import {
  emailBodyValidation,
  passwordBodyValidation,
} from '../utils/validation/account.validation';
import { validate } from '../middlewares/validate.middleware';
import Container from 'typedi';
import { AuthService } from '../services/auth.service';
import { IAuth } from '../interfaces/auth/auth.interface';
import { ResponseEntity } from '../utils/response.util';
import env from '../config/env.config';

export const authRouter = Router();
export const accountService = Container.get(AuthService);
export const authService = Container.get(AuthService);

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

    const accountInfo = await accountService.login(input);

    const token = await authService.createSession(accountInfo);

    res.cookie(env.SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      maxAge: env.LOGIN_TTL * 1000,
    });

    return res.status(201).send(ResponseEntity.SUCCESS());
  }),
);
