import { PostType } from '@prisma/client';
import { IAccount } from '../../account/interface/account.interface';

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
  type: PostType;

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
}
