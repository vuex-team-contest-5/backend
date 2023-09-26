import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TypeModel } from './type.model';

@Module({
  imports: [SequelizeModule.forFeature([TypeModel])],
  controllers: [TypeController],
  providers: [TypeService],
  exports: [TypeService],
})
export class TypeModule {}
