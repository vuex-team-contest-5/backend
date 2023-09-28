import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../base/base.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PagingDto } from '../../common/dto/paging.dto';

export class CategoryDtoGroup extends BaseDtoGroup {}

export enum TypeEnum {
  PRODUCT = 'product',
  EQUIPMENT = 'equipment',
}

export class CategoryPagingDto extends PagingDto {
  @IsEnum(TypeEnum, { groups: [CategoryDtoGroup.PAGINATION] })
  type: string;
}

export class CategoryDto extends BaseDto {
  @ApiProperty({
    description: 'The name of the category.',
    type: 'string',
    example: 'Trinajor',
  })
  @IsOptional({ groups: [CategoryDtoGroup.UPDATE] })
  @IsString({
    groups: [CategoryDtoGroup.CREATE, CategoryDtoGroup.UPDATE],
  })
  name: string;

  @ApiProperty({
    description: 'The type of the category.',
    type: 'string',
    example: 'product',
  })
  @IsOptional({ groups: [CategoryDtoGroup.UPDATE] })
  @IsEnum(TypeEnum, {
    groups: [CategoryDtoGroup.CREATE, CategoryDtoGroup.UPDATE],
  })
  type: string;
}
