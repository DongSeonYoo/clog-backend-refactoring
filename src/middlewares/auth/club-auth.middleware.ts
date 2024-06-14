import { IPosition } from '../../interfaces/club/club.enum';
import { wrapper } from '../../utils/wrapper.util';
import { IClub } from '../../interfaces/club/club.interface';
import { clubService } from '../../utils/container.util';
import { UnauthorizedException } from '../../utils/custom-error.util';

/**
 * 동아리 권한 체크
 * - 어떤 동아리의 어떤 권한인지
 * @param options 체크할 권한
 * @returns
 */
export const clubAuthGuard = (options: { position: IPosition }) => {
  return wrapper(async (req, res, next) => {
    const accountIdx = req.user.idx;
    const clubIdx: IClub['idx'] | undefined = req.body.clubIdx ?? req.params.clubIdx;

    if (typeof clubIdx === 'undefined') {
      console.info('clubIdx가 사용되지 않음');
      return next();
    }

    // 가입된 동아리가 없는 경우
    const myClubList = await clubService.getMyClub(accountIdx);
    if (!myClubList.length) {
      console.info('가입된 동아리가 없는 경우');
      throw new UnauthorizedException('권한 없음');
    }

    // 해당 동아리에 가입되어 있는지 확인
    const club = myClubList.find((e) => e.clubIdx === clubIdx);
    if (!club) {
      console.log('param | body로 받은 동아리 인덱스와 일치하는 게 없는 경우');
      throw new UnauthorizedException('권한 없음');
    }

    // 포지션 검증
    if (club.position !== options.position) {
      console.info('해당 동아리의 자신의 포지션과 일치하지 않는 경우');
      throw new UnauthorizedException('권한 없음');
    }

    return next();
  });
};
