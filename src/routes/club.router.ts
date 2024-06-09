import { Router } from 'express';
import { loginAuthGuard } from '../middlewares/login-auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  belongBodyValidation,
  bigCategoryBodyValidation,
  clubBannerImgValidation,
  clubNameBodyValidation,
  coverBodyValidation,
  isRecruitBodyValidation,
  profileImgBodyValidation,
  smallCategoryBodyValidation,
} from '../utils/validation/club.validation';
import { clubService } from '../utils/container.util';
import { IClub } from '../interfaces/club/club.interface';

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
    coverBodyValidation,
    isRecruitBodyValidation,
    profileImgBodyValidation,
    clubBannerImgValidation,
  ]),
  async (req, res, next) => {
    const createClubInput: IClub.ICreateClubRequest = req.body;

    await clubService.createClub(createClubInput);
  },
);
