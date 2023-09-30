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
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AdminDto, AdminDtoGroup, AdminPagingDto } from './admin.dto';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../../common/validators/image-validation.pipe';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Request } from 'express';

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
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body(new MyValidationPipe([AdminDtoGroup.CREATE])) data: AdminDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.adminService.create(data, image);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async findAll(
    @Query(new MyValidationPipe([AdminDtoGroup.PAGINATION]))
    query: AdminPagingDto,
  ) {
    return this.adminService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    id = req.user.role == 'admin' ? req.user.id : id;
    return this.adminService.findById(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
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
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Req() req: Request,
    @Body(new MyValidationPipe([AdminDtoGroup.UPDATE])) data: AdminDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    data.id = req.user.id;
    return this.adminService.updateById(data, image);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminService.deleteById(id);
  }
}
