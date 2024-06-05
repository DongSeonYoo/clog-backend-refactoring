import { Router } from 'express';
import {
  admissionYearBodyValidation,
  emailBodyValidation,
  majorIdxBodyArrayValidation,
  nameBodyValidation,
  passwordBodyValidation,
  updateAccountProfileBodyValidation,
} from '../utils/validation/account.validation';
import { validate } from '../middlewares/validate.middleware';
import { IAccount } from '../interfaces/account/account.interface';
import { ResponseEntity } from '../utils/response.util';
import { wrapper } from '../utils/wrapper.util';
import { loginAuthGuard } from '../middlewares/login-auth.middleware';
import { accountService, authService } from '../utils/container.util';

export const accountRouter = Router();

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

  /**
   * @PATCH /account
   * @Role User
   * 회원정보 수정
   */
  accountRouter.patch(
    '/',
    loginAuthGuard(),
    validate([...updateAccountProfileBodyValidation]),
    wrapper(async (req, res, next) => {
      const accountIdx: IAccount['idx'] = req.user.idx;
      const updateAccountInput: IAccount.IUpdateProfileRequest = req.body;

      await accountService.updateAccountProfile(updateAccountInput, accountIdx);

      return res.send(ResponseEntity.SUCCESS('회원정보 수정 성공'));
    }),
  ),

  /**
   * @DELETE /account
   * @Role User
   * 회원탈퇴
   */
  accountRouter.delete(
    '/',
    loginAuthGuard(),
    wrapper(async (req, res, next) => {
      const accountIdx: IAccount['idx'] = req.user.idx;

      // 회원탈퇴 로직 수행
      await accountService.deleteAccount(accountIdx);

      // 세션 삭제
      await authService.destorySession(accountIdx);

      return res.send(ResponseEntity.SUCCESS('회원탈퇴 성공'));
    }),
  ),
);
