import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../base/base.dto';
import {
  IsBooleanString,
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { PagingDto } from '../../common/dto/paging.dto';
import { regexps } from '../../common/constant/regex';
import { Transform, Type } from 'class-transformer';

export class TeacherDtoGroup extends BaseDtoGroup {}

export class TeacherPagingDto extends PagingDto {
  @IsOptional({ groups: [TeacherDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [TeacherDtoGroup.PAGINATION] })
  typeId?: string;
}

export enum WorkDaysEnum {
  MONDAY = 'Dushanba',
  TUESDAY = 'Seshanba',
  WEDNESDAY = 'Chorshanba',
  THURSDAY = 'Payshanba',
  FRIDAY = 'Juma',
  SATURDAY = 'Shanba',
  SUNDAY = 'Yakshanba',
}

export class WeekDayDto {
  @IsEnum(WorkDaysEnum, {
    groups: [TeacherDtoGroup.CREATE, TeacherDtoGroup.UPDATE],
  })
  weekDay: string;
}

export class TeacherDto extends BaseDto {
  @ApiProperty({
    description: 'The first name of the teacher.',
    type: 'string',
    example: 'John',
  })
  @IsOptional({ groups: [TeacherDtoGroup.UPDATE] })
  @IsString({
    groups: [TeacherDtoGroup.CREATE, TeacherDtoGroup.UPDATE],
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the teacher.',
    type: 'string',
    example: 'Doe',
  })
  @IsOptional({ groups: [TeacherDtoGroup.UPDATE] })
  @IsString({
    groups: [TeacherDtoGroup.CREATE, TeacherDtoGroup.UPDATE],
  })
  lastName: string;

  @ApiProperty({
    description: 'The phone number of the teacher.',
    type: 'string',
    example: '+998990001100',
  })
  @IsOptional({ groups: [TeacherDtoGroup.UPDATE] })
  @Matches(regexps.UZ_PHONE_NUMBER, {
    groups: [TeacherDtoGroup.CREATE, TeacherDtoGroup.UPDATE],
    message: 'Phone number must be in the format +998XXXXXXXXX',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The email address of the teacher.',
    type: 'string',
    example: 'johndoe@example.com',
  })
  @IsOptional({ groups: [TeacherDtoGroup.UPDATE] })
  @IsEmail(
    { domain_specific_validation: true },
    { groups: [TeacherDtoGroup.CREATE, TeacherDtoGroup.UPDATE] },
  )
  email: string;

  @ApiProperty({
    description: 'The password of the teacher.',
    type: 'string',
    example: 'password123',
  })
  @IsOptional({ groups: [TeacherDtoGroup.UPDATE] })
  @IsString({
    groups: [TeacherDtoGroup.CREATE, TeacherDtoGroup.UPDATE],
  })
  password: string;

  @ApiProperty({
    description: 'The birth date of the teacher.',
    type: 'string',
    example: '2003-09-26',
  })
  @IsOptional({ groups: [TeacherDtoGroup.UPDATE] })
  @IsDateString(
    { strict: true },
    {
      groups: [TeacherDtoGroup.CREATE, TeacherDtoGroup.UPDATE],
    },
  )
  birthDate: string;

  @ApiProperty({
    description: 'The workd day of the teacher.',
    type: 'string',
    example: 'Dushanba,Seshanba,Chorshanba',
  })
  @IsOptional({ groups: [TeacherDtoGroup.UPDATE] })
  @Transform(({ value }) => value.split(',').map((day: string) => day.trim()))
  @IsIn(Object.values(WorkDaysEnum), {
    each: true,
    groups: [TeacherDtoGroup.CREATE, TeacherDtoGroup.UPDATE],
  })
  workDay: string;

  @ApiProperty({
    description: 'The info of the teacher.',
    type: 'string',
    example: 'Some info',
  })
  @IsOptional({ groups: [TeacherDtoGroup.UPDATE] })
  @IsString({
    groups: [TeacherDtoGroup.CREATE, TeacherDtoGroup.UPDATE],
  })
  info: string;

  @ApiProperty({
    description: 'The gender of the teacher.',
    type: 'boolean',
    example: 'true',
  })
  @IsOptional({ groups: [TeacherDtoGroup.UPDATE] })
  @IsBooleanString({
    groups: [TeacherDtoGroup.CREATE, TeacherDtoGroup.UPDATE],
  })
  isMale: boolean;

  @ApiProperty({
    description: 'The ID of the type to which this teacher belongs.',
    type: 'string',
    example: '12345678',
  })
  @IsOptional({ groups: [TeacherDtoGroup.UPDATE] })
  @IsUUID('4', {
    groups: [TeacherDtoGroup.CREATE, TeacherDtoGroup.UPDATE],
  })
  typeId: string;

  imageName: string;

  hashedPassword: string;
}
