import app from './app';
import env from './config/env.config';

const server = async () => {
  app.listen(env.HTTP_PORT, '0.0.0.0', () => {
    console.log(`server open PORT: ${env.HTTP_PORT}`);
  });
};

server();
