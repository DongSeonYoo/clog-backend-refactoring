import { Kysely, Transaction } from 'kysely';
import { DB } from 'kysely-codegen';
import { Inject, Service } from 'typedi';
import { IBelong } from '../interfaces/club/belong.interface';
import { IBigCategory } from '../interfaces/club/big-category.interface';
import { ISmallCategory } from '../interfaces/club/small-category.interface';
import { IClub } from '../interfaces/club/club.interface';
import { IAccount } from '../interfaces/account/account.interface';
import { IPosition } from '../interfaces/club/club.enum';

@Service()
export class ClubRepository {
  constructor(@Inject('kysely') private readonly kysely: Kysely<DB>) {}

  /**
   * 소속 인덱스로 소속 조회
   * @param belongIdx 소속 인덱스
   * @returns 소속 정보
   */
  async getBelongByIdx(belongIdx: IBelong['idx']): Promise<IBelong | undefined> {
    const belongResult = await this.kysely
      .selectFrom('belong')
      .selectAll()
      .where('belong.idx', '=', belongIdx)
      .executeTakeFirst();

    return belongResult;
  }

  /**
   * 대분류 인덱스로 대분류 조회
   * @param categoryIdx 대분류 인덱스
   * @returns 대분류 정보
   */
  async getBigCategoryByIdx(categoryIdx: IBigCategory['idx']): Promise<IBigCategory | undefined> {
    const categoryResult = await this.kysely
      .selectFrom('bigCategory')
      .selectAll()
      .where('bigCategory.idx', '=', categoryIdx)
      .executeTakeFirst();

    return categoryResult;
  }

  /**
   * 소분류 인덱스로 소분류 조회
   * @param categoryIdx 소분류 인덱스
   * @returns 소분류 정보
   */
  async getSmallCategoryByIdx(
    categoryIdx: ISmallCategory['idx'],
  ): Promise<ISmallCategory | undefined> {
    const categoryResult = await this.kysely
      .selectFrom('smallCategory')
      .selectAll()
      .where('smallCategory.idx', '=', categoryIdx)
      .executeTakeFirst();

    return categoryResult;
  }

  /**
   * 동아리 이름 중복 확인
   * @param name 동아리 이름
   * @returns 동아리 이름 중복 여부
   */
  async checkDuplicateClubName(name: IClub['name']): Promise<boolean> {
    const clubNameResult = await this.kysely
      .selectFrom('club')
      .select('club.name')
      .where('club.name', '=', name)
      .where('club.deletedAt', 'is', null)
      .executeTakeFirst();

    return clubNameResult ? true : false;
  }

  /**
   * 동아리 생성
   * @param input 동아리 정보
   * @param accountIdx 유저 인덱스
   * @returns 생성된 동아리 인덱스
   */
  async createClubWithInsertAdmin(
    input: IClub.ICreateClubRequest,
    accountIdx: IAccount['idx'],
  ): Promise<IClub['idx']> {
    const createdClubTx = await this.kysely.transaction().execute(async (tx) => {
      const createdClub = await tx
        .insertInto('club')
        .values({
          ...input,
        })
        .returning('club.idx')
        .executeTakeFirstOrThrow();

      await this.insertMemberToClub(
        {
          accountIdx,
          clubIdx: createdClub.idx,
          position: IPosition.ADMIN,
        },
        tx,
      );

      return createdClub;
    });

    return createdClubTx.idx;
  }

  /**
   * 동아리 멤버 추가
   * @param input 추가 정보
   * @param tx? 트랜잭션 객체 (optional)
   * @returns 생성된 동아리 멤버
   */
  async insertMemberToClub(
    input: IClub.ICreateClubMember,
    tx?: Transaction<DB>,
  ): Promise<IAccount['idx']> {
    const clubMember = await (tx ?? this.kysely)
      .insertInto('clubMember')
      .values(input)
      .returning('clubMember.accountIdx')
      .executeTakeFirstOrThrow();

    return clubMember.accountIdx;
  }
}
