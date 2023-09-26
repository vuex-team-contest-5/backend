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
  @Column({ type: DataTypes.UUID })
  declare id: string;

  @CreatedAt
  declare createdAt: string;

  @Column
  createdBy?: string;

  @UpdatedAt
  declare updatedAt?: string;

  @DeletedAt
  declare deletedAt?: string;

  @Column
  deletedBy?: string;
}
