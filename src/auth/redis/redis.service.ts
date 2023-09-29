import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { REDIS_CLIENT, RedisClient } from './redis-client.type';
import { RedisDto } from './redis.dto';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  onModuleDestroy() {
    this.redisClient.quit();
  }

  async ping() {
    return this.redisClient.ping();
  }

  async set(setRedisDto: RedisDto, EX: number = 5) {
    const { key, value } = setRedisDto;
    await this.redisClient.set(key, value, { EX });

    return `Set value to Redis: ${value}`;
  }

  async get(key: string) {
    const retrievedValue = await this.redisClient.get(key);
    // const retrievedValue = this.redisClient.getDel(key);
    // const retrievedValue = this.redisClient.del(key);
    // const retrievedValue = this.redisClient.exists(key);

    return retrievedValue;
  }

  async clear(key: string) {
    const retrievedValue = this.redisClient.del(key);
    return retrievedValue;
  }
}
