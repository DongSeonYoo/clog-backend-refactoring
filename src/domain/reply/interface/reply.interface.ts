import { IAccount } from '../../account/interface/account.interface';
import { IComment } from '../../coment/interface/comment.interface';

export interface IReply {
  /**
   * 답글 인덱스
   */
  idx: number;

  /**
   * 작성자 인덱스
   */
  accountIdx: IAccount['idx'];

  /**
   * 댓글 인덱스
   */
  commentIdx: IComment['idx'];

  /**
   * 답글 내용
   */
  content: string;

  /**
   * 작성일
   */
  createdAt: Date;

  /**
   * 수정일
   */
  updatedAt: Date;
}
