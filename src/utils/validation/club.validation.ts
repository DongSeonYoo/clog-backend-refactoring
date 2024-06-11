import { body, param, ValidationChain } from 'express-validator';

/**
 * @body belongIdx 소속 인덱스
 */
export const belongBodyValidation: ValidationChain = body('belongIdx').notEmpty().isInt().toInt();

/**
 * @body bigCategoryIdx 동아리 대분류 인덱스 번호
 */
export const bigCategoryBodyValidation: ValidationChain = body('bigCategoryIdx')
  .notEmpty()
  .isInt()
  .toInt();

/**
 * @body smallCategoryIdx 동아리 소분류 인덱스 번호
 */
export const smallCategoryBodyValidation: ValidationChain = body('smallCategoryIdx')
  .notEmpty()
  .isInt()
  .toInt();

/**
 * @body name 동아리 이름
 */
export const clubNameBodyValidation: ValidationChain = body('name').notEmpty().isString();

/**
 * @body summary 동아리 소개글
 */
export const summaryBodyValidation: ValidationChain = body('summary').notEmpty().isString();

/**
 * @body isRecruit 동아리 가입 신청 받을지 여부(bool)
 */
export const isRecruitBodyValidation: ValidationChain = body('isRecruit').notEmpty().isBoolean();

/**
 * @body profileImg 업로드할 이미지 경로
 */
export const clubProfileImgBodyValidation: ValidationChain = body('profileImg')
  .notEmpty()
  .isString()
  .isURL();

/**
 * @body bannerImg 업로드할 이미지 경로
 */
export const clubBannerImgBodyValidation: ValidationChain = body('bannerImg')
  .notEmpty()
  .isString()
  .isURL();

/**
 * @params clubIdx 동아리 인덱스
 */
export const clubIdxParamValidation: ValidationChain = param('clubIdx').notEmpty().isInt().toInt();
