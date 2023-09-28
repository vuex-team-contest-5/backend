import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientModel } from './client.model';
import { TeacherModule } from '../teacher/teacher.module';
import { ImageModule } from '../image/image.module';
import { OrderModel } from './order/order.model';
import { ProductModule } from '../product/product.module';
import { ProductModel } from '../product/product.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ClientModel, OrderModel, ProductModel]),
    TeacherModule,
    ImageModule,
    ProductModule,
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
