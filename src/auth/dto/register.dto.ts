import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../base/base.dto';
import {
  IsString,
  IsUUID,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';
import { regexps } from '../../common/constant/regex';
import { IsPasswordsMatch } from '../../common/validators/custom/auth-password.validator.dto.';

export class RegisterDtoGroup extends BaseDtoGroup {
  static readonly REGISTER = 'register';
}

export class RegisterDto extends BaseDto {
  @ApiProperty({
    description: 'The first name of the user.',
    type: 'string',
    example: 'John',
  })
  @IsString({
    groups: [RegisterDtoGroup.REGISTER],
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user.',
    type: 'string',
    example: 'Doe',
  })
  @IsString({
    groups: [RegisterDtoGroup.REGISTER],
  })
  lastName: string;

  @ApiProperty({
    description: 'The phone number of the user.',
    type: 'string',
    example: '+998991234567',
  })
  @Matches(regexps.UZ_PHONE_NUMBER, {
    groups: [RegisterDtoGroup.REGISTER],
    message: 'Phone number must be in the format +998XXXXXXXXX',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The username of the user.',
    type: 'string',
    example: 'johndoe123',
  })
  @IsString({
    groups: [RegisterDtoGroup.REGISTER],
  })
  username: string;

  @ApiProperty({
    description: 'The password of the user.',
    type: 'string',
    example: 'password123',
  })
  @IsString({
    groups: [RegisterDtoGroup.REGISTER],
  })
  @MinLength(3, { groups: [RegisterDtoGroup.REGISTER] })
  @Validate(IsPasswordsMatch, { groups: [RegisterDtoGroup.REGISTER] })
  password: string;

  @ApiProperty({
    description: 'The confirm password of the user.',
    type: 'string',
    example: 'password123',
  })
  @IsString({
    groups: [RegisterDtoGroup.REGISTER],
  })
  passwordRetry: string;

  @ApiProperty({
    description: 'The name of the organization.',
    type: 'string',
    example: 'KFC',
  })
  @IsString({
    groups: [RegisterDtoGroup.REGISTER],
  })
  organizationName: string;

  @ApiProperty({
    description: 'The ID of the region to which this store belongs.',
    type: 'string',
    example: '12345678',
  })
  @IsUUID('4', {
    groups: [RegisterDtoGroup.REGISTER],
  })
  regionId: string;
}
