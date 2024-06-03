import { IAccount } from '../account/account.interface';
import { IPost } from '../post/post.interface';

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

  /**
   * 작성 날짜
   */
  createdAt: string;

  /**
   * 수정 날짜
   */

  /**
   * 삭제 여부
   */
  deletedAt: Date | null;
}
