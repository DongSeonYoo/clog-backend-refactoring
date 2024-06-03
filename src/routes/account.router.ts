import { Router } from 'express';
import {
  admissionYearBodyValidation,
  emailBodyValidation,
  majorIdxBodyValidation,
  nameBodyValidation,
  passwordBodyValidation,
} from '../utils/validation/account.validation';
import { validate } from '../middlewares/validate.middleware';
import Container from 'typedi';
import { AccountService } from '../services/account.service';

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
    // emailBodyValidation,
    // passwordBodyValidation,
    // nameBodyValidation,
    // admissionYearBodyValidation,
    // majorIdxBodyValidation,
  ]),
  async (req, res) => {
    const result = await accountService.someFunc(71);

    return res.send(result);
  },
);
