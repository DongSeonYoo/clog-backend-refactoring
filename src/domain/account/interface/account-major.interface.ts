import { IAccount } from './account.interface';
import { IMajor } from './major.interface';

export interface IAccountMajor {
  /**
   * 유저 인덱스
   */
  accountIdx: IAccount['idx'];

  /**
   * 학과 인덱스
   */
  majorIdx: IMajor['idx'];
}
