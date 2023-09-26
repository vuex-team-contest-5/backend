import { Expose, Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDtoGroup } from './../../base/base.dto';

export enum QuerySortTypeEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export declare type EntityFieldsNames<Entity> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof Entity]: Entity[P] extends Function ? never : P;
}[keyof Entity];

export type QuerySortType = 'ASC' | 'DESC' | 1 | -1;

export type QuerySort<Entity> = {
  [P in EntityFieldsNames<Entity>]?: QuerySortType;
};

export class PagingDto<T = any> {
  @IsOptional({ groups: [BaseDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [BaseDtoGroup.PAGINATION] })
  id?: string;

  @ApiProperty({ type: 'number', example: 10 })
  @Transform((value) => Number(value))
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    {
      groups: [BaseDtoGroup.PAGINATION],
    },
  )
  limit? = 10;

  @ApiProperty({ type: 'number', example: 1 })
  @Transform((value) => Number(value))
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    {
      groups: [BaseDtoGroup.PAGINATION],
    },
  )
  page? = 1;

  @Expose({ toClassOnly: true })
  @Transform(({ value }) => value?.trim() || '')
  @IsOptional({
    groups: [BaseDtoGroup.PAGINATION],
  })
  @IsString({
    groups: [BaseDtoGroup.PAGINATION],
  })
  search?: string;

  @IsOptional({ groups: [BaseDtoGroup.PAGINATION] })
  @IsString({ groups: [BaseDtoGroup.PAGINATION] })
  orderBy?: keyof T;

  @IsOptional({ groups: [BaseDtoGroup.PAGINATION] })
  @IsEnum(QuerySortTypeEnum, { groups: [BaseDtoGroup.PAGINATION] })
  orderType?: QuerySortType = 'ASC';

  @IsOptional({ groups: [BaseDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [BaseDtoGroup.PAGINATION] })
  createdBy?: string;

  @IsOptional({ groups: [BaseDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [BaseDtoGroup.PAGINATION] })
  organizationId?: string;

  @IsOptional({ groups: [BaseDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [BaseDtoGroup.PAGINATION] })
  productId?: string;
}
