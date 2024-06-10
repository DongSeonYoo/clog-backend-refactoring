import { Router } from 'express';
import { loginAuthGuard } from '../middlewares/login-auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  belongBodyValidation,
  bigCategoryBodyValidation,
  clubBannerImgBodyValidation,
  clubNameBodyValidation,
  summaryBodyValidation,
  isRecruitBodyValidation,
  clubProfileImgBodyValidation,
  smallCategoryBodyValidation,
} from '../utils/validation/club.validation';
import { clubService } from '../utils/container.util';
import { IClub } from '../interfaces/club/club.interface';
import { IAccount } from '../interfaces/account/account.interface';
import { ResponseEntity } from '../utils/response.util';
import { wrapper } from '../utils/wrapper.util';

export const clubRouter = Router();

/**
 * POST /club
 * @Role User
 * 동아리 생성
 */
clubRouter.post(
  '/',
  loginAuthGuard(),
  validate([
    belongBodyValidation,
    bigCategoryBodyValidation,
    smallCategoryBodyValidation,
    clubNameBodyValidation,
    summaryBodyValidation,
    isRecruitBodyValidation,
    clubProfileImgBodyValidation,
    clubBannerImgBodyValidation,
  ]),
  wrapper(async (req, res, next) => {
    const accountIdx: IAccount['idx'] = req.user.idx;
    const createClubInput: IClub.ICreateClubRequest = req.body;

    const createdClubIdx = await clubService.createClub(createClubInput, accountIdx);

    return res.send(ResponseEntity.SUCCESS_WITH(createdClubIdx));
  }),
);
