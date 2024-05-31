import { IAccount } from '../../account/interface/account.interface';
import { IPost } from '../../post/interface/post.interface';

export interface IComment {
  /**
   * 댓글 인덱스
   */
  idx: number;

  /**
   * 게시글 인덱스
   */
  postIdx: IPost['idx'];

  /**
   * 작성자 인덱스
   */
  accountIdx: IAccount['idx'];

  /**
   * 댓글 내용
   */
  content: string;
}
