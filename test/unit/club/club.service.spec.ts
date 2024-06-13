import { MockProxy, mock } from 'jest-mock-extended';
import { ClubService } from '../../../src/services/club.service';
import { ClubRepository } from '../../../src/repositories/club.repository';
import { IClub } from '../../../src/interfaces/club/club.interface';
import { BadRequestException } from '../../../src/utils/custom-error.util';

describe('clubService', () => {
  let clubService: ClubService;
  let mockClubRepository: MockProxy<ClubRepository>;
  beforeEach(() => {
    mockClubRepository = mock<ClubRepository>();
    clubService = new ClubService(mockClubRepository);
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

      mockClubRepository.createClubWithInsertAdmin.mockResolvedValue(createdClubIdx);

      // when
      const spy = jest.spyOn(mockClubRepository, 'createClubWithInsertAdmin');
      const createClubFunc = clubService.createClub(input, accountIdx);

      // then
      await expect(createClubFunc).resolves.toEqual(createdClubIdx);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(input, accountIdx);
    });

    it('소속이 존재하지 않으면 BadRequestException이 발생한다', async () => {
      // given
      mockClubRepository.getBelongByIdx.mockResolvedValue(undefined);

      // when
      const createClubFunc = clubService.createClub(input, accountIdx);

      // then
      await expect(createClubFunc).rejects.toBeInstanceOf(BadRequestException);
    });

    it('대분류 카테고리가 존재하지 않으면 BadRequestException이 발생한다', async () => {
      // given
      mockClubRepository.getBelongByIdx.mockResolvedValue({ idx: 1, name: '소속' });
      mockClubRepository.getBigCategoryByIdx.mockResolvedValue(undefined);

      // when
      const createClubFunc = clubService.createClub(input, accountIdx);

      // then
      await expect(createClubFunc).rejects.toBeInstanceOf(BadRequestException);
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
    });
  });

  describe('checkDuplicateName', () => {
    it('중복된 동아리 이름이 존재하면 BadRequestException을 던진다', async () => {
      // given
      const existsClubName = 'club1';
      mockClubRepository.checkDuplicateClubName.mockResolvedValue(true);

      // when
      const checkDuplicateNameFunc = clubService.checkDuplicateName(existsClubName);

      // then
      await expect(checkDuplicateNameFunc).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  it('중복된 동아리 이름이 존재하지 않으면 void를 반환한다', async () => {
    // given
    const notExistsClubName = 'club1';
    mockClubRepository.checkDuplicateClubName.mockResolvedValue(false);

    // when
    const checkDuplicateNameFunc = clubService.checkDuplicateName(notExistsClubName);

    // then
    await expect(checkDuplicateNameFunc).resolves.toBeUndefined();
  });

  describe('joinRequest', () => {
    it.todo('해당하는 동아리가 존재하지 않으면 NotFoundException을 던진다');
    it.todo('해당 동아리가 가입신청을 받지 않는 상태이면 BadRequestException을 던진다');
    it.todo('이미 해당 동아리에 가입되어있을 시 BadRequestException을 던진다');
    it.todo('이미 가입되어있는 동아리라면 BadRequestException을 던진다');
    it.todo('가입 요청을 생성한다');
  });
});
