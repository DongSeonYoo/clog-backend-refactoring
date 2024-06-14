import s3Uploader from '../middlewares/upload.middleware';
import { Router } from 'express';
import { wrapper } from '../utils/wrapper.util';
import { BadRequestException } from '../utils/custom-error.util';
import { ResponseEntity } from '../utils/response.util';
import { loginAuthGuard } from '../middlewares/auth/login-auth.middleware';

export const uploadRouter = Router();

/**
 * POST /upload/club-profile
 * @Role User
 * 동아리 프로필 이미지 업로드
 */
uploadRouter.post(
  '/club-profile',
  loginAuthGuard(),
  s3Uploader({ fieldName: 'clubProfile', maxCount: 3 }),
  wrapper(async (req, res, next) => {
    const files = req.files as Express.MulterS3.File[];

    if (!files) {
      console.log('파일이 존재하지 않음');
      throw new BadRequestException('파일이 존재하지 않습니다');
    }

    return res.send(ResponseEntity.SUCCESS_WITH(files.map((e) => e.location)));
  }),
);

/**
 * POST /upload/club-banner
 * @Role User
 * 동아리 배너 이미지 업로드
 */
uploadRouter.post(
  '/club-banner',
  loginAuthGuard(),
  s3Uploader({ fieldName: 'clubBanner', maxCount: 1 }),
  wrapper(async (req, res, next) => {
    const files = req.files as Express.MulterS3.File[];

    if (!files) {
      console.log('파일이 존재하지 않음');
      throw new BadRequestException('파일이 존재하지 않습니다');
    }

    return res.send(ResponseEntity.SUCCESS_WITH(files.map((e) => e.location)));
  }),
);

/**
 * POST /upload/post
 * @Role User
 * 게시글 이미지 업로드
 */
uploadRouter.post(
  '/club-banner',
  loginAuthGuard(),
  s3Uploader({ fieldName: 'postImages', maxCount: 10 }),
  wrapper(async (req, res, next) => {
    const files = req.files as Express.MulterS3.File[];

    if (!files) {
      console.log('파일이 존재하지 않음');
      throw new BadRequestException('파일이 존재하지 않습니다');
    }

    return res.send(ResponseEntity.SUCCESS_WITH(files.map((e) => e.location)));
  }),
);
