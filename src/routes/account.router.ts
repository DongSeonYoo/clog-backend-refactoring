import { Router } from 'express';
import {
  admissionYearBodyValidation,
  emailBodyValidation,
  majorIdxBodyArrayValidation,
  nameBodyValidation,
  passwordBodyValidation,
} from '../utils/validation/account.validation';
import { validate } from '../middlewares/validate.middleware';
import Container from 'typedi';
import { AccountService } from '../services/account.service';
import { IAccount } from '../interfaces/account/account.interface';
import { ResponseEntity } from '../utils/response.util';
import { wrapper } from '../utils/wrapper.util';
import { loginAuthGuard } from '../middlewares/login-auth.middleware';

export const accountRouter = Router();

export const accountService = Container.get(AccountService);

/**
 * @POST /account
 * @Role None
 * 회원가입
 */
accountRouter.post(
  '/',
  validate([
    emailBodyValidation,
    passwordBodyValidation,
    nameBodyValidation,
    admissionYearBodyValidation,
    ...majorIdxBodyArrayValidation,
  ]),
  wrapper(async (req, res, next) => {
    const input: Omit<IAccount.ICreateAccount, 'personalColor'> = req.body;

    const accountIdx = await accountService.createAccount(input);

    return res.send(ResponseEntity.SUCCESS_WITH({ accountIdx }, '회원가입 성공'));
  }),
);

/**
 * @GET /account/profile
 * @Role User
 * 내 정보 조회
 */
accountRouter.get(
  '/profile',
  loginAuthGuard(),
  wrapper(async (req, res, next) => {
    const accountIdx = req.user.idx;

    const accountProfile = await accountService.getAccountProfile(accountIdx);

    return res.send(ResponseEntity.SUCCESS_WITH(accountProfile));
  }),
);
