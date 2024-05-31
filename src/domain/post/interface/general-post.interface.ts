import { IClubBoard } from '../../club/interface/club-board.interface';
import { IPost } from './post.interface';

export interface IGeneralPost extends IPost {
  /**
   * 게시글 인덱스
   */
  postIdx: IPost['idx'];

  /**
   * 동아리 게시판 인덱스
   */
  boardIdx: IClubBoard['idx'];
}

export namespace IGeneralPost {}
