import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { PGBaseModel } from '../../../base/base.model';
import { FileDto } from './file.dto';
import { PG_TABLE_NAMES } from '../../../common/constant/tables';
import { ProductDto } from '../../product/product.dto';
import { DataTypes } from 'sequelize';
import { MessageModel } from '../message.model';

@Table({ tableName: PG_TABLE_NAMES.FILE, underscored: true })
export class FileModel extends PGBaseModel<FileDto, FileDto> {
  @Column({ allowNull: false })
  fileName: string;

  @ForeignKey(() => MessageModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  messageId: string;

  @BelongsTo(() => MessageModel)
  message?: ProductDto;
}
