import 'reflect-metadata';
import express from 'express';
import { errorHandling } from './middlewares/error.middleware';
import { accountRouter } from './routes/account.router';
import { authRouter } from './routes/auth.router';
import cookieParser from 'cookie-parser';
import { uploadRouter } from './routes/upload.router';
import { clubRouter } from './routes/club.router';

const app = express();

// 전역 미들웨어
app.use(cookieParser());
app.use(express.json());

// 라우터 등록
app.use('/account', accountRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/club', clubRouter);

// 에러 핸들링 미들웨어
app.use(errorHandling());

export default app;
