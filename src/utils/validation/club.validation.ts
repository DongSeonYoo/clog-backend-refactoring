import { body, ValidationChain } from 'express-validator';

/**
 * @body belong 소속
 */
export const belongBodyValidation: ValidationChain = body('belong').notEmpty().isInt().toInt();

/**
 * @body bigCategory 동아리 대분류 인덱스 번호
 */
export const bigCategoryBodyValidation: ValidationChain = body('bigCategory')
  .notEmpty()
  .isInt()
  .toInt();

/**
 * @body smallCategory 동아리 소분류 인덱스 번호
 */
export const smallCategoryBodyValidation: ValidationChain = body('smallCategory')
  .notEmpty()
  .isInt()
  .toInt();

/**
 * @body name 동아리 이름
 */
export const clubNameBodyValidation: ValidationChain = body('name').notEmpty().isString();

/**
 * @body cover 동아리 소개글
 */
export const coverBodyValidation: ValidationChain = body('cover').notEmpty().isString();

/**
 * @body isRecruit 동아리 가입 신청 받을지 여부(bool)
 */
export const isRecruitBodyValidation: ValidationChain = body('isRecruit').notEmpty().isBoolean();

/**
 * @body profileImg 업로드할 이미지 경로
 */
export const profileImgBodyValidation: ValidationChain = body('profileImg')
  .notEmpty()
  .isString()
  .isURL();

/**
 * @body bannerImg 업로드할 이미지 경로
 */
export const clubBannerImgValidation: ValidationChain = body('bannerImg')
  .notEmpty()
  .isString()
  .isURL();
