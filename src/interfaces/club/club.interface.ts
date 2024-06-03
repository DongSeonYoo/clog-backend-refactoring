import { IBelong } from './belong.interface';
import { IBigCategory } from './big-category.interface';
import { ISmallCategory } from './small-category.interface';

export interface IClub {
  /**
   * 동아리 인덱스
   */
  idx: number;

  /**
   * 소속 인덱스
   */
  belongIdx: IBelong['idx'];

  /**
   * 대분류 인덱스
   */
  bigCategoryIdx: IBigCategory['idx'];

  /**
   * 소분류 인덱스
   */
  smallCategoryIdx: ISmallCategory['idx'];

  /**
   * 동아리 이름
   */
  name: string;

  /**
   * 동아리 요약
   */
  summary: string;

  /**
   * 가입 신청 허용 유무
   */
  isRecruit: boolean;

  /**
   * 동아리 프로필 이미지
   */
  profileImage: string;

  /**
   * 동아리 배너 이미지
   */
  bannerImage: string;

  /**
   * 생성 일
   */
  createdAt: Date;

  /**
   * 수정 일
   */
  updatedAt: Date;
}
