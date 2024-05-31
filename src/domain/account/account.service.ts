import { Service } from 'typedi';
import { PrismaService } from '../prisma/prisma.service';

@Service()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async say() {
    return 'say';
  }
}
