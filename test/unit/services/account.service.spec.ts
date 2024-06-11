import { mock, MockProxy } from 'jest-mock-extended';
import { IAccount } from '../../../src/interfaces/account/account.interface';
import { AccountRepository } from '../../../src/repositories/account.repository';
import { AccountService } from '../../../src/services/account.service';
import { BadRequestException, NotFoundException } from '../../../src/utils/custom-error.util';
import { IMajor } from '../../../src/interfaces/club/major.interface';

describe('AccountService', () => {
  let accountService: AccountService;
  let mockAccountRepository: MockProxy<AccountRepository>;

  beforeEach(() => {
    mockAccountRepository = mock<AccountRepository>();
    accountService = new AccountService(mockAccountRepository);
  });

  describe('getAccountProfile', () => {
    let getAccountProfileFunc;

    it('사용자의 프로필을 가져온다', async () => {
      // given
      const accountIdx = 1;
      const expectedResult: IAccount.IAccountProfileResponse = {
        name: 'test',
        admissionYear: 21,
        personalColor: '#ffffff',
        createdAt: new Date(),
        majors: ['컴퓨터공학', '소프트웨어학'],
      };

      // when
      mockAccountRepository.getAccountProfile.mockResolvedValue({
        ...expectedResult,
      });
      getAccountProfileFunc = accountService.getAccountProfile(accountIdx);

      // then
      await expect(getAccountProfileFunc).resolves.toEqual(expectedResult);
    });

    it('사용자가 존재하지 않을 경우 NotFoundException이 발생된다', async () => {
      // given
      const accountIdx = 1;

      // when
      mockAccountRepository.getAccountProfile.mockResolvedValue(undefined);
      getAccountProfileFunc = accountService.getAccountProfile(accountIdx);

      // then
      await expect(getAccountProfileFunc).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('createAccount', () => {
    // given
    const signupInput: Omit<IAccount.ICreateAccount, 'personalColor'> = {
      email: 'test@google.com',
      password: 'test',
      name: 'test',
      major: [{ idx: 1 }, { idx: 2 }],
      admissionYear: 21,
    };
    let createAccountFunc;

    it('중복된 이메일이 존재 할 경우 BadRequestException이 발생된다', async () => {
      // when
      mockAccountRepository.findAccountByEmail.mockResolvedValue({} as IAccount);
      createAccountFunc = accountService.createAccount(signupInput);

      // then
      await expect(createAccountFunc).rejects.toBeInstanceOf(BadRequestException);
    });

    it('존재하지 않는 전공이 포함되어 있을 경우 BadRequestException이 발생된다', async () => {
      // when
      mockAccountRepository.checkMajorList.mockResolvedValue([]);

      // then
      await expect(accountService.createAccount(signupInput)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('updateAccountProfile', () => {
    let updateAccountProfileFunc;

    it('사용자의 프로필을 수정한다', async () => {
      // given
      const accountIdx = 1;
      const updateInput: IAccount.IUpdateProfileRequest = {
        name: 'test',
        admissionYear: 21,
        major: [{ idx: 1 }],
      };

      // when
      const updateAccountInfoSpy = jest.spyOn(mockAccountRepository, 'updateAccountInfo');
      mockAccountRepository.findAccountByIdx.mockResolvedValue({} as IAccount);
      mockAccountRepository.checkMajorList.mockResolvedValue([{} as IMajor['idx']]);
      updateAccountProfileFunc = accountService.updateAccountProfile(updateInput, accountIdx);

      // then
      await expect(updateAccountProfileFunc).resolves.toBeUndefined();
      expect(updateAccountInfoSpy).toHaveBeenCalledWith(updateInput, accountIdx);
    });

    it('존재하지 않는 사용자일 경우 NotFoundException이 발생된다', async () => {
      // given
      const accountIdx = 1;

      // when
      mockAccountRepository.findAccountByIdx.mockResolvedValue(undefined);
      updateAccountProfileFunc = accountService.updateAccountProfile({}, accountIdx);

      // then
      await expect(updateAccountProfileFunc).rejects.toBeInstanceOf(NotFoundException);
    });

    it('존재하지 않는 전공이 포함되어있으면 BadRequestException이 발생된다', async () => {
      // given
      const major = [
        {
          idx: 1,
        },
        {
          idx: 13333,
        },
      ];

      // when
      // @ts-ignore
      mockAccountRepository.findMajorIdx.mockResolvedValue([]);
      updateAccountProfileFunc = accountService.updateAccountProfile({ major }, 1);

      // then
      await expect(updateAccountProfileFunc).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('deleteAccount', () => {
    let accountIdx;
    let deleteAccountFunc;

    it('존재하지 않는 회원 인덱스일 경우 NotFoundException을 던진다', async () => {
      // given
      accountIdx = -1;

      // when
      mockAccountRepository.findAccountByIdx.mockResolvedValue(undefined);
      deleteAccountFunc = accountService.deleteAccount(accountIdx);

      // then
      await expect(deleteAccountFunc).rejects.toBeInstanceOf(NotFoundException);
    });

    it('회원을 탈퇴한다', async () => {
      // given
      accountIdx = 1;

      // when
      mockAccountRepository.findAccountByIdx.mockResolvedValue({} as IAccount);
      mockAccountRepository.deleteAccount.mockResolvedValue();
      deleteAccountFunc = await accountService.deleteAccount(accountIdx);

      // then
      expect(deleteAccountFunc).resolves;
    });
  });
});
