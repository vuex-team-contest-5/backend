import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../base/base.dto';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PagingDto } from '../../common/dto/paging.dto';

export class ProductDtoGroup extends BaseDtoGroup {}

export enum TypeEnum {
  PRODUCT = 'product',
  EQUIPMENT = 'equipment',
}

export class ProductPagingDto extends PagingDto {
  @IsEnum(TypeEnum, { groups: [ProductDtoGroup.PAGINATION] })
  type: string;

  @IsOptional({ groups: [ProductDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [ProductDtoGroup.PAGINATION] })
  categoryId?: string;
}

export class ProductDto extends BaseDto {
  @ApiProperty({
    description: 'The name of the product.',
    type: 'string',
    example: 'Whey Protein',
  })
  @IsOptional({ groups: [ProductDtoGroup.UPDATE] })
  @IsString({
    groups: [ProductDtoGroup.CREATE, ProductDtoGroup.UPDATE],
  })
  name: string;

  @ApiProperty({
    description: 'The price of the product.',
    type: 'string',
    example: '$20',
  })
  @IsOptional({ groups: [ProductDtoGroup.UPDATE] })
  @IsString({
    groups: [ProductDtoGroup.CREATE, ProductDtoGroup.UPDATE],
  })
  price: string;

  @ApiProperty({
    description: 'The brand of the product.',
    type: 'string',
    example: 'Chocolate Hazeinut',
  })
  @IsOptional({ groups: [ProductDtoGroup.UPDATE] })
  @IsString({
    groups: [ProductDtoGroup.CREATE, ProductDtoGroup.UPDATE],
  })
  brand: string;

  @ApiProperty({
    description: 'The info of the product.',
    type: 'string',
    example: 'Some info',
  })
  @IsOptional({ groups: [ProductDtoGroup.UPDATE] })
  @IsString({
    groups: [ProductDtoGroup.CREATE, ProductDtoGroup.UPDATE],
  })
  info: string;

  @ApiProperty({
    description: 'The count of the product.',
    type: 'number',
    example: '150',
  })
  @IsOptional({ groups: [ProductDtoGroup.UPDATE] })
  @IsNumberString(
    { no_symbols: true },
    { groups: [ProductDtoGroup.CREATE, ProductDtoGroup.UPDATE] },
  )
  count: number;

  @ApiProperty({
    description: 'The type of the product.',
    type: 'string',
    example: 'product',
  })
  @IsOptional({ groups: [ProductDtoGroup.UPDATE] })
  @IsEnum(TypeEnum, {
    groups: [ProductDtoGroup.CREATE, ProductDtoGroup.UPDATE],
  })
  type: string;

  @ApiProperty({
    description: 'The ID of the category to which this product belongs.',
    type: 'string',
    example: '12345678',
  })
  @IsOptional({ groups: [ProductDtoGroup.UPDATE] })
  @IsUUID('4', {
    groups: [ProductDtoGroup.CREATE, ProductDtoGroup.UPDATE],
  })
  categoryId: string;

  imageName: string;
}
