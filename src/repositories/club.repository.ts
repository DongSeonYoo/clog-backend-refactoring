import { Kysely, Transaction } from 'kysely';
import { DB } from 'kysely-codegen';
import { Inject, Service } from 'typedi';
import { IBelong } from '../interfaces/club/belong.interface';
import { IBigCategory } from '../interfaces/club/big-category.interface';
import { ISmallCategory } from '../interfaces/club/small-category.interface';
import { IClub } from '../interfaces/club/club.interface';
import { IAccount } from '../interfaces/account/account.interface';
import { IPosition } from '../interfaces/club/club.enum';
import { IJoinRequest } from '../interfaces/club/join-request.interface';
import { IClubMember } from '../interfaces/club/club-member.interface';

@Service()
export class ClubRepository {
  constructor(@Inject('kysely') private readonly kysely: Kysely<DB>) {}

  /**
   * 동아리 인덱스로 동아리 조회
   * @param clubIdx 동아리 인덱스
   * @returns 동아리 정보
   */
  async getClubByIdx(clubIdx: IClub['idx']): Promise<IClub | undefined> {
    const clubResult = await this.kysely
      .selectFrom('club')
      .selectAll()
      .where('club.idx', '=', clubIdx)
      .where('club.deletedAt', 'is', null)
      .executeTakeFirst();

    return clubResult;
  }

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
    const createMemberResult = await (tx ?? this.kysely)
      .insertInto('clubMember')
      .values(input)
      .returning('clubMember.accountIdx')
      .executeTakeFirstOrThrow();

    return createMemberResult.accountIdx;
  }

  /**
   * 자기가 가입한 동아리 정보를 조회
   * @param accountIdx 유저 인덱스
   * @returns 가입되어있는 동아리 정보 리스트
   */
  async getMyClubList(
    accountIdx: IAccount['idx'],
  ): Promise<Pick<IClubMember, 'clubIdx' | 'position'>[]> {
    const getMemberResult = await this.kysely
      .selectFrom('clubMember')
      .select(['clubMember.clubIdx', 'clubMember.position'])
      .where('clubMember.accountIdx', '=', accountIdx)
      .where('clubMember.deletedAt', 'is', null)
      .execute();

    return getMemberResult;
  }

  /**
   * 가입 요청 조회
   * @param accountIdx 유저 인덱스
   * @param clubIdx 동아리 인덱스
   * @returns 가입 요청 정보
   */
  async getJoinRequestByAccountIdx(accountIdx: IAccount['idx'], clubIdx: IClub['idx']) {
    const requestResult = await this.kysely
      .selectFrom('joinRequest')
      .select('joinRequest.idx')
      .where('joinRequest.accountIdx', '=', accountIdx)
      .where('joinRequest.clubIdx', '=', clubIdx)
      .where('joinRequest.deletedAt', 'is', null)
      .executeTakeFirst();

    return requestResult;
  }
  /**
   * 가입 요청 생성
   * @param clubIdx 동아리 인덱스
   * @param accountIdx 유저 인덱스
   * @returns 생성된 가입 요청 인덱스
   */
  async insertJoinRequest(
    clubIdx: IClub['idx'],
    accountIdx: IAccount['idx'],
  ): Promise<IJoinRequest['idx']> {
    const requestResult = await this.kysely
      .insertInto('joinRequest')
      .values({
        clubIdx,
        accountIdx,
      })
      .returning('joinRequest.idx')
      .executeTakeFirstOrThrow();

    return requestResult.idx;
  }
}
