import '../config/knex.config';
import Container from 'typedi';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { RedisService } from '../services/redis.service';

export const authService = Container.get(AuthService);
export const accountService = Container.get(AccountService);
export const redisService = Container.get(RedisService);
