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
import { ProductService } from './product.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProductDto, ProductDtoGroup, ProductPagingDto } from './product.dto';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../../common/validators/image-validation.pipe';

@Controller('product')
@ApiTags('Product')
@ApiBearerAuth('admin_auth')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'name',
        'price',
        'brand',
        'info',
        'count',
        'type',
        'status',
        'categoryId',
      ],
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image of the product.',
        },
        name: {
          type: 'string',
          example: 'Whey Protein',
          description: 'The name of the product.',
        },
        price: {
          type: 'string',
          example: '$20',
          description: 'The price of the product.',
        },
        brand: {
          type: 'string',
          example: 'Chocolate Hazeinut',
          description: 'The brand of the product.',
        },
        info: {
          type: 'string',
          example: 'Some info',
          description: 'The info of the product.',
        },
        count: {
          type: 'number',
          example: '150',
          description: 'The count of the product.',
        },
        type: {
          type: 'string',
          example: 'product',
          description: 'The type of the product.',
        },
        status: {
          type: 'boolean',
          example: 'true',
          description: 'The status of the product.',
        },
        categoryId: {
          type: 'string',
          example: '12345678',
          description: 'The ID of the category to which this product belongs.',
        },
      },
    },
  })
  @Post()
  // @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body(new MyValidationPipe([ProductDtoGroup.CREATE])) data: ProductDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.productService.create(data, image);
  }

  @ApiQuery({
    name: 'type',
    type: 'string',
    example: 'product',
  })
  @ApiQuery({
    name: 'categoryId',
    type: 'string',
    example: null,
    required: false,
  })
  @Get()
  // @Auth()
  async findAll(
    @Query(new MyValidationPipe([ProductDtoGroup.PAGINATION]))
    query: ProductPagingDto,
  ) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  // @Auth()
  async findOne(@Param('id') id: string) {
    return this.productService.findById(id);
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
          description: 'The ID of the product.',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image of the product.',
        },
        name: {
          type: 'string',
          example: 'Whey Protein',
          description: 'The name of the product.',
        },
        price: {
          type: 'string',
          example: '$20',
          description: 'The price of the product.',
        },
        brand: {
          type: 'string',
          example: 'Chocolate Hazeinut',
          description: 'The brand of the product.',
        },
        info: {
          type: 'string',
          example: 'Some info',
          description: 'The info of the product.',
        },
        count: {
          type: 'number',
          example: '150',
          description: 'The count of the product.',
        },
        type: {
          type: 'string',
          example: 'product',
          description: 'The type of the product.',
        },
        status: {
          type: 'boolean',
          example: 'true',
          description: 'The status of the product.',
        },
        categoryId: {
          type: 'string',
          example: '12345678',
          description: 'The ID of the category to which this product belongs.',
        },
      },
    },
  })
  @Patch()
  // @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Body(new MyValidationPipe([ProductDtoGroup.UPDATE])) data: ProductDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.productService.updateById(data, image);
  }

  @Delete(':id')
  // @Auth()
  async remove(@Param('id') id: string) {
    return this.productService.deleteById(id);
  }
}
