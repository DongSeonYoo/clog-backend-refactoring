import { IAccount } from '../account/account.interface';

export namespace IAuth {
  export interface ILogin extends Pick<IAccount, 'email' | 'password'> {}
}
