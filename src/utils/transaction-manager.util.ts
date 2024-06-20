import { Kysely, Transaction } from 'kysely';
import { DB } from 'kysely-codegen';
import { Inject, Service } from 'typedi';
import { KYSELY } from '../config/kysely.config';

@Service()
export class TransactionManager {
  constructor(@Inject(KYSELY) private readonly kysely: Kysely<DB>) {}

  async runTransaction<T>(cb: (tx: Transaction<DB>) => Promise<T>): Promise<T> {
    return this.kysely.transaction().execute(cb);
  }
}
