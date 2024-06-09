import '../config/knex.config';
import Container from 'typedi';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { RedisService } from '../services/redis.service';
import { ClubService } from '../services/club.service';

export const authService = Container.get(AuthService);
export const accountService = Container.get(AccountService);
export const clubService = Container.get(ClubService);
export const redisService = Container.get(RedisService);
