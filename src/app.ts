import 'reflect-metadata';
import './config/knex.config';
import express from 'express';
import { errorHandling } from './middlewares/error.middleware';
import { accountRouter } from './routes/account.router';

const app = express();

// 전역 미들웨어
app.use(express.json());

// 라우터 등록
app.use('/account', accountRouter);

// 에러 핸들링 미들웨어
app.use(errorHandling());

export default app;
