import path from 'path';
import s3Storage from 'multer-s3';
import multer, { MulterError, Options } from 'multer';
import env from '../config/env.config';
import { wrapper } from '../utils/wrapper.util';
import { S3Client } from '@aws-sdk/client-s3';
import { createRandomNumberString } from '../utils/random.util';
import { BadRequestException, InternalServerErrorException } from '../utils/custom-error.util';
import { IFieldName } from '../interfaces/upload/upload-field.interface';

const MulterErrorMessage = {
  LIMIT_PART_COUNT: 'Too many parts',
  LIMIT_FILE_SIZE: '파일이 너무 큽니다.',
  LIMIT_FILE_COUNT: '파일이 너무 많습니다.',
  LIMIT_FIELD_KEY: '필드 이름이 너무 깁니다.',
  LIMIT_FIELD_VALUE: '필드 값이 너무 큽니다.',
  LIMIT_FIELD_COUNT: '필드의 개수를 확인해주세요',
  LIMIT_UNEXPECTED_FILE: '필드 이름이 잘못되었습니다.',
  MISSING_FIELD_NAME: '필드 이름을 찾을 수 없습니다.',
  NOT_ALLOWD_MIMETYPE: '확장자가 잘못되었습니다',
};

const allowedMimeType = ['image/jpg', 'image/png', 'image/jpeg'];

const s3: S3Client = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECERET_ACCESS_KEY,
  },
});

/**
 * S3 업로더 미들웨어
 * @param options fieldName: 필드 이름
 */
const s3Uploader = (options: { fieldName: IFieldName; maxCount: number }) => {
  const { fieldName, maxCount } = options;

  return wrapper(async (req, res, next) => {
    multer(getMulterConfig({ fieldName, maxCount })).array(fieldName, maxCount)(
      req,
      res,
      (err: any) => {
        if (err instanceof MulterError) {
          return next(new BadRequestException(MulterErrorMessage[err.code]));
        }

        if (err) {
          console.log(err);
          return next(new InternalServerErrorException('파일 업로드 중 문제가 발생했습니다'));
        }

        return next();
      },
    );
  });
};

const getMulterConfig = (options: { fieldName: string; maxCount: number }): Options => {
  const { fieldName, maxCount } = options;

  return {
    storage: s3Storage({
      s3,
      bucket: env.AWS_S3_BUCKET_NAME,
      acl: 'public-read-write',
      contentType: s3Storage.AUTO_CONTENT_TYPE,
      key: (req, file, callback) => {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${fieldName}/${new Date().getTime()}-${createRandomNumberString(
          6,
        )}${fileExtension}`;

        return callback(null, fileName);
      },
    }),
    fileFilter(req, file, callback) {
      if (!allowedMimeType.includes(file.mimetype)) {
        return callback(new MulterError('NOT_ALLOWD_MIMETYPE'));
      }

      return callback(null, true);
    },
    limits: {
      fileSize: 100 * 1024 * 1024, // 100mb 제한
      files: maxCount, // 최대 필드 개수
      fields: 0, // 최소 필드 개수
    },
  };
};

export default s3Uploader;
