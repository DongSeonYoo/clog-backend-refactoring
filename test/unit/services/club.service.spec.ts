import { MockProxy, mock } from 'jest-mock-extended';
import { ClubService } from '../../../src/services/club.service';
import { ClubRepository } from '../../../src/repositories/club.repository';
import { IClub } from '../../../src/interfaces/club/club.interface';
import { BadRequestException } from '../../../src/utils/custom-error.util';
import { IPosition } from '../../../src/interfaces/club/club.enum';

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
      bannerImage: 'banner.img',
      profileImage: 'profile.img',
    };
    const accountIdx = 1;

    it('동아리를 생성하고 동아리 회장으로 등록한다', async () => {
      // given
      const createdClubIdx = 1;
      mockClubRepository.getClubBelong.mockResolvedValue({ idx: 1, name: '소속' });
      mockClubRepository.getSmallCategory.mockResolvedValue({ idx: 1, name: '소분류 카테고리' });
      mockClubRepository.getBigCategory.mockResolvedValue({ idx: 1, name: '대분류 카테고리' });

      mockClubRepository.createClubWithInsertAdmin.mockResolvedValue(createdClubIdx);

      // when
      const createClubFunc = clubService.createClub(input, accountIdx);

      // then
      expect(createClubFunc).resolves.toEqual(createdClubIdx);
    });

    it('소속이 존재하지 않으면 BadRequestException이 발생한다', async () => {
      // given
      mockClubRepository.getClubBelong.mockResolvedValue(undefined);

      // when
      const createClubFunc = clubService.createClub(input, accountIdx);

      // then
      expect(createClubFunc).rejects.toBeInstanceOf(BadRequestException);
    });

    it('대분류 카테고리가 존재하지 않으면 BadRequestException이 발생한다', async () => {
      // given
      mockClubRepository.getClubBelong.mockResolvedValue({ idx: 1, name: '소속' });
      mockClubRepository.getBigCategory.mockResolvedValue(undefined);

      // when
      const createClubFunc = clubService.createClub(input, accountIdx);

      // then
      expect(createClubFunc).rejects.toBeInstanceOf(BadRequestException);
    });

    it('소분류 카테고리가 존재하지 않으면 BadRequestException이 발생한다', async () => {
      // given
      mockClubRepository.getClubBelong.mockResolvedValue({ idx: 1, name: '소속' });
      mockClubRepository.getBigCategory.mockResolvedValue({ idx: 1, name: '대분류 카테고리' });
      mockClubRepository.getSmallCategory.mockResolvedValue(undefined);

      // when
      const createClubFunc = clubService.createClub(input, accountIdx);

      // then
      expect(createClubFunc).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('checkBelong', () => {
    it('존재하지 않는 소속 인덱스일 경우 BadRequestException이 발생한다', async () => {
      // given
      const belongIdx = 2222;

      // when
      mockClubRepository.getClubBelong.mockResolvedValue(undefined);
      const checkBelongFunc = clubService.checkBelong(belongIdx);

      // then
      expect(checkBelongFunc).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('checkBigCategory', () => {
    it('존재하지 않는 대분류 카테고리일 경우 BadRequestException이 발생된다', async () => {
      // given
      const bigCategoryIdx = 2222;

      // when
      mockClubRepository.getBigCategory.mockResolvedValue(undefined);
      const checkBigCategoryFunc = clubService.checkBigCategory(bigCategoryIdx);

      // then
      expect(checkBigCategoryFunc).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
