import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisDto } from './redis.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('redis')
@ApiTags('Redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('ping')
  ping() {
    return this.redisService.ping();
  }

  @Post('set')
  create(@Body() setRedisDto: RedisDto) {
    return this.redisService.set(setRedisDto);
  }

  @Get('get/:key')
  get(@Param('key') key: string) {
    return this.redisService.get(key);
  }
}
