import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../base/base.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { PagingDto } from '../../common/dto/paging.dto';
import { ClientDto } from '../client/client.dto';
import { AdminDto } from '../admin/admin.dto';
import { MessageDto } from '../message/message.dto';

export class ChatDtoGroup extends BaseDtoGroup {}

export class ChatPagingDto extends PagingDto {
  @IsOptional({ groups: [ChatDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [ChatDtoGroup.PAGINATION] })
  adminId?: string;

  @IsOptional({ groups: [ChatDtoGroup.PAGINATION] })
  @IsUUID('4', { groups: [ChatDtoGroup.PAGINATION] })
  clientId?: string;
}

export class ChatDto extends BaseDto {
  adminId: string;

  @ApiProperty({
    description: 'The ID of the client to which this chat belongs.',
    type: 'string',
    example: '12345678',
  })
  @IsOptional({ groups: [ChatDtoGroup.UPDATE] })
  @IsUUID('4', {
    groups: [ChatDtoGroup.CREATE],
  })
  clientId: string;

  client: ClientDto;

  admin: AdminDto;

  message: MessageDto[];
}
