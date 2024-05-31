import { Position } from '@prisma/client';
import { IAccount } from '../../account/interface/account.interface';
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
  position: Position;

  /**
   * 가입 날짜
   */
  createdAt: string;
}
