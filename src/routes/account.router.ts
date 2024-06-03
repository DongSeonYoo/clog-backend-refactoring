import { Router } from 'express';
import { wrapper } from '../utils/wrapper.util';
import { accountService } from '../utils/container.util';
import { ResponseEntity } from '../utils/response.util';
import {
  admissionYearBodyValidation,
  emailBodyValidation,
  majorIdxBodyValidation,
  nameBodyValidation,
  passwordBodyValidation,
} from '../utils/validation/account.validation';
import { validate } from '../middlewares/validate.middleware';
import { IAccount } from '../interfaces/account/account.interface';

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
);
