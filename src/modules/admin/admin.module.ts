import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModel } from './admin.model';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [SequelizeModule.forFeature([AdminModel]), ImageModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
