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
import { TypeService } from './type.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/auth.decorator';
import { TypeDto, TypeDtoGroup, TypePagingDto } from './type.dto';
import { MyValidationPipe } from 'src/common/validators/validation.pipe';

@Controller('type')
@ApiTags('Type')
@ApiBearerAuth('admin_auth')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Post()
  // @Auth()
  async create(
    @Body(new MyValidationPipe([TypeDtoGroup.CREATE]))
    data: TypeDto,
  ) {
    return this.typeService.create(data);
  }

  @Get()
  // @Auth()
  async findAll(
    @Query(new MyValidationPipe([TypeDtoGroup.PAGINATION]))
    query: TypePagingDto,
  ) {
    return this.typeService.findAll(query);
  }

  @Get(':id')
  // @Auth()
  async findOne(@Param('id') id: string) {
    return this.typeService.findById(id);
  }

  @Patch()
  // @Auth()
  async update(
    @Body(new MyValidationPipe([TypeDtoGroup.UPDATE]))
    data: TypeDto,
  ) {
    return this.typeService.updateById(data);
  }

  @Delete(':id')
  // @Auth()
  async remove(@Param('id') id: string) {
    return this.typeService.deleteById(id);
  }
}
