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
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import { ChatDto, ChatDtoGroup, ChatPagingDto } from './chat.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Request } from 'express';

@Controller('chat')
@ApiTags('Chat')
@ApiBearerAuth('admin_auth')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body(new MyValidationPipe([ChatDtoGroup.CREATE]))
    data: ChatDto,
  ) {
    data.adminId = req.user.id;
    return this.chatService.create(data);
  }

  @ApiQuery({
    name: 'adminId',
    type: 'string',
    example: null,
    required: false,
  })
  @ApiQuery({
    name: 'clientId',
    type: 'string',
    example: null,
    required: false,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: Request,
    @Query(new MyValidationPipe([ChatDtoGroup.PAGINATION]))
    query: ChatPagingDto,
  ) {
    query.adminId = req.user.role == 'admin' ? req.user.id : undefined;
    query.clientId = req.user.role == 'client' ? req.user.id : undefined;
    return this.chatService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    return this.chatService.findById(id, req.user);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch()
  async update(
    @Req() req: Request,
    @Body(new MyValidationPipe([ChatDtoGroup.UPDATE]))
    data: ChatDto,
  ) {
    data.adminId = req.user.id;
    return this.chatService.updateById(data);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.chatService.deleteById(id);
  }
}
