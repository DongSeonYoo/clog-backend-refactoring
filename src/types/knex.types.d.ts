import { IAccountMajor } from '../interfaces/account/account-major.interface';
import { IAccount } from '../interfaces/account/account.interface';
import { IBigCategory } from '../interfaces/club/big-category.interface';
import { IClubBoard } from '../interfaces/club/club-board.interface';
import { IClubMember } from '../interfaces/club/club-member.interface';
import { IClub } from '../interfaces/club/club.interface';
import { IComment } from '../interfaces/comment/comment.interface';
import { IGeneralPost } from '../interfaces/post/general-post.interface';
import { IJoinRequest } from '../interfaces/club/join-request.interface';
import { IMajor } from '../interfaces/club/major.interface';
import { INoticePost } from '../interfaces/post/notice-post.interface';
import { IPostImg } from '../interfaces/post/post-img.interface';
import { IPost } from '../interfaces/post/post.interface';
import { IPromotionPost } from '../interfaces/post/promotion-post.interface';
import { IReply } from '../interfaces/reply/reply.interface';
import { ISmallCategory } from '../interfaces/club/small-category.interface';
import { IBelong } from '../interfaces/club/belong.interface';

namespace ConvertTableProperty {
  interface AccountMajor extends Omit<IAccountMajor, 'accountIdx', 'majorIdx'> {
    account_idx: IAccount['idx'];
    major_idx: IMajor['idx'];
  }
}

declare module 'knex/types/tables' {
  interface Tables {
    account: IAccount;
    accountMajor: IAccountMajor;
    major: IMajor;

    club: IClub;
    clubBoard: IClubBoard;
    clubMember: IClubMember;
    joinRequest: IJoinRequest;
    bigCategory: IBigCategory;
    smallCategory: ISmallCategory;
    belong: IBelong;

    post: IPost;
    postImg: IPostImg;
    generalPost: IGeneralPost;
    noticePost: INoticePost;
    promotionPost: IPromotionPost;

    comment: IComment;
    reply: IReply;
  }
}
