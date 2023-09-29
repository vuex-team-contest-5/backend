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

@Controller('type')
@ApiTags('Type')
@ApiBearerAuth('admin_auth')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body(new MyValidationPipe([TypeDtoGroup.CREATE]))
    data: TypeDto,
  ) {
    return this.typeService.create(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query(new MyValidationPipe([TypeDtoGroup.PAGINATION]))
    query: TypePagingDto,
  ) {
    return this.typeService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.typeService.findById(id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body(new MyValidationPipe([TypeDtoGroup.UPDATE]))
    data: TypeDto,
  ) {
    return this.typeService.updateById(data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.typeService.deleteById(id);
  }
}
