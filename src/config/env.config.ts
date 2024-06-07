import dotenv from 'dotenv';

dotenv.config();

const env = {
  //mode
  MODE: process.env.MODE as string,

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN as string,

  //server port
  HTTP_PORT: Number(process.env.HTTP_PORT),

  // database info
  DATABASE_HOST: process.env.DATABASE_HOST as string,
  DATABASE_USER_NAME: process.env.DATABASE_USER_NAME as string,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD as string,
  DATABASE_NAME: process.env.DATABASE_NAME as string,

  // session secret key
  SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY as string,

  // jwt secret key
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,

  // redis url
  REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',

  // login expired time
  LOGIN_TTL: Number(process.env.LOGIN_TTL) as number,

  // AWS configuration
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECERET_ACCESS_KEY: process.env.AWS_SECERET_ACCESS_KEY as string,
  AWS_S3_BUCKET_NAME: process.env.AWS_BUCKET_NAME as string,

  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'connect.sid',
};

export default env;
