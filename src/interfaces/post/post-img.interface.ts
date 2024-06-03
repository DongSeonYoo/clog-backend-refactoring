import { IPost } from './post.interface';

export interface IPostImg {
  /**
   * 포스트 이미지 인덱스
   */
  idx: number;

  /**
   * 포스트 인덱스
   */
  postIdx: IPost['idx'];

  /**
   * 이미지 경로
   */
  url: string;
}
