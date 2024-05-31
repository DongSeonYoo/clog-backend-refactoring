import { PrismaService } from '../../src/domain/prisma/prisma.service';
import { AccountService } from '../../src/domain/account/account.service';

let prismaService: PrismaService = {} as PrismaService;

describe('AccountService', () => {
  const accountService = new AccountService(prismaService);

  it('should be defined accountService', async () => {
    // given
    const value = 'say';

    // when
    const result = await accountService.say();

    // then
    expect(result).toBe(value);
  });
});
