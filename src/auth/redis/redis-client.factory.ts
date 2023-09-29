import { FactoryProvider } from '@nestjs/common';
import { createClient } from 'redis';
import { REDIS_CLIENT, RedisClient } from './redis-client.type';
import { ENV } from '../../common/config/config';

export const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const client = createClient({
      password: ENV.DB.REDIS.PASSWORD,
      socket: {
        host: ENV.DB.REDIS.URL,
        port: ENV.DB.REDIS.PORT,
      },
    });
    await client.connect();
    return client;
  },
};
