import { Service } from 'typedi';
import { PrismaService } from '../prisma/prisma.service';
import { IAccount } from './interface/account.interface';
import { BadRequestException } from '../../util/custom-error.util';
import { BcryptUtil } from '../../util/bcrypt.util';
import { generateRandomColorCode } from '../../util/personal-color.util';

@Service()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 회원 가입
   * @param signupInput 회원가입 정보
   * @returns 생성된 사용자 인덱스
   */
  async createAccount(signupInput: IAccount.ICreateAccount): Promise<IAccount['idx']> {
    // 학과 존재 여부 체크
    const findMajor = await this.prismaService.major.findUnique({
      select: {
        idx: true,
      },
      where: {
        idx: signupInput.majorIdx,
      },
    });

    if (!findMajor?.idx) {
      throw new BadRequestException('존재하지 않는 학과입니다.');
    }

    // 이메일 중복 체크
    const findExistEmail = await this.prismaService.account.findFirst({
      select: {
        email: true,
      },
      where: {
        email: signupInput.email,
        deletedAt: null,
      },
    });

    if (!!findExistEmail) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    // 퍼스널 컬러 생성
    const personalColor = generateRandomColorCode();

    // 비밀번호 암호화
    const hashedPassword = await BcryptUtil.hash(signupInput.password);

    // 유저 생성 트랜잭션 시작
    const createAccountTx = await this.prismaService.$transaction(async (tx) => {
      // 유저 생성
      const createdAccount = await tx.account.create({
        data: {
          email: signupInput.email,
          password: hashedPassword,
          name: signupInput.name,
          admissionYear: signupInput.admissionYear,
          personalColor: personalColor,
        },
        select: {
          idx: true,
        },
      });

      // 유저-학과 연결
      await tx.accountMajor.create({
        data: {
          accountIdx: createdAccount.idx,
          majorIdx: signupInput.majorIdx,
        },
      });

      return createdAccount;
    });

    return createAccountTx.idx;
  }
}
