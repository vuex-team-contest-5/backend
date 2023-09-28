import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../../base/base.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { PagingDto } from '../../../common/dto/paging.dto';

export class FileDtoGroup extends BaseDtoGroup {}

export class FilePagingDto extends PagingDto {
  @IsOptional({ groups: [FileDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [FileDtoGroup.PAGINATION] })
  messageId?: string;
}

export class FileDto extends BaseDto {
  @ApiProperty({
    description: 'The ID of the message to which this file belongs.',
    type: 'string',
    example: '12345678',
  })
  @IsOptional({ groups: [FileDtoGroup.UPDATE] })
  @IsUUID('4', {
    groups: [FileDtoGroup.CREATE, FileDtoGroup.UPDATE],
  })
  messageId: string;

  fileName: string;
}
