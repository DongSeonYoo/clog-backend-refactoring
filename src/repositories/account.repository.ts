import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { IAccount } from '../interfaces/account/account.interface';

@Service()
export class AccountRepository {
  constructor(@Inject('knex') private readonly knex: Knex) {}

  async findAccountByIdx(idx: IAccount['idx']) {
    return await this.knex<IAccount>('account_tb').select('*').where('idx', idx);
  }
}
