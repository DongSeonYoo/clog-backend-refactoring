import express from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { HttpStatus } from '../util/http-status.util';
import { ResponseEntity } from '../util/response.util';

export const validate = (validations: ValidationChain[]): express.RequestHandler => {
  return async (req, res, next) => {
    const validationPromises = validations.map((validation) => validation.run(req));

    await Promise.all(validationPromises);

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.send(
      ResponseEntity.ERROR_WITH(
        HttpStatus.BAD_REQUEST,
        'Validation Error',
        errors.array().map((error) => `[${error['location']}] ${error['path']}: ${error['msg']}`),
      ),
    );
  };
};
