import { Service } from 'typedi';
import { AccountRepository } from '../repositories/account.repository';
import { IAccount } from '../interfaces/account/account.interface';
import { BadRequestException, NotFoundException } from '../utils/custom-error.util';
import { BcryptUtil } from '../utils/bcrypt.util';
import { generateRandomColorCode } from '../utils/personal-color.util';

@Service()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(
    input: Omit<IAccount.ICreateAccount, 'personalColor'>,
  ): Promise<Pick<IAccount, 'idx'>> {
    // 1. 이메일 중복 체크
    const foundAccount = await this.accountRepository.findAccountByEmail(input.email);
    if (foundAccount) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    // 2. 전공 인덱스 확인
    const result = await this.accountRepository.checkMajorList(input.major.map((e) => e.idx));
    if (result.length !== input.major.length) {
      throw new BadRequestException('존재하지 않는 전공이 포함되어 있습니다.');
    }

    // 3. 비밀번호 암호화
    const hashedPassword = await BcryptUtil.hash(input.password);

    // 4. personalColor 생성
    const personalColor = generateRandomColorCode();

    // 5. 회원 생성
    const accountIdx = await this.accountRepository.createAccount({
      ...input,
      password: hashedPassword,
      personalColor,
    });

    return {
      idx: accountIdx,
    };
  }

  /**
   * 사용자 프로필 조회
   * @param accountIdx 사용자 인덱스
   */
  async getAccountProfile(accountIdx: IAccount['idx']): Promise<IAccount.IAccountProfileResponse> {
    const profile = await this.accountRepository.getAccountProfile(accountIdx);

    if (!profile) {
      throw new NotFoundException('해당하는 사용자가 존재하지 않습니다.');
    }

    return {
      name: profile.name,
      admissionYear: profile.admissionYear,
      personalColor: profile.personalColor,
      majors: profile.majors,
      createdAt: profile.createdAt,
    };
  }

  /**
   * 사용자 프로필 수정
   * @param input 사용자 프로필 수정 정보
   * @param accountIdx 수정할 사용자 인덱스
   */
  async updateAccountProfile(
    input: IAccount.IUpdateProfileRequest,
    accountIdx: IAccount['idx'],
  ): Promise<void> {
    const foundAccountResult = await this.accountRepository.findAccountByIdx(accountIdx);
    if (!foundAccountResult) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    if (input.major) {
      const findMajorList = await this.accountRepository.checkMajorList(
        input.major.map((e) => e.idx),
      );
      if (findMajorList.length !== input.major.length) {
        throw new BadRequestException('존재하지 않는 전공이 포함되어 있습니다.');
      }
    }

    await this.accountRepository.updateAccountInfo(input, accountIdx);

    return;
  }

  /**
   * 사용자 탈퇴
   * @param accountIdx 사용자 인덱스
   */
  async deleteAccount(accountIdx: IAccount['idx']): Promise<void> {
    const foundAccountResult = await this.accountRepository.findAccountByIdx(accountIdx);
    if (!foundAccountResult) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    // 사용자 정보 업데이트 (deletedAt = new Date())
    await this.accountRepository.deleteAccount(accountIdx);

    return;
  }
}
