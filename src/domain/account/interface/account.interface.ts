import { IMajor } from './major.interface';

export interface IAccount {
  /**
   * 유저 인덱스
   */
  idx: number;

  /**
   * 이메일
   */
  email: string;

  /**
   * 비밀번호
   */
  password: string;

  /**
   * 이름
   */
  name: string;

  /**
   * 학번 (2자리 ex: 20)
   */
  admissionYear: number;

  /**
   * 학과
   */
  createdAt: Date;

  /**
   * 생성일
   */
  updatedAt: Date;
}

export namespace IAccount {
  export interface ICreateAccount
    extends Pick<IAccount, 'email' | 'password' | 'name' | 'admissionYear'> {
    majorIdx: IMajor['idx'];
  }
}
