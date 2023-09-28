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
import { MessageService } from './message.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import { MessageDto, MessageDtoGroup, MessagePagingDto } from './message.dto';
import { Auth } from '../../auth/auth.decorator';

@Controller('message')
@ApiTags('Message')
@ApiBearerAuth('admin_auth')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  // @Auth()
  async create(
    @Body(new MyValidationPipe([MessageDtoGroup.CREATE]))
    data: MessageDto,
  ) {
    return this.messageService.create(data);
  }

  @ApiQuery({
    name: 'chatId',
    type: 'string',
    example: '12345678',
  })
  @Get()
  // @Auth()
  async findAll(
    @Query(new MyValidationPipe([MessageDtoGroup.PAGINATION]))
    query: MessagePagingDto,
  ) {
    return this.messageService.findAll(query);
  }

  @Get(':id')
  // @Auth()
  async findOne(@Param('id') id: string) {
    return this.messageService.findById(id);
  }

  @Patch()
  // @Auth()
  async update(
    @Body(new MyValidationPipe([MessageDtoGroup.UPDATE]))
    data: MessageDto,
  ) {
    return this.messageService.updateById(data);
  }

  @Delete(':id')
  // @Auth()
  async remove(@Param('id') id: string) {
    return this.messageService.deleteById(id);
  }
}
