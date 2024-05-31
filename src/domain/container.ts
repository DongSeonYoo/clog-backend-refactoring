import Container from 'typedi';
import { AuthService } from './auth/auth.service';
import { AccountService } from './account/account.service';
import { RedisService } from './redis/redis.service';

const authService = Container.get(AuthService);
const accountService = Container.get(AccountService);
const redisService = Container.get(RedisService);
