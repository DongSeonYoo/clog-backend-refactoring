import 'reflect-metadata';
import express from 'express';
import { errorHandling } from './middleware/error.middleware';
import { wrapper } from './util/wrapper.util';
import { ResponseEntity } from './util/response.util';

const app = express();

app.use(
  '/',
  wrapper(async (req, res, next) => {
    return res.send(ResponseEntity.SUCCESS());
  }),
);

app.use(errorHandling());

export default app;
