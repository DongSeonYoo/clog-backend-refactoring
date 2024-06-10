import { Service } from 'typedi';
import { IClub } from '../interfaces/club/club.interface';
import { IAccount } from '../interfaces/account/account.interface';
import { ClubRepository } from '../repositories/club.repository';
import { BadRequestException } from '../utils/custom-error.util';
import { IBelong } from '../interfaces/club/belong.interface';
import { IBigCategory } from '../interfaces/club/big-category.interface';
import { ISmallCategory } from '../interfaces/club/small-category.interface';

@Service()
export class ClubService {
  constructor(private readonly clubRepository: ClubRepository) {}

  /**
   * 동아리 생성
   * @param input 동아리 정보
   * @param accountIdx 유저 인덱스
   * @returns 생성된 동아리 인덱스
   */
  async createClub(input: IClub.ICreateClubRequest, accountIdx: IAccount['idx']) {
    // 동아리 정보 유효성 검사
    await Promise.all([
      this.checkBelong(input.belongIdx),
      this.checkBigCategory(input.bigCategoryIdx),
      this.checkSmallCategory(input.smallCategoryIdx),
    ]);

    return this.clubRepository.createClubWithInsertAdmin(input, accountIdx);
  }

  /**
   * 소속 인덱스 유효성 검사
   * @param belongIdx 소속 인덱스
   */
  async checkBelong(belongIdx: IBelong['idx']) {
    const checkBelongIdx = await this.clubRepository.getClubBelong(belongIdx);
    if (!checkBelongIdx) {
      throw new BadRequestException('해당하는 소속 인덱스가 존재하지 않습니다');
    }
  }

  /**
   * 대분류 인덱스 유효성 검사
   * @param bigCategoryIdx 대분류 인덱스
   */
  async checkBigCategory(bigCategoryIdx: IBigCategory['idx']) {
    const checkBigCategoryIdx = await this.clubRepository.getBigCategory(bigCategoryIdx);
    if (!checkBigCategoryIdx) {
      throw new BadRequestException('해당하는 대분류 인덱스가 존재하지 않습니다');
    }
  }

  /**
   * 소분류 인덱스 유효성 검사
   * @param smallCategoryIdx 소분류 인덱스
   */
  async checkSmallCategory(smallCategoryIdx: ISmallCategory['idx']) {
    const checkSmallCategoryIdx = await this.clubRepository.getSmallCategory(smallCategoryIdx);
    if (!checkSmallCategoryIdx) {
      throw new BadRequestException('해당하는 소분류 인덱스가 존재하지 않습니다');
    }
  }

  /**
   * 동아리 이름 중복 확인
   * @param clubName 동아리 이름
   * @returns 중복 여부
   */
  async checkDuplicateName(clubName: IClub['name']): Promise<void> {
    const findClubName = await this.clubRepository.checkDuplicateName(clubName);
    if (findClubName) {
      throw new BadRequestException('이미 사용중인 동아리 이름입니다');
    }
  }
}
