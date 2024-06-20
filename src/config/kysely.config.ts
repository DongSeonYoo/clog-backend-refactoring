import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { DB } from 'kysely-codegen';
import { Pool } from 'pg';
import { Container } from 'typedi';
import env from './env.config';

export const KYSELY = 'KYSELY';

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: env.DATABASE_URL,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});

// Kysely 의존성 등록
Container.set(KYSELY, db);
