import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModel } from './product.model';
import { CategoryModule } from '../category/category.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductModel]),
    CategoryModule,
    ImageModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
