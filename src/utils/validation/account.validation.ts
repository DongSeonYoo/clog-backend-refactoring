import { ValidationChain, body } from 'express-validator';

/**
 * @param email 이메일
 */
export const emailBodyValidation: ValidationChain = body('email').notEmpty().isEmail();

/**
 * @param password 비밀번호
 */
export const passwordBodyValidation: ValidationChain = body('password').notEmpty().isString();

/**
 * @param name 이름
 */
export const nameBodyValidation: ValidationChain = body('name').notEmpty().isString();

/**
 * @param admissionYear 학번
 */
export const admissionYearBodyValidation: ValidationChain = body('admissionYear')
  .notEmpty()
  .isInt()
  .toInt();

/**
 * @body majorIdx[{idx: number}] 학과 인덱스 배열
 */
export const majorIdxBodyArrayValidation: ValidationChain[] = [
  body('major').notEmpty().isArray({ min: 1 }),
  body('major.*.idx').notEmpty().isInt().toInt(),
];

/**
 * @body name 이름
 * @body admissionYear 학번
 * @body major[{idx: number}] 학과 인덱스 배열
 * @body major[].idx 학과 인덱스
 */
export const updateAccountProfileBodyValidation: ValidationChain[] = [
  body('name').optional().isString(),
  body('admissionYear')
    .optional()
    .isInt()
    .isLength({
      min: 2,
      max: 2,
    })
    .toInt(),
  body('major').optional().isArray({ min: 1 }),
  body('major.*.idx').optional().isInt({ min: 1 }).toInt(),
];
