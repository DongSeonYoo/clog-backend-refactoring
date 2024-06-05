import { Knex } from 'knex';

const testDbConfig: { [key: string]: Knex.Config } = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:', // 메모리 내 데이터베이스 사용
    },
    useNullAsDefault: true, // SQLite3의 기본값 설정
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};

export default testDbConfig;
