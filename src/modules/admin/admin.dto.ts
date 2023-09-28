import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../base/base.dto';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { PagingDto } from '../../common/dto/paging.dto';
import { regexps } from '../../common/constant/regex';

export class AdminDtoGroup extends BaseDtoGroup {}

export class AdminPagingDto extends PagingDto {}

export class AdminDto extends BaseDto {
  @ApiProperty({
    description: 'The first name of the admin.',
    type: 'string',
    example: 'John',
  })
  @IsOptional({ groups: [AdminDtoGroup.UPDATE] })
  @IsString({
    groups: [AdminDtoGroup.CREATE, AdminDtoGroup.UPDATE],
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the admin.',
    type: 'string',
    example: 'Doe',
  })
  @IsOptional({ groups: [AdminDtoGroup.UPDATE] })
  @IsString({
    groups: [AdminDtoGroup.CREATE, AdminDtoGroup.UPDATE],
  })
  lastName: string;

  @ApiProperty({
    description: 'The phone number of the admin.',
    type: 'string',
    example: '+998990001100',
  })
  @IsOptional({ groups: [AdminDtoGroup.UPDATE] })
  @Matches(regexps.UZ_PHONE_NUMBER, {
    groups: [AdminDtoGroup.CREATE, AdminDtoGroup.UPDATE],
    message: 'Phone number must be in the format +998XXXXXXXXX',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The email address of the admin.',
    type: 'string',
    example: 'johndoe@example.com',
  })
  @IsOptional({ groups: [AdminDtoGroup.UPDATE] })
  @IsEmail(
    { domain_specific_validation: true },
    { groups: [AdminDtoGroup.CREATE, AdminDtoGroup.UPDATE] },
  )
  email: string;

  @ApiProperty({
    description: 'The password of the admin.',
    type: 'string',
    example: 'password123',
  })
  @IsOptional({ groups: [AdminDtoGroup.UPDATE] })
  @IsString({
    groups: [AdminDtoGroup.CREATE, AdminDtoGroup.UPDATE],
  })
  password: string;

  imageName: string;

  hashedPassword: string;
}
