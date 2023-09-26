import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class BaseDtoGroup {
  static readonly CREATE = 'create';
  static readonly UPDATE = 'update';
  static readonly DELETE = 'delete';
  static readonly GET_BY_ID = 'getById';
  static readonly PAGINATION = 'pagination';
  static readonly RESPONSE = 'response';
}

export class BaseDto {
  @ApiProperty({
    description: 'The ID',
    type: 'string',
    example: '12345678',
  })
  @IsOptional({ groups: [BaseDtoGroup.PAGINATION] })
  @IsUUID('4', {
    groups: [
      BaseDtoGroup.UPDATE,
      BaseDtoGroup.DELETE,
      BaseDtoGroup.GET_BY_ID,
      BaseDtoGroup.PAGINATION,
    ],
  })
  id: string | any;

  @IsOptional({ groups: [BaseDtoGroup.CREATE] })
  @IsUUID('4', { groups: [BaseDtoGroup.CREATE] })
  createdBy?: string;

  @IsOptional({ groups: [BaseDtoGroup.DELETE] })
  @IsUUID('4', { groups: [BaseDtoGroup.DELETE] })
  deletedBy?: string;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
