import {
  Table,
  Column,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PGBaseModel } from '../../base/base.model';
import { PG_TABLE_NAMES } from '../../common/constant/tables';
import { TeacherDto } from './teacher.dto';
import { DataTypes } from 'sequelize';
import { TypeModel } from '../type/type.model';
import { TypeDto } from '../type/type.dto';

@Table({ tableName: PG_TABLE_NAMES.TEACHER, underscored: true })
export class TeacherModel extends PGBaseModel<TeacherDto, TeacherDto> {
  @Column({ allowNull: false })
  firstName: string;

  @Column({ allowNull: false })
  lastName: string;

  @Column({ allowNull: false })
  phoneNumber: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  hashedPassword: string;

  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  birthDate: string;

  @Column({ allowNull: false })
  workDay: string;

  @Column({ type: DataTypes.TEXT, allowNull: false })
  info: string;

  @Column({ allowNull: false })
  isMale: boolean;

  @Column
  imageName: string;

  @ForeignKey(() => TypeModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  typeId: string;

  @BelongsTo(() => TypeModel)
  type?: TypeDto;

  // @HasMany(() => ClientModel)
  // client: ClientDto[];
}
