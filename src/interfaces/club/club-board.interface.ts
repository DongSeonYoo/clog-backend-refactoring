import { IClub } from './club.interface';

export interface IClubBoard {
  /**
   * 게시판 인덱스
   */
  idx: number;

  /**
   * 동아리 인덱스
   */
  clubIdx: IClub['idx'];

  /**
   * 게시판 이름
   */
  name: string;

  /**
   * 게시판 생성일
   */
  createdAt: Date;

  /**
   * 삭제 여부
   */
  deletedAt: Date | null;
}
