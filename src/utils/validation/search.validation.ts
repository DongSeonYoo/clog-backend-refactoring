import { ValidationChain, query } from 'express-validator';

/**
 * @query page - 페이지 번호 (default: 1)
 */
export const pageQueryValidation: ValidationChain = query('page')
  .default(1)
  .isInt({ min: 0 })
  .withMessage('정수가 아닙니다');

/**
 * @query name - 검색할 데이터 이름 (빈 칸일 시 전체 데이터 목록 조회)
 */
export const nameQueryValidation: ValidationChain = query('name')
  .default('')
  .isString()
  .withMessage('문자가 아닙니다')
  .isLength({ max: 20 })
  .withMessage('길이를 확인해주세요');

/**
 * @query page - 페이지 번호 (default: 1)
 * @query name - 검색할 데이터 이름 (빈 칸일 시 전체 데이터 목록 조회)
 */
export const searchQueryValidation: ValidationChain[] = [pageQueryValidation, nameQueryValidation];
