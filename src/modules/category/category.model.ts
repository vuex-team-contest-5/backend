import { Table, Column, HasMany } from 'sequelize-typescript';
import { PGBaseModel } from '../../base/base.model';
import { CategoryDto } from './category.dto';
import { PG_TABLE_NAMES } from '../../common/constant/tables';
import { ProductModel } from '../product/product.model';
import { ProductDto } from '../product/product.dto';

@Table({ tableName: PG_TABLE_NAMES.CATEGORY, underscored: true })
export class CategoryModel extends PGBaseModel<CategoryDto, CategoryDto> {
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  type: string;

  @HasMany(() => ProductModel)
  product: ProductDto[];
}
