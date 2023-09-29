import { ApiProperty } from '@nestjs/swagger';

export class RedisDto {
  @ApiProperty({
    description: 'Key',
    type: 'string',
    example: 'user',
  })
  key: string;

  @ApiProperty({
    description: 'Value',
    type: 'string',
    example: 'john',
  })
  value: string;
}
