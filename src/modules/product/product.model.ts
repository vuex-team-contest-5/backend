import {
  Table,
  Column,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PGBaseModel } from '../../base/base.model';
import { PG_TABLE_NAMES } from '../../common/constant/tables';
import { ProductDto } from './product.dto';
import { DataTypes } from 'sequelize';
import { CategoryModel } from '../category/category.model';
import { CategoryDto } from '../category/category.dto';
import { OrderModel } from '../client/order/order.model';
import { OrderDto } from '../client/order/order.dto';

@Table({ tableName: PG_TABLE_NAMES.PRODUCT, underscored: true })
export class ProductModel extends PGBaseModel<ProductDto, ProductDto> {
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  price: string;

  @Column({ allowNull: false })
  brand: string;

  @Column({ type: DataTypes.TEXT, allowNull: false })
  info: string;

  @Column({ allowNull: false })
  count: number;

  @Column
  imageName: string;

  @Column({ allowNull: false })
  type: string;

  @ForeignKey(() => CategoryModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  categoryId: string;

  @BelongsTo(() => CategoryModel)
  category?: CategoryDto;

  @HasMany(() => OrderModel)
  order: OrderDto[];
}
