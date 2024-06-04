import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { IAccount } from '../interfaces/account/account.interface';
import { IMajor } from '../interfaces/club/major.interface';
import { IAccountMajor } from '../interfaces/account/account-major.interface';
import IAccountProfileResponse = IAccount.IAccountProfileResponse;

@Service()
export class AccountRepository {
  constructor(@Inject('knex') private readonly knex: Knex) {}

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
  async getAccountProfile(accountIdx: IAccount['idx']): Promise<IAccount.IAccountProfileResponse> {
    // 사용자 정보 조회
    const [accountProfileInfo] = await this.knex('account')
      .select('name', 'personalColor', 'admissionYear', 'createdAt')
      .where('idx', accountIdx)
      .andWhere('deletedAt', null);

    // 사용자의 전공 정보 조회
    const majorNameList: Pick<IMajor, 'name'>[] = await this.knex('accountMajor')
      .select('major.name')
      .join('major', 'accountMajor.majorIdx', 'major.idx')
      .where('accountIdx', accountIdx);

    return {
      ...accountProfileInfo,
      major: majorNameList,
    };
  }
}
