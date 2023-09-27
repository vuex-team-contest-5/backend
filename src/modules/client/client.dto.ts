import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../base/base.dto';
import {
  IsDateString,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { PagingDto } from '../../common/dto/paging.dto';
import { regexps } from '../../common/constant/regex';

export class ClientDtoGroup extends BaseDtoGroup {}

export class ClientPagingDto extends PagingDto {
  @IsOptional({ groups: [ClientDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [ClientDtoGroup.PAGINATION] })
  teacherId?: string;
}

export class ClientDto extends BaseDto {
  @ApiProperty({
    description: 'The first name of the client.',
    type: 'string',
    example: 'John',
  })
  @IsOptional({ groups: [ClientDtoGroup.UPDATE] })
  @IsString({
    groups: [ClientDtoGroup.CREATE, ClientDtoGroup.UPDATE],
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the client.',
    type: 'string',
    example: 'Doe',
  })
  @IsOptional({ groups: [ClientDtoGroup.UPDATE] })
  @IsString({
    groups: [ClientDtoGroup.CREATE, ClientDtoGroup.UPDATE],
  })
  lastName: string;

  @ApiProperty({
    description: 'The phone number of the client.',
    type: 'string',
    example: '+998990001100',
  })
  @IsOptional({ groups: [ClientDtoGroup.UPDATE] })
  @Matches(regexps.UZ_PHONE_NUMBER, {
    groups: [ClientDtoGroup.CREATE, ClientDtoGroup.UPDATE],
    message: 'Phone number must be in the format +998XXXXXXXXX',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The email address of the client.',
    type: 'string',
    example: 'johndoe@example.com',
  })
  @IsOptional({ groups: [ClientDtoGroup.UPDATE] })
  @IsEmail(
    { domain_specific_validation: true },
    { groups: [ClientDtoGroup.CREATE, ClientDtoGroup.UPDATE] },
  )
  email: string;

  @ApiProperty({
    description: 'The password of the client.',
    type: 'string',
    example: 'password123',
  })
  @IsOptional({ groups: [ClientDtoGroup.UPDATE] })
  @IsString({
    groups: [ClientDtoGroup.CREATE, ClientDtoGroup.UPDATE],
  })
  password: string;

  @ApiProperty({
    description: 'The birth date of the client.',
    type: 'string',
    example: '2003-09-26',
  })
  @IsOptional({ groups: [ClientDtoGroup.UPDATE] })
  @IsDateString(
    { strict: true },
    {
      groups: [ClientDtoGroup.CREATE, ClientDtoGroup.UPDATE],
    },
  )
  birthDate: string;

  @ApiProperty({
    description: 'The service price of the client.',
    type: 'string',
    example: '$150',
  })
  @IsOptional({ groups: [ClientDtoGroup.UPDATE] })
  @IsString({
    groups: [ClientDtoGroup.CREATE, ClientDtoGroup.UPDATE],
  })
  servicePrice: string;

  @ApiProperty({
    description: 'The started date of the client.',
    type: 'string',
    example: '2023-09-27',
  })
  @IsOptional({ groups: [ClientDtoGroup.UPDATE] })
  @IsDateString(
    { strict: true },
    {
      groups: [ClientDtoGroup.CREATE, ClientDtoGroup.UPDATE],
    },
  )
  startedAt: string;

  @ApiProperty({
    description: 'The period in months of the client.',
    type: 'number',
    example: '3',
  })
  @IsOptional({ groups: [ClientDtoGroup.UPDATE] })
  @IsNumberString(
    { no_symbols: true },
    {
      groups: [ClientDtoGroup.CREATE, ClientDtoGroup.UPDATE],
    },
  )
  period: number;

  @ApiProperty({
    description: 'The ID of the teacher to which this client belongs.',
    type: 'string',
    example: '12345678',
  })
  @IsOptional({ groups: [ClientDtoGroup.UPDATE] })
  @IsUUID('4', {
    groups: [ClientDtoGroup.CREATE, ClientDtoGroup.UPDATE],
  })
  teacherId: string;

  imageName: string;

  hashedPassword: string;
}
