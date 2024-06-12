import { mock, mockDeep, MockProxy } from 'jest-mock-extended';
import { AccountRepository } from '../../../src/repositories/account.repository';
import { AuthService } from '../../../src/services/auth.service';
import { RedisService } from '../../../src/services/redis.service';
import { IAccount } from '../../../src/interfaces/account/account.interface';
import { IAuth } from '../../../src/interfaces/auth/auth.interface';
import { BadRequestException } from '../../../src/utils/custom-error.util';
import { BcryptUtil } from '../../../src/utils/bcrypt.util';
import { TokenManager } from '../../../src/utils/token-manager.util';
import env from '../../../src/config/env.config';

describe('AuthService', () => {
  let authService: AuthService;
  let mockRedisService: MockProxy<RedisService>;
  let mockAccountRepository: MockProxy<AccountRepository>;

  beforeEach(() => {
    mockRedisService = mockDeep<RedisService>();
    mockAccountRepository = mock<AccountRepository>();
    authService = new AuthService(mockAccountRepository, mockRedisService);
  });

  describe('login', () => {
    it('아이디가 일치하지 않으면 BadRequestException을 던진다', async () => {
      // given
      const loginInput: IAuth.ILogin = {
        email: 'wrongEmail@google.com',
        password: 'password',
      };

      // when
      // @ts-ignore
      mockAccountRepository.findAccountByEmail.mockResolvedValue(undefined);

      // then
      await expect(authService.login(loginInput)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('비밀번호가 일치하지 않으면 BadRequestException을 던진다', async () => {
      // given
      const loginInput: IAuth.ILogin = {
        email: 'email@google.com',
        password: 'wrongPassword',
      };

      // when
      // @ts-ignore
      mockAccountRepository.findAccountByEmail.mockResolvedValue({} as IAccount);
      jest.spyOn(BcryptUtil, 'compare').mockResolvedValue(false);

      // then
      await expect(authService.login(loginInput)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('로그인 성공 시 token의 payload 반환', async () => {
      // given
      const loginInput: IAuth.ILogin = {
        email: '',
        password: '',
      };
      const tokenPayload = {
        email: 'email@google.com',
        idx: 1,
      };

      // when
      // @ts-ignore
      mockAccountRepository.findAccountByEmail.mockResolvedValue(tokenPayload as IAccount);
      jest.spyOn(BcryptUtil, 'compare').mockResolvedValue(true);

      // then
      expect(await authService.login(loginInput)).toStrictEqual(tokenPayload);
    });
  });

  describe('createToken', () => {
    it('payload에 사용될 유저 정보를 받아 토큰을 생성한다.', async () => {
      // given
      const payload = {
        idx: 1,
        email: 'email@google.com',
      };
      const token = 'token';

      // when
      jest.spyOn(TokenManager, 'generate').mockReturnValue(token);

      // then
      await expect(authService.createToken(payload)).resolves.toBe(token);
    });

    it('토큰 생성 시 payload에 loggedInAt을 추가한다.', async () => {
      // given
      const payload = {
        idx: 1,
        email: '',
      };

      // when
      await authService.createToken(payload);

      // then
      jest.spyOn(TokenManager, 'generate').mockImplementation((jwtPayload) => {
        expect(jwtPayload.loggedInAt).toBeDefined();
        return 'token!';
      });
    });
  });

  describe('setLoginSession', () => {
    it('레디스에 세션 정보 저장', async () => {
      // given
      const accountIdx = 1;
      const token = 'token';

      // when
      const mockRedisSpy = jest.spyOn(mockRedisService.client, 'set');
      await authService.setLoginSession(accountIdx, token);

      // then
      expect(mockRedisSpy).toHaveBeenCalledTimes(1);
      expect(mockRedisSpy).toHaveBeenCalledWith(
        `session:${accountIdx}`,
        token,
        'EX',
        env.LOGIN_TTL,
      );
    });
  });

  describe('destorySession', () => {
    it('레디스에 현재 로그인 된 유저의 세션 정보를 삭제한다', async () => {
      // given
      const accountIdx = 1;

      // when
      const mockRedisSpy = jest.spyOn(mockRedisService.client, 'del');
      await authService.destorySession(accountIdx);

      // then
      expect(mockRedisSpy).toHaveBeenCalledTimes(1);
      expect(mockRedisSpy).toHaveBeenCalledWith(`session:${accountIdx}`);
    });
  });
});
