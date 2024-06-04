import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/custom-error.util';
import { HttpStatus } from '../utils/http-status.util';
import { ResponseEntity } from '../utils/response.util';
import env from '../config/env.config';

/**
 * SyntaxError는 JSON 형태가 잘못되었을 때 발생하는 에러
 * JSON 형태가 잠였을 때 400 에러를 반환
 * CustomError는 직접 정의한 에러
 * 에러 코드와 메시지를 반환
 * 그 외의 에러는 500 에러를 반환
 */
export const errorHandling = () => {
  return (error: CustomError | Error, req: Request, res: Response, next: NextFunction) => {
    // 개발환경 전용
    if (env.MODE === 'dev') {
      console.log(error);
    }

    if (error instanceof SyntaxError) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(ResponseEntity.ERROR_WITH(400, '잘못된 Json 형태입니다'));
    }

    if (error instanceof CustomError) {
      console.log(error);
      return res
        .status(error.statusCode)
        .send(ResponseEntity.ERROR_WITH(error.statusCode, error.message, error.data));
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ResponseEntity.ERROR());
  };
};
