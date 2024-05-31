import 'reflect-metadata';
import express from 'express';
import { errorHandling } from './middleware/error.middleware';
import { wrapper } from './util/wrapper.util';
import { ResponseEntity } from './util/response.util';
import { accountRouter } from './domain/account/account.router';

const app = express();

app.use('/account', accountRouter);

app.use(errorHandling());

export default app;
