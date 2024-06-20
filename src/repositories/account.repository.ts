import { Kysely, sql } from 'kysely';
import { DB } from 'kysely-codegen';
import { Inject, Service } from 'typedi';
import { IAccount } from '../interfaces/account/account.interface';
import { IMajor } from '../interfaces/club/major.interface';
import { KYSELY } from '../config/kysely.config';

@Service()
export class AccountRepository {
  constructor(@Inject(KYSELY) private readonly kysely: Kysely<DB>) {}

  /**
   * 이메일로 계정 찾기
   * @param email 이메일
   * @returns 계정 정보
   */
  async findAccountByEmail(email: IAccount['email']): Promise<IAccount | undefined> {
    const accountResult = await this.kysely
      .selectFrom('account')
      .selectAll()
      .where('account.email', '=', email)
      .where('account.deletedAt', 'is', null)
      .executeTakeFirst();

    return accountResult;
  }

  /**
   * 사용자 프로필 조회
   * @param accountIdx 사용자 인덱스
   * @returns 사용자 프로필 정보
   */
  async getAccountProfile(
    accountIdx: IAccount['idx'],
  ): Promise<IAccount.IAccountProfileResponse | undefined> {
    const profileResult = await this.kysely
      .selectFrom('accountMajor')
      .innerJoin('account', 'accountMajor.accountIdx', 'account.idx')
      .innerJoin('major', 'accountMajor.majorIdx', 'major.idx')
      .select([
        'account.name',
        'account.personalColor',
        'account.admissionYear',
        'account.createdAt',
        sql<string[]>`array_agg(major.name)`.as('majors'),
      ])
      .groupBy([
        'account.name',
        'account.personalColor',
        'account.admissionYear',
        'account.createdAt',
      ])
      .where('accountMajor.accountIdx', '=', accountIdx)
      .where('account.deletedAt', 'is', null)
      .executeTakeFirst();

    return profileResult;
  }

  /**
   * 전공 인덱스 확인
   * @param majorIdxList 전공 인덱스 리스트
   * @returns 존재하는 전공 인덱스 리스트
   */
  async checkMajorList(majorIdxList: IMajor['idx'][]): Promise<IMajor['idx'][]> {
    const majorList = await this.kysely
      .selectFrom('major')
      .select('idx')
      .where('idx', 'in', majorIdxList)
      .execute();

    return majorList.map((e) => e.idx);
  }

  /**
   * 사용자 생성
   * @param accountInput 사용자 생성 정보
   * @returns 사용자 인덱스
   */
  async createAccount(accountInput: IAccount.ICreateAccount): Promise<IAccount['idx']> {
    const createAccountTx = await this.kysely.transaction().execute(async (tx) => {
      const createUser = await tx
        .insertInto('account')
        .values({
          name: accountInput.name,
          admissionYear: accountInput.admissionYear,
          email: accountInput.email,
          password: accountInput.password,
          personalColor: accountInput.personalColor,
        })
        .returning('account.idx')
        .executeTakeFirstOrThrow();

      await tx
        .insertInto('accountMajor')
        .values(
          accountInput.major.map((e) => ({
            accountIdx: createUser.idx,
            majorIdx: e.idx,
          })),
        )
        .execute();

      return createUser;
    });

    return createAccountTx.idx;
  }

  /**
   * 사용자 인덱스로 계정 찾기
   * @param accountIdx 계정 인덱스
   * @returns 계정 정보
   */
  async findAccountByIdx(accountIdx: IAccount['idx']): Promise<IAccount | undefined> {
    const accountResult = await this.kysely
      .selectFrom('account')
      .selectAll()
      .where('idx', '=', accountIdx)
      .where('account.deletedAt', 'is', null)
      .executeTakeFirst();

    return accountResult;
  }

  /**
   * 사용자 정보 수정
   * @param input 수정 정보
   * @param accountIdx 사용자 인덱스
   */
  async updateAccountInfo(
    input: IAccount.IUpdateProfileRequest,
    accountIdx: IAccount['idx'],
  ): Promise<void> {
    await this.kysely.transaction().execute(async (tx) => {
      await tx
        .updateTable('account')
        .set({
          name: input.name,
          admissionYear: input.admissionYear,
        })
        .where('idx', '=', accountIdx)
        .where('deletedAt', 'is', null)
        .execute();

      if (input.major) {
        await tx.deleteFrom('accountMajor').where('accountIdx', '=', accountIdx).execute();

        await tx
          .insertInto('accountMajor')
          .values(
            input.major.map((e) => ({
              accountIdx,
              majorIdx: e.idx,
            })),
          )
          .execute();
      }
    });

    return;
  }

  /**
   * 사용자 탈퇴
   * @param accountIdx 사용자 인덱스
   * @returns 사용자 정보
   */
  async deleteAccount(accountIdx: IAccount['idx']): Promise<void> {
    await this.kysely
      .updateTable('account')
      .set({
        deletedAt: new Date(),
      })
      .where('idx', '=', accountIdx)
      .where('deletedAt', 'is', null)
      .execute();

    return;
  }
}
