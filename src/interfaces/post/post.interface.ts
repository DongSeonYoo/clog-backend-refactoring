import { IAccount } from '../account/account.interface';
import { IPostType } from './post-type.enum';

export interface IPost {
  /**
   * 게시글 인덱스
   */
  idx: number;

  /**
   * 작성자 인덱스
   */
  accountIdx: IAccount['idx'];

  /**
   * 게시글 종류
   */
  type: IPostType;

  /**
   * 게시글 제목
   */
  title: string;

  /**
   * 게시글 내용
   */
  content: string;

  /**
   * 게시글 생성 날짜
   */
  createdAt: Date;

  /**
   * 게시글 수정 날짜
   */
  updatedAt: Date;

  /**
   * 게시글 삭제 여부
   */
  deletedAt: Date | null;
}
