import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientModel } from './client.model';
import { TeacherModule } from '../teacher/teacher.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ClientModel]),
    TeacherModule,
    ImageModule,
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
