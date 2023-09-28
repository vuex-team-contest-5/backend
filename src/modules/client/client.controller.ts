import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import { ClientDto, ClientDtoGroup, ClientPagingDto } from './client.dto';
import { ImageValidationPipe } from '../../common/validators/image-validation.pipe';
import { OrderDto } from './order/order.dto';

@Controller('client')
@ApiTags('Client')
@ApiBearerAuth('admin_auth')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'firstName',
        'lastName',
        'phoneNumber',
        'email',
        'password',
        'birthDate',
        'servicePrice',
        'startedAt',
        'period',
        'status',
        'teacherId',
      ],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image of the client.',
        },
        firstName: {
          type: 'string',
          example: 'John',
          description: 'The first name of the client.',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
          description: 'The last name of the client.',
        },
        phoneNumber: {
          type: 'string',
          example: '+998990001100',
          description: 'The phone number of the client.',
        },
        email: {
          type: 'string',
          example: 'johndoe@example.com',
          description: 'The email address of the client.',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'The password of the client.',
        },
        birthDate: {
          type: 'string',
          example: '2003-09-26',
          description: 'The birth date of the client.',
        },
        servicePrice: {
          type: 'string',
          example: '$150',
          description: 'The service price of the client.',
        },
        startedAt: {
          type: 'string',
          example: '2023-09-27',
          description: 'The started date of the client.',
        },
        period: {
          type: 'number',
          example: '3',
          description: 'The period in months of the client.',
        },
        status: {
          type: 'boolean',
          example: 'true',
          description: 'The status of the client.',
        },
        teacherId: {
          type: 'string',
          example: '12345678',
          description: 'The ID of the teacher to which this client belongs.',
        },
      },
    },
  })
  @Post()
  // @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body(new MyValidationPipe([ClientDtoGroup.CREATE])) data: ClientDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.clientService.create(data, image);
  }

  @ApiQuery({
    name: 'teacherId',
    type: 'string',
    example: null,
    required: false,
  })
  @Get()
  // @Auth()
  async findAll(
    @Query(new MyValidationPipe([ClientDtoGroup.PAGINATION]))
    query: ClientPagingDto,
  ) {
    return this.clientService.findAll(query);
  }

  @Get(':id')
  // @Auth()
  async findOne(@Param('id') id: string) {
    return this.clientService.findById(id);
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
          description: 'The ID of the client.',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image of the client.',
        },
        firstName: {
          type: 'string',
          example: 'John',
          description: 'The first name of the client.',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
          description: 'The last name of the client.',
        },
        phoneNumber: {
          type: 'string',
          example: '+998990001100',
          description: 'The phone number of the client.',
        },
        email: {
          type: 'string',
          example: 'johndoe@example.com',
          description: 'The email address of the client.',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'The password of the client.',
        },
        birthDate: {
          type: 'string',
          example: '2003-09-26',
          description: 'The birth date of the client.',
        },
        servicePrice: {
          type: 'string',
          example: '$150',
          description: 'The service price of the client.',
        },
        startedAt: {
          type: 'string',
          example: '2023-09-27',
          description: 'The started date of the client.',
        },
        period: {
          type: 'number',
          example: '3',
          description: 'The period in months of the client.',
        },
        status: {
          type: 'boolean',
          example: 'true',
          description: 'The status of the client.',
        },
        teacherId: {
          type: 'string',
          example: '12345678',
          description: 'The ID of the teacher to which this client belongs.',
        },
      },
    },
  })
  @Patch()
  // @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Body(new MyValidationPipe([ClientDtoGroup.UPDATE])) data: ClientDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.clientService.updateById(data, image);
  }

  @Delete(':id')
  // @Auth()
  async remove(@Param('id') id: string) {
    return this.clientService.deleteById(id);
  }

  @Post('order')
  // @Auth()
  async orderProduct(
    @Body(new MyValidationPipe([ClientDtoGroup.CREATE])) data: OrderDto,
  ) {
    return this.clientService.orderProduct(data);
  }

  @Delete('order/:id')
  // @Auth()
  async removeOrder(@Param('id') id: string) {
    return this.clientService.removeOrder(id);
  }
}
