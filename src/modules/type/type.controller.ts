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
import { TypeService } from './type.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TypeDto, TypeDtoGroup, TypePagingDto } from './type.dto';
import { MyValidationPipe } from 'src/common/validators/validation.pipe';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@Controller('type')
@ApiTags('Type')
@ApiBearerAuth('admin_auth')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async create(
    @Body(new MyValidationPipe([TypeDtoGroup.CREATE]))
    data: TypeDto,
  ) {
    return this.typeService.create(data);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async findAll(
    @Query(new MyValidationPipe([TypeDtoGroup.PAGINATION]))
    query: TypePagingDto,
  ) {
    return this.typeService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.typeService.findById(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch()
  async update(
    @Body(new MyValidationPipe([TypeDtoGroup.UPDATE]))
    data: TypeDto,
  ) {
    return this.typeService.updateById(data);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.typeService.deleteById(id);
  }
}
