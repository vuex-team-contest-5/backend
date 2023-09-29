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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MyValidationPipe } from '../../common/validators/validation.pipe';
import {
  CategoryDto,
  CategoryDtoGroup,
  CategoryPagingDto,
} from './category.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('category')
@ApiTags('Category')
@ApiBearerAuth('admin_auth')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query(new MyValidationPipe([CategoryDtoGroup.PAGINATION]))
    query: CategoryPagingDto,
  ) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body(new MyValidationPipe([CategoryDtoGroup.UPDATE]))
    data: CategoryDto,
  ) {
    return this.categoryService.updateById(data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.categoryService.deleteById(id);
  }
}
