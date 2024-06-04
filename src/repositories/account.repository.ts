import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { IAccount } from '../interfaces/account/account.interface';
import { IMajor } from '../interfaces/club/major.interface';
import { IAccountMajor } from '../interfaces/account/account-major.interface';

@Service()
export class AccountRepository {
  constructor(@Inject('knex') private readonly knex: Knex) {}

  /**
   * 이메일로 유저를 찾는다
   * @param email 이메일
   * @returns 유저 | null
   */
  async findAccountByEmail(email: IAccount['email']): Promise<IAccount | undefined> {
    const [result] = await this.knex<IAccount>('account_tb').select('*').where({
      email,
      deletedAt: null,
    });

    return result;
  }

  /**
   * 전공 인덱스를 받아 해당하는 전공이 존재하는지 확인
   * @param majorArr[] 전공 인덱스 배열
   * @returns 찾은 전공 인덱스 배열
   */
  async findMajorIdx(majorArr: Pick<IMajor, 'idx'>[]): Promise<Pick<IAccount, 'idx'>[]> {
    const foundMajorArr = await this.knex('major_tb')
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
      const [createAccount] = await tx('account_tb')
        .insert({
          name: signupInput.name,
          email: signupInput.email,
          password: signupInput.password,
          admissionYear: signupInput.admissionYear,
          personalColor: signupInput.personalColor,
        })
        .returning('idx');

      // 사용자는 여러 개의 전공을 가질 수 있음
      await tx('account_major_tb').insert(
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
   * 1. Join시 select쪽에서 타입추론이 안된다.. 그래서 조인 된 테이블에 같은 이름 나오면 런타임에러 터진다.
   * 2. 모든 테이블에 외래키가 (부모테이블이름)Idx로 되어있는데 knex 테이블에 타입 지정 시에 그대로 엔티티 인터페이스 박아버리면 프로퍼티는 카멜케이스가 되어버립니다... 만약 이렇게 되면 knex.config에 가서 wrapIdentifier속성에 camelToSnakeCase함수 박아서 카멜 -> 스네이크로 바꿔줘야댐
   * 3. 어플리케이션단에서는 카멜, db스키마는 스네이크잖아? 쿼리빌더에서 쿼리날릴때는 어플리케이션이라고봐도되는건가..
   * - 3-1. select('property_name').from('some_table').where('idx', 1);
   * - 3-2. select('propertyName').from('someTable').where('idx', 1);
   * 에반데...
   */
  async getAccountProfile(accountIdx: IAccount['idx']): Promise<void> {
    const result = await this.knex('account_major_tb')
      .select()
      .from('account_major_tb')
      .join('account_tb', 'account_major_tb.accountIdx', 'account_tb.idx')
      .join('major_tb', 'account_major_tb.majorIdx', 'major_tb.idx')
      .where('accountIdx', accountIdx);

    console.log(result);
  }
}
