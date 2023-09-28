import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../../base/base.dto';
import { IsOptional, IsUUID, IsNumber } from 'class-validator';
import { PagingDto } from '../../../common/dto/paging.dto';

export class OrderDtoGroup extends BaseDtoGroup {}

export class OrderPagingDto extends PagingDto {
  @IsOptional({ groups: [OrderDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [OrderDtoGroup.PAGINATION] })
  clientId?: string;

  @IsOptional({ groups: [OrderDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [OrderDtoGroup.PAGINATION] })
  productId?: string;
}

export class OrderDto extends BaseDto {
  @ApiProperty({
    description: 'The count of the order.',
    type: 'number',
    example: 2,
  })
  @IsOptional({ groups: [OrderDtoGroup.UPDATE] })
  @IsNumber(
    { allowNaN: false },
    { groups: [OrderDtoGroup.CREATE, OrderDtoGroup.UPDATE] },
  )
  count: number;

  @ApiProperty({
    description: 'The ID of the product to which this order belongs.',
    type: 'string',
    example: '12345678',
  })
  @IsOptional({ groups: [OrderDtoGroup.UPDATE] })
  @IsUUID('4', {
    groups: [OrderDtoGroup.CREATE, OrderDtoGroup.UPDATE],
  })
  productId: string;

  @ApiProperty({
    description: 'The ID of the client to which this order belongs.',
    type: 'string',
    example: '12345678',
  })
  @IsOptional({ groups: [OrderDtoGroup.UPDATE] })
  @IsUUID('4', {
    groups: [OrderDtoGroup.CREATE, OrderDtoGroup.UPDATE],
  })
  clientId: string;
}
