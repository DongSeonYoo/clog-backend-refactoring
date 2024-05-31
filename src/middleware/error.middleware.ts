import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../util/custom-error.util';
import { HttpStatus } from '../util/http-status.util';
import { ResponseEntity } from '../util/response.util';
import env from '../config/env.config';

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
        .send(ResponseEntity.ERROR_WITH(error.statusCode, error.message, error.reason));
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ResponseEntity.ERROR());
  };
};
