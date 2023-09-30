import { ApiProperty } from '@nestjs/swagger';
import { BaseDto, BaseDtoGroup } from '../../base/base.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PagingDto } from '../../common/dto/paging.dto';
import { ChatDto } from '../chat/chat.dto';

export class MessageDtoGroup extends BaseDtoGroup {}

export class MessagePagingDto extends PagingDto {
  @IsUUID('4', { groups: [MessageDtoGroup.PAGINATION] })
  chatId: string;
}

export class MessageDto extends BaseDto {
  @ApiProperty({
    description: 'The body of the message.',
    type: 'string',
    example: 'Some text',
  })
  @IsOptional({ groups: [MessageDtoGroup.UPDATE] })
  @IsString({
    groups: [MessageDtoGroup.CREATE, MessageDtoGroup.UPDATE],
  })
  body: string;

  @ApiProperty({
    description: 'The ID of the chat to which this message belongs.',
    type: 'string',
    example: '12345678',
  })
  @IsOptional({ groups: [MessageDtoGroup.UPDATE] })
  @IsUUID('4', {
    groups: [MessageDtoGroup.CREATE, MessageDtoGroup.UPDATE],
  })
  chatId: string;

  ownerId: string;

  isClient: boolean;

  chat: ChatDto;
}
