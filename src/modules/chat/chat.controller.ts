import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import { ChatDto, ChatDtoGroup, ChatPagingDto } from './chat.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('chat')
@ApiTags('Chat')
@ApiBearerAuth('admin_auth')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body(new MyValidationPipe([ChatDtoGroup.CREATE]))
    data: ChatDto,
  ) {
    return this.chatService.create(data);
  }

  @ApiQuery({
    name: 'adminId',
    type: 'string',
    example: '12345678',
  })
  @ApiQuery({
    name: 'clientId',
    type: 'string',
    example: null,
    required: false,
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query(new MyValidationPipe([ChatDtoGroup.PAGINATION]))
    query: ChatPagingDto,
  ) {
    return this.chatService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.chatService.findById(id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body(new MyValidationPipe([ChatDtoGroup.UPDATE]))
    data: ChatDto,
  ) {
    return this.chatService.updateById(data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.chatService.deleteById(id);
  }
}
