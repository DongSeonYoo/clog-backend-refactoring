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
      const getAccountProfileFunc = accountService.getAccountProfile(accountIdx);

      // then
      await expect(getAccountProfileFunc).resolves.toEqual(expectedResult);
    });

    it('사용자가 존재하지 않을 경우 NotFoundException이 발생된다', async () => {
      // given
      const accountIdx = 1;

      // when
      mockAccountRepository.getAccountProfile.mockResolvedValue(undefined);
      const getAccountProfileFunc = accountService.getAccountProfile(accountIdx);

      // then
      await expect(getAccountProfileFunc).rejects.toBeInstanceOf(NotFoundException);
      await expect(getAccountProfileFunc).rejects.toMatchObject({
        message: '해당하는 사용자가 존재하지 않습니다.',
      });
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

    it('중복된 이메일이 존재 할 경우 BadRequestException이 발생된다', async () => {
      // when
      mockAccountRepository.findAccountByEmail.mockResolvedValue({} as IAccount);
      const createAccountFunc = accountService.createAccount(signupInput);

      // then
      await expect(createAccountFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(createAccountFunc).rejects.toMatchObject({
        message: '이미 존재하는 이메일입니다.',
      });
    });

    it('존재하지 않는 전공이 포함되어 있을 경우 BadRequestException이 발생된다', async () => {
      // when
      mockAccountRepository.checkMajorList.mockResolvedValue([]);
      const createAccountFunc = accountService.createAccount(signupInput);

      // then
      await expect(createAccountFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(createAccountFunc).rejects.toMatchObject({
        message: '존재하지 않는 전공이 포함되어 있습니다.',
      });
    });
  });

  describe('updateAccountProfile', () => {
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
      const updateAccountProfileFunc = accountService.updateAccountProfile(updateInput, accountIdx);

      // then
      await expect(updateAccountProfileFunc).resolves.toBeUndefined();
      expect(updateAccountInfoSpy).toHaveBeenCalledWith(updateInput, accountIdx);
    });

    it('존재하지 않는 사용자일 경우 NotFoundException이 발생된다', async () => {
      // given
      const accountIdx = 1;

      // when
      mockAccountRepository.findAccountByIdx.mockResolvedValue(undefined);
      const updateAccountProfileFunc = accountService.updateAccountProfile({}, accountIdx);

      // then
      await expect(updateAccountProfileFunc).rejects.toBeInstanceOf(NotFoundException);
      await expect(updateAccountProfileFunc).rejects.toMatchObject({
        message: '존재하지 않는 사용자입니다.',
      });
    });

    it('존재하지 않는 전공이 포함되어있으면 BadRequestException이 발생된다', async () => {
      // given
      const major = [
        {
          idx: 1, // 존재하는 전공
        },
        {
          idx: 13333, // 존재하지 않는 전공
        },
      ];

      // when
      mockAccountRepository.findAccountByIdx.mockResolvedValue({} as IAccount);
      mockAccountRepository.checkMajorList.mockResolvedValue([1]);
      const updateAccountProfileFunc = accountService.updateAccountProfile({ major }, 1);

      // then
      await expect(updateAccountProfileFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(updateAccountProfileFunc).rejects.toMatchObject({
        message: '존재하지 않는 전공이 포함되어 있습니다.',
      });
    });
  });

  describe('deleteAccount', () => {
    it('존재하지 않는 회원 인덱스일 경우 NotFoundException을 던진다', async () => {
      // given
      const accountIdx = -1;

      // when
      mockAccountRepository.findAccountByIdx.mockResolvedValue(undefined);
      const deleteAccountFunc = accountService.deleteAccount(accountIdx);

      // then
      await expect(deleteAccountFunc).rejects.toBeInstanceOf(NotFoundException);
      await expect(deleteAccountFunc).rejects.toMatchObject({
        message: '존재하지 않는 사용자입니다.',
      });
    });

    it('회원을 탈퇴한다', async () => {
      // given
      const accountIdx = 1;

      // when
      mockAccountRepository.findAccountByIdx.mockResolvedValue({} as IAccount);
      mockAccountRepository.deleteAccount.mockResolvedValue();
      const deleteAccountFunc = accountService.deleteAccount(accountIdx);

      // then
      await expect(deleteAccountFunc).resolves.toBeUndefined();
    });
  });
});
