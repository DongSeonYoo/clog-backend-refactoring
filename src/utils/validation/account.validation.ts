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
 * @param majorIdx 학과 인덱스
 */
export const majorIdxBodyValidation: ValidationChain = body('majorIdx').notEmpty().isInt().toInt();
