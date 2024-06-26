import { Router } from 'express';
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
  clubIdxBodyValidation,
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

  /**
   * GET /club/duplicate/name/:clubName
   * @Role User
   * 동아리 이름 중복 확인
   */
  clubRouter.get(
    '/duplicate/name/:clubName',
    validate([clubNameBodyValidation]),
    wrapper(async (req, res, next) => {
      const clubName: IClub['name'] = req.params.clubName;

      await clubService.checkDuplicateName(clubName);

      return res.send(ResponseEntity.SUCCESS_WITH('사용 가능한 이름입니다'));
    }),
  ),
);

/**
 * POST /club/join-request
 * @Role User
 * 동아리 가입 신청
 */
clubRouter.post(
  '/join-request',
  validate([clubIdxBodyValidation]),
  wrapper(async (req, res, next) => {
    const accountIdx: IAccount['idx'] = req.user.idx;
    const clubIdx: IClub['idx'] = req.body.clubIdx;

    await clubService.joinRequest(clubIdx, accountIdx);

    return res.send(ResponseEntity.SUCCESS);
  }),
);

/**
 * GET /club/join-request/{clubIdx}/list
 * @Role User
 * 동아리 가입 신청 목록 조회
 *
 * 해당 동아리의 회장, 운영진만 가능
 */
