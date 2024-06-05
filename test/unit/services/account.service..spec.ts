import { mock, MockProxy } from 'jest-mock-extended';
import { IAccount } from '../../../src/interfaces/account/account.interface';
import { AccountRepository } from '../../../src/repositories/account.repository';
import { AccountService } from '../../../src/services/account.service';
import { BadRequestException } from '../../../src/utils/custom-error.util';

describe('AccountService', () => {
  let accountService: AccountService;
  let mockAccountRepository: MockProxy<AccountRepository>;

  beforeEach(() => {
    mockAccountRepository = mock<AccountRepository>();
    accountService = new AccountService(mockAccountRepository);
  });

  describe('getAccountProfile', () => {
    it('사용자의 프로필을 가져온다', async () => {
      // given
      const accountIdx = 1;
      const expectedResult: IAccount.IAccountProfileResponse = {
        name: 'test',
        admissionYear: 21,
        personalColor: '#ffffff',
        createdAt: new Date(),
        major: [
          {
            name: '컴퓨터공학',
          },
        ],
      };
      const expectAccountInfo = {
        name: 'test',
        admissionYear: 21,
        personalColor: '#ffffff',
        createdAt: new Date(),
      };
      const expectMajorInfo = [
        {
          name: '컴퓨터공학',
        },
      ];

      // when
      mockAccountRepository.getAccountProfile.mockResolvedValue(expectAccountInfo);
      mockAccountRepository.getAccountMajor.mockResolvedValue(expectMajorInfo);

      // then
      expect(await accountService.getAccountProfile(accountIdx)).toStrictEqual(expectedResult);
    });
  });

  describe('createAccount', () => {
    // given
    const signupInput: Omit<IAccount.ICreateAccount, 'personalColor'> = {
      email: 'test@google.com',
      password: 'test',
      name: 'test',
      major: [{ idx: 1 }],
      admissionYear: 21,
    };

    it('중복된 이메일이 존재 할 경우 BadRequestException이 발생된다', async () => {
      // when
      mockAccountRepository.findAccountByEmail.mockResolvedValue({} as IAccount);

      // then
      await expect(accountService.createAccount(signupInput)).rejects.toThrow(BadRequestException);
    });
  });
});
