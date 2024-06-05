import Container from 'typedi';
import knex, { Knex } from 'knex';
import env from './env.config';
import { knexSnakeCaseMappers } from 'objection';

const dbConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'dongseon',
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  },
  ...knexSnakeCaseMappers(),
  wrapIdentifier: (value, origImpl, queryContext) => {
    const camelToSnakeCase = (str: string) =>
      str.replace(/[A-Z]/g, (letter) => {
        return `_${letter.toLowerCase()}`;
      });

    return camelToSnakeCase(value);
  },
};

// knex 의존성 등록
Container.set('knex', knex(dbConfig));
