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
import { TeacherService } from './teacher.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TeacherDto, TeacherDtoGroup, TeacherPagingDto } from './teacher.dto';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../../common/validators/image-validation.pipe';

@Controller('teacher')
@ApiTags('Teacher')
@ApiBearerAuth('admin_auth')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

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
        'workDay',
        'info',
        'isMale',
        'typeId',
      ],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image of the teacher.',
        },
        firstName: {
          type: 'string',
          example: 'John',
          description: 'The first name of the teacher.',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
          description: 'The last name of the teacher.',
        },
        phoneNumber: {
          type: 'string',
          example: '+998990001100',
          description: 'The phone number of the teacher.',
        },
        email: {
          type: 'string',
          example: 'johndoe@example.com',
          description: 'The email address of the teacher.',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'The password of the teacher.',
        },
        birthDate: {
          type: 'string',
          example: '2003-09-26',
          description: 'The birth date of the teacher.',
        },
        workDay: {
          type: 'string',
          example: 'Dushanba,Seshanba,Chorshanba',
          description: 'The workd day of the teacher.',
        },
        info: {
          type: 'string',
          example: 'Some info',
          description: 'The info of the teacher.',
        },
        isMale: {
          type: 'boolean',
          example: true,
          description: 'The gender of the teacher.',
        },
        typeId: {
          type: 'number',
          example: '12345678',
          description: 'The ID of the type to which this teacher belongs.',
        },
      },
    },
  })
  @Post()
  // @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body(new MyValidationPipe([TeacherDtoGroup.CREATE])) data: TeacherDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.teacherService.create(data, image);
  }

  @ApiQuery({
    name: 'typeId',
    type: 'string',
    example: null,
    required: false,
  })
  @Get()
  // @Auth()
  async findAll(
    @Query(new MyValidationPipe([TeacherDtoGroup.PAGINATION]))
    query: TeacherPagingDto,
  ) {
    return this.teacherService.findAll(query);
  }

  @Get(':id')
  // @Auth()
  async findOne(@Param('id') id: string) {
    return this.teacherService.findById(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '13245678',
          description: 'The ID of the teacher.',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image of the teacher.',
        },
        firstName: {
          type: 'string',
          example: 'John',
          description: 'The first name of the teacher.',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
          description: 'The last name of the teacher.',
        },
        phoneNumber: {
          type: 'string',
          example: '+998990001100',
          description: 'The phone number of the teacher.',
        },
        email: {
          type: 'string',
          example: 'johndoe@example.com',
          description: 'The email address of the teacher.',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'The password of the teacher.',
        },
        birthDate: {
          type: 'string',
          example: '2003-09-26',
          description: 'The birth date of the teacher.',
        },
        workDay: {
          type: 'string',
          example: 'Dushanba,Seshanba,Chorshanba',
          description: 'The workd day of the teacher.',
        },
        info: {
          type: 'string',
          example: 'Some info',
          description: 'The info of the teacher.',
        },
        isMale: {
          type: 'boolean',
          example: true,
          description: 'The gender of the teacher.',
        },
        typeId: {
          type: 'number',
          example: '12345678',
          description: 'The ID of the type to which this teacher belongs.',
        },
      },
    },
  })
  @Patch()
  // @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Body(new MyValidationPipe([TeacherDtoGroup.UPDATE])) data: TeacherDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.teacherService.updateById(data, image);
  }

  @Delete(':id')
  // @Auth()
  async remove(@Param('id') id: string) {
    return this.teacherService.deleteById(id);
  }
}