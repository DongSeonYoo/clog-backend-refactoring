import { IAccount } from '../../account/interface/account.interface';
import { IClub } from './club.interface';

export interface IJoinRequest {
  /**
   * 가입 신청 인덱스
   */
  idx: IAccount['idx'];

  /**
   * 동아리 인덱스
   */
  clubIdx: IClub['idx'];

  /**
   * 신청 날짜
   */
  createdAt: string;
}
