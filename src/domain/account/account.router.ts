import { Router } from 'express';
import { wrapper } from '../../util/wrapper.util';
import { accountService } from '../../util/container.util';
import { ResponseEntity } from '../../util/response.util';
import { IAccount } from './interface/account.interface';
import {
  admissionYearBodyValidation,
  emailBodyValidation,
  majorIdxBodyValidation,
  nameBodyValidation,
  passwordBodyValidation,
} from './validation/account.validation';
import { validate } from '../../middleware/validate.middleware';

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
    majorIdxBodyValidation,
  ]),
  wrapper(async (req, res, next) => {
    const signupInput: IAccount.ICreateAccount = req.body;

    const accountIdx = await accountService.createAccount(signupInput);

    return res.status(200).send(ResponseEntity.SUCCESS_WITH({ accountIdx }));
  }),
);
