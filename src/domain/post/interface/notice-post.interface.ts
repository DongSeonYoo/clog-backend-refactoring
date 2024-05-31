import { IPost } from './post.interface';
import { IClub } from '../../club/interface/club.interface';

export interface INoticePost extends IPost {
  /**
   * 게시글 인덱스
   */
  postIdx: IPost['idx'];

  /**
   * 동아리 인덱스
   */
  clubIdx: IClub['idx'];

  /**
   * 게시글 고정 여부
   */
  isFixed: boolean;
}
