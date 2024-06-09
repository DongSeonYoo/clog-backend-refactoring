import { Router } from 'express';
import { loginAuthGuard } from '../middlewares/login-auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { wrapper } from '../utils/wrapper.util';
import s3Uploader from '../middlewares/upload.middleware';
import { BadRequestException } from '../utils/custom-error.util';
import { ResponseEntity } from '../utils/response.util';

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

    console.log(files.map((e) => e.location));

    return res.send(ResponseEntity.SUCCESS_WITH(files.map((e) => e.location)));
  }),
);
