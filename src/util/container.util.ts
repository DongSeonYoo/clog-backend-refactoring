import Container from 'typedi';
import { AuthService } from '../domain/auth/auth.service';
import { AccountService } from '../domain/account/account.service';
import { RedisService } from '../domain/redis/redis.service';

export const authService = Container.get(AuthService);
export const accountService = Container.get(AccountService);
export const redisService = Container.get(RedisService);
