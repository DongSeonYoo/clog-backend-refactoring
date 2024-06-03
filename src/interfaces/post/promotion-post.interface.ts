import { IClub } from '../club/club.interface';
import { IPost } from './post.interface';

export interface IPromotionPost extends IPost {
  /**
   * 게시글 인덱스
   */
  postIdx: IPost['idx'];

  /**
   * 동아리 인덱스
   */
  clubIdx: IClub['idx'];
}
