import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseDtoGroup } from '../../base/base.dto';

export class LoginDtoGroup extends BaseDtoGroup {
  static readonly LOGIN = 'login';
}

export class LoginDto {
  @ApiProperty({
    description: 'The username of the user.',
    type: 'string',
    example: 'johndoe123',
  })
  @IsString({
    groups: [LoginDtoGroup.LOGIN],
  })
  username: string;

  @ApiProperty({
    description: 'The password of the user.',
    type: 'string',
    example: 'password123',
  })
  @IsString({
    groups: [LoginDtoGroup.LOGIN],
  })
  password: string;
}
