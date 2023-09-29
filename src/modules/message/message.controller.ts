import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import { MessageDto, MessageDtoGroup, MessagePagingDto } from './message.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesValidationPipe } from '../../common/validators/images-validation.pipe';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('message')
@ApiTags('Message')
@ApiBearerAuth('admin_auth')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['body', 'status', 'ownerId', 'chatId'],
      properties: {
        images: {
          type: 'array',
          maxItems: 5,
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'The images of the message.',
        },
        body: {
          type: 'string',
          example: 'Some text',
          description: 'The body of the message.',
        },
        status: {
          type: 'boolean',
          example: 'true',
          description: 'The status of the message.',
        },
        ownerId: {
          type: 'string',
          example: '12345678',
          description: 'The ID of the owner to which this message belongs.',
        },
        chatId: {
          type: 'string',
          example: '12345678',
          description: 'The ID of the chat to which this message belongs.',
        },
      },
    },
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @Body(new MyValidationPipe([MessageDtoGroup.CREATE])) data: MessageDto,
    @UploadedFiles(new ImagesValidationPipe()) images: Express.Multer.File[],
  ) {
    return this.messageService.create(data, images);
  }

  @ApiQuery({
    name: 'chatId',
    type: 'string',
    example: '12345678',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query(new MyValidationPipe([MessageDtoGroup.PAGINATION]))
    query: MessagePagingDto,
  ) {
    return this.messageService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.messageService.findById(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          example: '13245678',
          description: 'The ID of the message.',
        },
        images: {
          type: 'array',
          maxItems: 5,
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'The images of the message.',
        },
        body: {
          type: 'string',
          example: 'Some text',
          description: 'The body of the message.',
        },
        status: {
          type: 'boolean',
          example: 'true',
          description: 'The status of the message.',
        },
        ownerId: {
          type: 'string',
          example: '12345678',
          description: 'The ID of the owner to which this message belongs.',
        },
        chatId: {
          type: 'string',
          example: '12345678',
          description: 'The ID of the chat to which this message belongs.',
        },
      },
    },
  })
  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async update(
    @Body(new MyValidationPipe([MessageDtoGroup.UPDATE])) data: MessageDto,
    @UploadedFiles(new ImagesValidationPipe()) images: Express.Multer.File[],
  ) {
    return this.messageService.updateById(data, images);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.messageService.deleteById(id);
  }
}
