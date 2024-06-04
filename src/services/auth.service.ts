import { Service } from 'typedi';
import { AccountRepository } from '../repositories/account.repository';
import { IAuth } from '../interfaces/auth/auth.interface';
import { BadRequestException } from '../utils/custom-error.util';
import { BcryptUtil } from '../utils/bcrypt.util';
import { IJwtPayload } from '../interfaces/auth/jwt-payload.interface';
import { TokenManager } from '../utils/token-manager.util';
import { RedisService } from './redis.service';
import env from '../config/env.config';

@Service()
export class AuthService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 사용자 여부 판단 후 payload정보 반환
   * @param loginInput 로그인 정보
   * @returns payload에 담길 정보
   */
  async login(loginInput: IAuth.ILogin): Promise<Pick<IJwtPayload, 'email' | 'idx'>> {
    // 이메일로 계정 찾기
    const foundAccount = await this.accountRepository.findAccountByEmail(loginInput.email);
    if (!foundAccount) {
      throw new BadRequestException('이메일 또는 비밀번호가 일치하지 않습니다(이메일)');
    }

    // 비밀번호 확인
    const isPasswordMatched = await BcryptUtil.compare(loginInput.password, foundAccount.password);
    if (!isPasswordMatched) {
      throw new BadRequestException('이메일 또는 비밀번호가 일치하지 않습니다(비밀번호)');
    }

    return {
      idx: foundAccount.idx,
      email: foundAccount.email,
    };
  }

  /**
   * 토큰 생성 후 로그인 세션 저장
   * @param payload 토큰 페이로드에 사용될 유저 정보
   */
  async createSession(payload: Pick<IJwtPayload, 'idx' | 'email'>): Promise<void> {
    const token = TokenManager.generate({ ...payload, loggedInAt: new Date() });

    await this.setLoginSession(payload.idx, token);

    return;
  }

  /**
   *
   * @param idx 사용자 인덱스
   * @param token 토큰
   */
  private async setLoginSession(idx: number, token: string): Promise<void> {
    await this.redisService.client.set(`session:${idx}`, token, 'EX', env.LOGIN_TTL);
  }
}
