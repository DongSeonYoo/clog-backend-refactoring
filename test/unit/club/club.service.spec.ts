import { MockProxy, mock } from 'jest-mock-extended';
import { ClubService } from '../../../src/services/club.service';
import { ClubRepository } from '../../../src/repositories/club.repository';
import { IClub } from '../../../src/interfaces/club/club.interface';
import { BadRequestException, NotFoundException } from '../../../src/utils/custom-error.util';
import { IPosition } from '../../../src/interfaces/club/club.enum';
import { TransactionManager } from '../../../src/utils/transaction-manager.util';

describe('clubService', () => {
  let clubService: ClubService;
  let mockClubRepository: MockProxy<ClubRepository>;
  let mockTransactionManager: MockProxy<TransactionManager>;
  beforeEach(() => {
    mockClubRepository = mock<ClubRepository>();
    mockTransactionManager = mock<TransactionManager>();
    clubService = new ClubService(mockClubRepository, mockTransactionManager);
  });

  describe('createClub', () => {
    const input: IClub.ICreateClubRequest = {
      isRecruit: true,
      name: 'club1',
      summary: 'club1Summary',
      belongIdx: 1,
      bigCategoryIdx: 1,
      smallCategoryIdx: 1,
      bannerImg: 'banner.img',
      profileImg: 'profile.img',
    };
    const accountIdx = 1;

    it('동아리를 생성하고 동아리 회장으로 등록한다', async () => {
      // given
      const createdClubIdx = 1;
      mockClubRepository.getSmallCategoryByIdx.mockResolvedValue({} as any);
      mockClubRepository.getBelongByIdx.mockResolvedValue({} as any);
      mockClubRepository.getBigCategoryByIdx.mockResolvedValue({} as any);
      mockClubRepository.checkDuplicateClubName.mockResolvedValue(false);
      mockTransactionManager.runTransaction.mockImplementation(async (cb) => {
        return cb({} as any);
      });
      mockClubRepository.insertMemberToClub.mockResolvedValue(accountIdx);
      mockClubRepository.createClub.mockResolvedValue(createdClubIdx);

      // then
      const createClubfunc = clubService.createClub(input, accountIdx);

      await expect(createClubfunc).resolves.toBe(createdClubIdx);
      expect(jest.spyOn(mockTransactionManager, 'runTransaction')).toHaveBeenCalled();
    });

    it('소속이 존재하지 않으면 BadRequestException이 발생한다', async () => {
      // given
      mockClubRepository.getBelongByIdx.mockResolvedValue(undefined);

      // when
      const createClubFunc = clubService.createClub(input, accountIdx);

      // then
      await expect(createClubFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(createClubFunc).rejects.toMatchObject({
        message: '해당하는 소속 인덱스가 존재하지 않습니다',
      });
    });

    it('대분류 카테고리가 존재하지 않으면 BadRequestException이 발생한다', async () => {
      // given
      mockClubRepository.getBelongByIdx.mockResolvedValue({ idx: 1, name: '소속' });
      mockClubRepository.getBigCategoryByIdx.mockResolvedValue(undefined);

      // when
      const createClubFunc = clubService.createClub(input, accountIdx);

      // then
      await expect(createClubFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(createClubFunc).rejects.toMatchObject({
        message: '해당하는 대분류 인덱스가 존재하지 않습니다',
      });
    });

    it('소분류 카테고리가 존재하지 않으면 BadRequestException이 발생한다', async () => {
      // given
      mockClubRepository.getBelongByIdx.mockResolvedValue({ idx: 1, name: '소속' });
      mockClubRepository.getBigCategoryByIdx.mockResolvedValue({ idx: 1, name: '대분류 카테고리' });
      mockClubRepository.getSmallCategoryByIdx.mockResolvedValue(undefined);

      // when
      const createClubFunc = clubService.createClub(input, accountIdx);

      // then
      await expect(createClubFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(createClubFunc).rejects.toMatchObject({
        message: '해당하는 소분류 인덱스가 존재하지 않습니다',
      });
    });
  });

  describe('checkBelong', () => {
    it('존재하지 않는 소속 인덱스일 경우 BadRequestException이 발생한다', async () => {
      // given
      const belongIdx = 2222;

      // when
      mockClubRepository.getBelongByIdx.mockResolvedValue(undefined);
      const checkBelongFunc = clubService.checkBelong(belongIdx);

      // then
      await expect(checkBelongFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(checkBelongFunc).rejects.toMatchObject({
        message: '해당하는 소속 인덱스가 존재하지 않습니다',
      });
    });
  });

  describe('checkBigCategory', () => {
    it('존재하지 않는 대분류 카테고리일 경우 BadRequestException이 발생된다', async () => {
      // given
      const bigCategoryIdx = 2222;

      // when
      mockClubRepository.getBigCategoryByIdx.mockResolvedValue(undefined);
      const checkBigCategoryFunc = clubService.checkBigCategory(bigCategoryIdx);

      // then
      await expect(checkBigCategoryFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(checkBigCategoryFunc).rejects.toMatchObject({
        message: '해당하는 대분류 인덱스가 존재하지 않습니다',
      });
    });
  });

  describe('checkSmallCategory', () => {
    it('존재하지 않는 소분류 카테고리일 경우 BadRequestException이 발생된다', async () => {
      // given
      const smallCategoryIdx = 2222;

      // when
      mockClubRepository.getBigCategoryByIdx.mockResolvedValue(undefined);
      const checkSmallCategoryFunc = clubService.checkSmallCategory(smallCategoryIdx);

      // then
      await expect(checkSmallCategoryFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(checkSmallCategoryFunc).rejects.toMatchObject({
        message: '해당하는 소분류 인덱스가 존재하지 않습니다',
      });
    });
  });

  describe('checkDuplicateName', () => {
    it('중복된 동아리 이름이 존재하지 않으면 성공적으로 종료한다', async () => {
      // given
      const notExistsClubName = 'club1';
      mockClubRepository.checkDuplicateClubName.mockResolvedValue(false);

      // when
      const checkDuplicateNameFunc = clubService.checkDuplicateName(notExistsClubName);

      // then
      await expect(checkDuplicateNameFunc).resolves.toBeUndefined();
    });

    it('중복된 동아리 이름이 존재하면 BadRequestException을 던진다', async () => {
      // given
      const existsClubName = 'club1';
      mockClubRepository.checkDuplicateClubName.mockResolvedValue(true);

      // when
      const checkDuplicateNameFunc = clubService.checkDuplicateName(existsClubName);

      // then
      await expect(checkDuplicateNameFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(checkDuplicateNameFunc).rejects.toMatchObject({
        message: '이미 사용중인 동아리 이름입니다',
      });
    });
  });

  describe('joinRequest', () => {
    it('가입 요청을 생성한다', async () => {
      // given
      const accountIdx = 1;
      const clubIdx = 2;
      const createdAccountIdx = 3;

      mockClubRepository.getClubByIdx.mockResolvedValue({ isRecruit: true } as IClub);
      mockClubRepository.getMyClubList.mockResolvedValue([]);
      mockClubRepository.getJoinRequestByAccountIdx.mockResolvedValue(undefined);
      mockClubRepository.insertJoinRequest.mockResolvedValue(createdAccountIdx);

      // when
      const joinRequestFunc = clubService.joinRequest(clubIdx, accountIdx);

      // then
      await expect(joinRequestFunc).resolves.toBe(createdAccountIdx);
    });
    it('해당하는 동아리가 존재하지 않으면 NotFoundException을 던진다', async () => {
      // given
      const clubIdx = 1;
      const accountIdx = 1;
      mockClubRepository.getClubByIdx.mockResolvedValue(undefined);

      // when
      const func = clubService.joinRequest(clubIdx, accountIdx);

      // then
      await expect(func).rejects.toBeInstanceOf(NotFoundException);
      await expect(func).rejects.toMatchObject({
        message: '해당하는 동아리가 존재하지 않습니다',
      });
    });

    it('해당 동아리가 가입신청을 받지 않는 상태이면 BadRequestException을 던진다', async () => {
      // given
      const clubIdx = 1;
      const accountIdx = 1;
      mockClubRepository.getClubByIdx.mockResolvedValue({ isRecruit: false } as IClub);

      // when
      const joinRequestFunc = clubService.joinRequest(clubIdx, accountIdx);

      // then
      await expect(joinRequestFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(joinRequestFunc).rejects.toMatchObject({
        message: '가입 신청이 열려있지 않습니다',
      });
    });

    it('이미 해당 동아리에 가입되어있을 시 BadRequestException을 던진다', async () => {
      // given
      const clubIdx = 1;
      const accountIdx = 1;
      mockClubRepository.getClubByIdx.mockResolvedValue({ isRecruit: true } as IClub);
      mockClubRepository.getMyClubList.mockResolvedValue([
        { clubIdx: 1, position: {} as IPosition },
      ]);

      // when
      const joinRequestFunc = clubService.joinRequest(clubIdx, accountIdx);

      // then
      await expect(joinRequestFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(joinRequestFunc).rejects.toMatchObject({
        message: '이미 해당 동아리에 가입되어있습니다',
      });
    });

    it('이미 가입 요청이 존재하는 경우 BadRequestException을 던진다', async () => {
      // given
      const clubIdx = 1;
      const accountIdx = 1;
      mockClubRepository.getClubByIdx.mockResolvedValue({ isRecruit: true } as IClub);
      mockClubRepository.getMyClubList.mockResolvedValue([
        { clubIdx: 2, position: {} as IPosition },
      ]);
      mockClubRepository.getJoinRequestByAccountIdx.mockResolvedValue({ idx: 1 });

      // when
      const joinRequestFunc = clubService.joinRequest(clubIdx, accountIdx);

      // then
      await expect(joinRequestFunc).rejects.toBeInstanceOf(BadRequestException);
      await expect(joinRequestFunc).rejects.toMatchObject({
        message: '이미 가입 요청이 존재합니다',
      });
    });
  });
});
