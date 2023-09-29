import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';
import { BaseDtoGroup } from '../../base/base.dto';
import { regexps } from '../../common/constant/regex';

export class LoginDtoGroup extends BaseDtoGroup {
  static readonly LOGIN = 'login';
}

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the admin.',
    type: 'string',
    example: 'johndoe@example.com',
  })
  @IsEmail(
    { domain_specific_validation: true },
    { groups: [LoginDtoGroup.LOGIN] },
  )
  email: string;

  @ApiProperty({
    description: 'The phone number of the admin.',
    type: 'string',
    example: '+998990001100',
  })
  @Matches(regexps.UZ_PHONE_NUMBER, {
    groups: [LoginDtoGroup.LOGIN],
    message: 'Phone number must be in the format +998XXXXXXXXX',
  })
  phoneNumber: string;
}
