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
  UploadedFile,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AdminDto, AdminDtoGroup, AdminPagingDto } from './admin.dto';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../../common/validators/image-validation.pipe';

@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth('admin_auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
        'status',
      ],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image of the admin.',
        },
        firstName: {
          type: 'string',
          example: 'John',
          description: 'The first name of the admin.',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
          description: 'The last name of the admin.',
        },
        phoneNumber: {
          type: 'string',
          example: '+998990001100',
          description: 'The phone number of the admin.',
        },
        email: {
          type: 'string',
          example: 'johndoe@example.com',
          description: 'The email address of the admin.',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'The password of the admin.',
        },
        status: {
          type: 'boolean',
          example: 'true',
          description: 'The status of the admin.',
        },
      },
    },
  })
  @Post()
  // @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body(new MyValidationPipe([AdminDtoGroup.CREATE])) data: AdminDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.adminService.create(data, image);
  }

  @Get()
  // @Auth()
  async findAll(
    @Query(new MyValidationPipe([AdminDtoGroup.PAGINATION]))
    query: AdminPagingDto,
  ) {
    return this.adminService.findAll(query);
  }

  @Get(':id')
  // @Auth()
  async findOne(@Param('id') id: string) {
    return this.adminService.findById(id);
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
          description: 'The ID of the admin.',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image of the admin.',
        },
        firstName: {
          type: 'string',
          example: 'John',
          description: 'The first name of the admin.',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
          description: 'The last name of the admin.',
        },
        phoneNumber: {
          type: 'string',
          example: '+998990001100',
          description: 'The phone number of the admin.',
        },
        email: {
          type: 'string',
          example: 'johndoe@example.com',
          description: 'The email address of the admin.',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'The password of the admin.',
        },
        status: {
          type: 'boolean',
          example: 'true',
          description: 'The status of the admin.',
        },
      },
    },
  })
  @Patch()
  // @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Body(new MyValidationPipe([AdminDtoGroup.UPDATE])) data: AdminDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.adminService.updateById(data, image);
  }

  @Delete(':id')
  // @Auth()
  async remove(@Param('id') id: string) {
    return this.adminService.deleteById(id);
  }
}
