import { IsUUID } from 'class-validator';
import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey,
  UpdatedAt,
} from 'sequelize-typescript';
import { ENV } from '../common/config/config';
import { DataTypes } from 'sequelize';

export class PGBaseModel<
  TModelAttributes = any,
  TCreationAttributes = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  @PrimaryKey
  @IsUUID(ENV.DB.POSTGRES.UUID_VERSION)
  @Column({ type: DataTypes.UUID, allowNull: false })
  declare id: string;

  @Column({ allowNull: false, defaultValue: true })
  declare status: boolean;

  @CreatedAt
  declare createdAt: string;

  @Column
  declare createdBy?: string;

  @UpdatedAt
  declare updatedAt?: string;

  @DeletedAt
  declare deletedAt?: string;

  @Column
  declare deletedBy?: string;
}
