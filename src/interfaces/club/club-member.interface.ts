import { IAccount } from '../account/account.interface';
import { IPosition } from './club.enum';
import { IClub } from './club.interface';

export interface IClubMember {
  /**
   * 동아리 유저 인덱스
   */
  idx: IAccount['idx'];

  /**
   * 동아리 인덱스
   */
  clubIdx: IClub['idx'];

  /**
   * 직급
   */
  position: IPosition;

  /**
   * 가입 날짜
   */
  createdAt: string;

  /**
   * 삭제 여부
   */
  deletedAt: Date | null;
}
