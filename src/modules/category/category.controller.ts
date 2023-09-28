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
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import {
  CategoryDto,
  CategoryDtoGroup,
  CategoryPagingDto,
} from './category.dto';
import { Auth } from '../../auth/auth.decorator';

@Controller('category')
@ApiTags('Category')
@ApiBearerAuth('admin_auth')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  // @Auth()
  async create(
    @Body(new MyValidationPipe([CategoryDtoGroup.CREATE]))
    data: CategoryDto,
  ) {
    return this.categoryService.create(data);
  }

  @ApiQuery({
    name: 'type',
    type: 'string',
    example: 'product',
  })
  @Get()
  // @Auth()
  async findAll(
    @Query(new MyValidationPipe([CategoryDtoGroup.PAGINATION]))
    query: CategoryPagingDto,
  ) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  // @Auth()
  async findOne(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Patch()
  // @Auth()
  async update(
    @Body(new MyValidationPipe([CategoryDtoGroup.UPDATE]))
    data: CategoryDto,
  ) {
    return this.categoryService.updateById(data);
  }

  @Delete(':id')
  // @Auth()
  async remove(@Param('id') id: string) {
    return this.categoryService.deleteById(id);
  }
}
