import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { IClub } from '../interfaces/club/club.interface';
import { IBelong } from '../interfaces/club/belong.interface';
import { IBigCategory } from '../interfaces/club/big-category.interface';
import { ISmallCategory } from '../interfaces/club/small-category.interface';
import { IAccount } from '../interfaces/account/account.interface';
import { IPosition } from '../interfaces/club/club.enum';

@Service()
export class ClubRepository {
  constructor(@Inject('knex') private readonly knex: Knex) {}

  /**
   * 동아리 생성 및 회장 등록
   * @param input 동아리 정보
   * @returns 생성된 동아리 인덱스
   */
  async createClubWithInsertAdmin(
    input: IClub.ICreateClubRequest,
    accountIdx: IAccount['idx'],
  ): Promise<IClub['idx']> {
    const createdClubIdx = await this.knex.transaction(async (tx) => {
      // 동아리 생성
      const [clubIdx] = await this.knex('club').insert({
        ...input,
      });

      // 동아리 회장 등록
      await this.insertMember(
        {
          accountIdx,
          clubIdx,
          position: IPosition.ADMIN,
        },
        tx,
      );

      return clubIdx;
    });

    return createdClubIdx;
  }

  /**
   * 동아리 유저 생성
   * @param createMemberInput 유저 인덱스, 동아리 인덱스, 생성할 직급
   * @param tx? 트랜잭션 커넥션
   */
  async insertMember(
    createMemberInput: IClub.ICreateClubMember,
    tx?: Knex.Transaction,
  ): Promise<void> {
    await (tx ?? this.knex)('clubMember').insert({
      ...createMemberInput,
    });

    return;
  }

  /**
   * 동아리 소속이 존재하는지 확인
   */
  async getClubBelong(belongIdx: IBelong['idx']): Promise<IBelong | undefined> {
    const belong = await this.knex('belong').where('idx', belongIdx).first();

    return belong;
  }

  /**
   * 동아리 대분류가 존재하는지 확인
   */
  async getBigCategory(categoryIdx: IBigCategory['idx']): Promise<IBigCategory | undefined> {
    const bigCategory = await this.knex('bigCategory').where('idx', categoryIdx).first();

    return bigCategory;
  }

  /**
   * 동아리 소분류가 존재하는지 확인
   */
  async getSmallCategory(categoryIdx: ISmallCategory['idx']): Promise<ISmallCategory | undefined> {
    const smallCategory = await this.knex('bigCategory').where('idx', categoryIdx).first();

    return smallCategory;
  }

  /**
   * 동아리 이름 중복 확인
   * @param name 동아리 이름
   * @returns 결과
   */
  async checkDuplicateName(name: IClub['name']): Promise<string | undefined> {
    const foundClub = await this.knex('club').select('name').where('name', name).first();

    return foundClub?.name;
  }
}
