import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import { ChatDto, ChatDtoGroup, ChatPagingDto } from './chat.dto';
import { Auth } from '../../auth/auth.decorator';

@Controller('chat')
@ApiTags('Chat')
@ApiBearerAuth('admin_auth')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  // @Auth()
  async create(
    @Body(new MyValidationPipe([ChatDtoGroup.CREATE]))
    data: ChatDto,
  ) {
    return this.chatService.create(data);
  }

  @ApiQuery({
    name: 'type',
    type: 'string',
    example: null,
    required: false,
  })
  @ApiQuery({
    name: 'type',
    type: 'string',
    example: null,
    required: false,
  })
  @Get()
  // @Auth()
  async findAll(
    @Query(new MyValidationPipe([ChatDtoGroup.PAGINATION]))
    query: ChatPagingDto,
  ) {
    return this.chatService.findAll(query);
  }

  @Get(':id')
  // @Auth()
  async findOne(@Param('id') id: string) {
    return this.chatService.findById(id);
  }

  @Patch()
  // @Auth()
  async update(
    @Body(new MyValidationPipe([ChatDtoGroup.UPDATE]))
    data: ChatDto,
  ) {
    return this.chatService.updateById(data);
  }

  @Delete(':id')
  // @Auth()
  async remove(@Param('id') id: string) {
    return this.chatService.deleteById(id);
  }
}
