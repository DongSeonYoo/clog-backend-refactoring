import { Service } from 'typedi';
import { PrismaService } from '../prisma/prisma.service';

@Service()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
}
