import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../base/base.dto';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { regexps } from '../../common/constant/regex';

export class RegisterDtoGroup extends BaseDtoGroup {
  static readonly REGISTER = 'register';
}

export class RegisterDto extends BaseDto {
  @ApiProperty({
    description: 'The first name of the admin.',
    type: 'string',
    example: 'John',
  })
  @IsString({
    groups: [RegisterDtoGroup.REGISTER],
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the admin.',
    type: 'string',
    example: 'Doe',
  })
  @IsString({
    groups: [RegisterDtoGroup.REGISTER],
  })
  lastName: string;

  @ApiProperty({
    description: 'The email address of the admin.',
    type: 'string',
    example: 'johndoe@example.com',
  })
  @IsEmail(
    { domain_specific_validation: true },
    { groups: [RegisterDtoGroup.REGISTER] },
  )
  email: string;

  @ApiProperty({
    description: 'The phone number of the admin.',
    type: 'string',
    example: '+998990001100',
  })
  @Matches(regexps.UZ_PHONE_NUMBER, {
    groups: [RegisterDtoGroup.REGISTER],
    message: 'Phone number must be in the format +998XXXXXXXXX',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The password of the admin.',
    type: 'string',
    example: 'password123',
  })
  @IsString({
    groups: [RegisterDtoGroup.REGISTER],
  })
  @MinLength(3, { groups: [RegisterDtoGroup.REGISTER] })
  password: string;

  hashedPassword: string;
}
