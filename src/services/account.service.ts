import { Service } from 'typedi';
import { AccountRepository } from '../repositories/account.repository';
import { IAccount } from '../interfaces/account/account.interface';

@Service()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async someFunc(idx: IAccount['idx']) {
    return await this.accountRepository.findAccountByIdx(idx);
  }
}
