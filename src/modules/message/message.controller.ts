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
  Req,
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
import { Request } from 'express';

@Controller('message')
@ApiTags('Message')
@ApiBearerAuth('admin_auth')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['body', 'status', 'chatId'],
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
        chatId: {
          type: 'string',
          example: '12345678',
          description: 'The ID of the chat to which this message belongs.',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @Req() req: Request,
    @Body(new MyValidationPipe([MessageDtoGroup.CREATE])) data: MessageDto,
    @UploadedFiles(new ImagesValidationPipe()) images: Express.Multer.File[],
  ) {
    data.ownerId = req.user.id;
    return this.messageService.create(data, images, req.user);
  }

  @ApiQuery({
    name: 'chatId',
    type: 'string',
    example: '12345678',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: Request,
    @Query(new MyValidationPipe([MessageDtoGroup.PAGINATION]))
    query: MessagePagingDto,
  ) {
    return this.messageService.findAll(query, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
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
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(FilesInterceptor('images', 5))
  async update(
    @Req() req: Request,
    @Body(new MyValidationPipe([MessageDtoGroup.UPDATE])) data: MessageDto,
    @UploadedFiles(new ImagesValidationPipe()) images: Express.Multer.File[],
  ) {
    data.ownerId = req.user.id;
    return this.messageService.updateById(data, images);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    return this.messageService.deleteById(id, req.user);
  }
}
