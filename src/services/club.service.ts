import { Service } from 'typedi';
import { IClub } from '../interfaces/club/club.interface';
import { IAccount } from '../interfaces/account/account.interface';
import { ClubRepository } from '../repositories/club.repository';
import { BadRequestException, NotFoundException } from '../utils/custom-error.util';
import { IBelong } from '../interfaces/club/belong.interface';
import { IBigCategory } from '../interfaces/club/big-category.interface';
import { ISmallCategory } from '../interfaces/club/small-category.interface';
import { IJoinRequest } from '../interfaces/club/join-request.interface';

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
      this.checkDuplicateName(input.name),
    ]);

    const createdAccountIdx = await this.clubRepository.createClubWithInsertAdmin(
      input,
      accountIdx,
    );

    return createdAccountIdx;
  }

  /**
   * 소속 인덱스 유효성 검사
   * @param belongIdx 소속 인덱스
   */
  async checkBelong(belongIdx: IBelong['idx']) {
    const checkBelongIdx = await this.clubRepository.getBelongByIdx(belongIdx);
    if (!checkBelongIdx) {
      throw new BadRequestException('해당하는 소속 인덱스가 존재하지 않습니다');
    }
  }

  /**
   * 대분류 인덱스 유효성 검사
   * @param bigCategoryIdx 대분류 인덱스
   */
  async checkBigCategory(bigCategoryIdx: IBigCategory['idx']) {
    const checkBigCategoryIdx = await this.clubRepository.getBigCategoryByIdx(bigCategoryIdx);
    if (!checkBigCategoryIdx) {
      throw new BadRequestException('해당하는 대분류 인덱스가 존재하지 않습니다');
    }
  }

  /**
   * 소분류 인덱스 유효성 검사
   * @param smallCategoryIdx 소분류 인덱스
   */
  async checkSmallCategory(smallCategoryIdx: ISmallCategory['idx']) {
    const checkSmallCategoryIdx = await this.clubRepository.getSmallCategoryByIdx(smallCategoryIdx);
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
    const findClubName = await this.clubRepository.checkDuplicateClubName(clubName);
    if (findClubName) {
      throw new BadRequestException('이미 사용중인 동아리 이름입니다');
    }

    return;
  }

  /**
   * 동아리 가입 신청
   * 1. 해당 동아리가 존재하는 동아리인지 검사
   * 2. 해당 동아리가 가입 신청을 받는 상태인지 검사
   * 3. 이미 가입되어있는 동아리인지 검사
   * 4. 이미 해당 동아리에 가입 요청이 되어있는지 검사
   * 5. 가입 요청 생성
   * @param clubIdx
   * @param accountIdx
   */
  async joinRequest(
    clubIdx: IClub['idx'],
    accountIdx: IAccount['idx'],
  ): Promise<IJoinRequest['idx']> {
    const club = await this.clubRepository.getClubByIdx(clubIdx);
    if (!club) {
      throw new NotFoundException('해당하는 동아리가 존재하지 않습니다');
    }
    if (!club.isRecruit) {
      throw new BadRequestException('가입 신청이 열려있지 않습니다');
    }

    const clubMember = await this.clubRepository.getClubMember(accountIdx, clubIdx);
    if (!clubMember) {
      throw new BadRequestException('이미 가입되어있는 동아리입니다');
    }

    const joinRequest = await this.clubRepository.getJoinRequestByAccountIdx(accountIdx, clubIdx);
    if (!joinRequest) {
      throw new BadRequestException('이미 가입 요청이 존재합니다');
    }

    const requestIdx = await this.clubRepository.insertJoinRequest(clubIdx, accountIdx);

    return requestIdx;
  }
}
