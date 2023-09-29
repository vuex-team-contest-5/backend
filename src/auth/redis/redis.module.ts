import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { redisClientFactory } from './redis-client.factory';

@Module({
  controllers: [RedisController],
  providers: [redisClientFactory, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
