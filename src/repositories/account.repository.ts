import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { IAccount } from '../interfaces/account/account.interface';
import { IMajor } from '../interfaces/club/major.interface';

@Service()
export class AccountRepository {
  constructor(@Inject('knex') private readonly knex: Knex) {}

  /**
   * 사용자 인덱스로 사용자를 찾는다
   * @param accountIdx 사용자 인덱스
   */
  async findAccountByIdx(accountIdx: IAccount['idx']): Promise<IAccount | undefined> {
    const account = await this.knex('account')
      .select('*')
      .where({
        idx: accountIdx,
        deletedAt: null,
      })
      .first();

    return account;
  }

  /**
   * 이메일로 유저를 찾는다
   * @param email 이메일
   * @returns 유저 | null
   */
  async findAccountByEmail(email: IAccount['email']): Promise<IAccount | undefined> {
    const result = await this.knex('account')
      .select('*')
      .where({
        email,
        deletedAt: null,
      })
      .first();

    return result;
  }

  /**
   * 전공 인덱스를 받아 해당하는 전공이 존재하는지 확인
   * @param majorArr[] 전공 인덱스 배열
   * @returns 찾은 전공 인덱스 배열
   */
  async findMajorIdx(majorArr: Pick<IMajor, 'idx'>[]): Promise<Pick<IAccount, 'idx'>[]> {
    const foundMajorArr = await this.knex('major')
      .select('idx')
      .whereIn(
        'idx',
        majorArr.map((major) => major.idx),
      );

    return foundMajorArr;
  }

  /**
   * 회원가입 정보를 받아 사용자를 생성한다
   * @param signupInput 회원가입 정보
   * @returns 생성된 사용자 인덱스
   */
  async createAccount(signupInput: IAccount.ICreateAccount): Promise<IAccount['idx']> {
    const accountIdx = await this.knex.transaction(async (tx) => {
      const [createAccount] = await tx('account')
        .insert({
          name: signupInput.name,
          email: signupInput.email,
          password: signupInput.password,
          admissionYear: signupInput.admissionYear,
          personalColor: signupInput.personalColor,
        })
        .returning('idx');

      // 사용자는 여러 개의 전공을 가질 수 있음
      await tx('accountMajor').insert(
        signupInput.major.map((major) => ({
          accountIdx: createAccount.idx,
          majorIdx: major.idx,
        })),
      );

      return createAccount.idx;
    });

    return accountIdx;
  }

  /**
   * 사용자 프로필 조회
   * @param accountIdx 사용자 인덱스
   */
  async getAccountProfile(
    accountIdx: IAccount['idx'],
  ): Promise<Pick<IAccount, 'name' | 'personalColor' | 'admissionYear' | 'createdAt'>> {
    const [accountProfileInfo] = await this.knex('account')
      .select('name', 'personalColor', 'admissionYear', 'createdAt')
      .where('idx', accountIdx)
      .andWhere('deletedAt', null);

    return accountProfileInfo;
  }

  /**
   * 사용자의 전공 정보 조회
   * @param accountIdx 사용자 인덱스
   */
  async getAccountMajor(accountIdx: IAccount['idx']): Promise<Pick<IMajor, 'name'>[]> {
    const accountMajorList: Pick<IMajor, 'name'>[] = await this.knex('accountMajor')
      .select('major.name')
      .join('major', 'accountMajor.majorIdx', 'major.idx')
      .where('accountIdx', accountIdx);

    return accountMajorList.map((major) => ({
      name: major.name,
    }));
  }

  /**
   * 사용자 프로필 수정
   * @param accountInput 사용자 프로필 수정 정보
   * @param accountIdx 수정할 사용자 인덱스
   */
  async updateAccountInfo(
    accountInput: IAccount.IUpdateProfileRequest,
    accountIdx: IAccount['idx'],
  ) {
    await this.knex.transaction(async (tx) => {
      const { major, ...accountDetails } = accountInput;

      // account 테이블 업데이트
      await tx('account').update(accountDetails).where('idx', accountIdx);

      if (accountInput.major) {
        // 기존 accountMajor 레코드 삭제
        await tx('accountMajor').where('accountIdx', accountIdx).del();

        // accountMajor 테이블 업데이트
        await tx('accountMajor').insert(
          accountInput.major.map((major) => ({
            accountIdx,
            majorIdx: major.idx,
          })),
        );
      }
    });
  }

  /**
   * 사용자 삭제
   * @param accountIdx 사용자 인덱스
   */
  async deleteAccount(accountIdx: IAccount['idx']): Promise<void> {
    await this.knex('account').update('deletedAt', new Date()).where({
      idx: accountIdx,
      deletedAt: null,
    });

    return;
  }
}
