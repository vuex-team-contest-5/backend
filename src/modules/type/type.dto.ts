import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../base/base.dto';
import { IsOptional, IsString } from 'class-validator';
import { PagingDto } from '../../common/dto/paging.dto';

export class TypeDtoGroup extends BaseDtoGroup {}

export class TypePagingDto extends PagingDto {}

export class TypeDto extends BaseDto {
  @ApiProperty({
    description: 'The name of the type.',
    type: 'string',
    example: 'IV',
  })
  @IsOptional({ groups: [TypeDtoGroup.UPDATE] })
  @IsString({
    groups: [TypeDtoGroup.CREATE, TypeDtoGroup.UPDATE],
  })
  name: string;
}
