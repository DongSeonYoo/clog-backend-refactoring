import { Router } from 'express';
import { wrapper } from '../../util/wrapper.util';
import Container from 'typedi';
import { AccountService } from './account.service';
import { ResponseEntity } from '../../util/response.util';

export const accountService = Container.get(AccountService);
export const accountRouter = Router();

accountRouter.get(
  '/',
  wrapper(async (req, res, next) => {
    const result = await accountService.say();

    return res.send(ResponseEntity.SUCCESS_WITH(result));
  }),
);
