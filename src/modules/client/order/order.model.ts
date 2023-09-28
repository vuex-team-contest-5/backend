import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { PGBaseModel } from '../../../base/base.model';
import { OrderDto } from './order.dto';
import { PG_TABLE_NAMES } from '../../../common/constant/tables';
import { ProductModel } from '../../product/product.model';
import { ProductDto } from '../../product/product.dto';
import { DataTypes } from 'sequelize';
import { ClientModel } from '../client.model';
import { ClientDto } from '../client.dto';

@Table({ tableName: PG_TABLE_NAMES.ORDER, underscored: true })
export class OrderModel extends PGBaseModel<OrderDto, OrderDto> {
  @Column({ allowNull: false })
  count: number;

  @ForeignKey(() => ProductModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  productId: string;

  @ForeignKey(() => ClientModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  clientId: string;

  @BelongsTo(() => ProductModel)
  product?: ProductDto;

  @BelongsTo(() => ClientModel)
  client?: ClientDto;
}
