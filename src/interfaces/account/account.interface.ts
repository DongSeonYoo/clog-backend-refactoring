import { IMajor } from '../club/major.interface';

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
   * 퍼스널 컬러
   */
  personalColor: string;

  /**
   * 학과
   */
  createdAt: Date;

  /**
   * 생성일
   */
  updatedAt: Date;

  /**
   * 삭제 여부
   */
  deletedAt: Date | null;
}

export namespace IAccount {
  export interface ICreateAccount
    extends Pick<IAccount, 'email' | 'password' | 'name' | 'admissionYear' | 'personalColor'> {
    major: Pick<IMajor, 'idx'>[];
  }

  export interface IAccountProfileResponse
    extends Pick<IAccount, 'name' | 'personalColor' | 'admissionYear' | 'createdAt'> {
    majors: IMajor['name'][];
  }

  export interface IUpdateProfileRequest {
    name?: string;
    admissionYear?: number;
    major?: Pick<IMajor, 'idx'>[];
  }
}
