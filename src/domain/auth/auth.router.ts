import { Router } from 'express';
import { wrapper } from '../../util/wrapper.util';

export const authRouter = Router();

authRouter.get(
  '/',
  wrapper(async (req, res, next) => {
    console.log(req.originalUrl);

    return res.send();
  }),
);
