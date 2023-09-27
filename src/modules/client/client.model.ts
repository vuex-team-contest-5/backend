import {
  Table,
  Column,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PGBaseModel } from '../../base/base.model';
import { PG_TABLE_NAMES } from '../../common/constant/tables';
import { ClientDto } from './client.dto';
import { DataTypes } from 'sequelize';
import { TeacherModel } from '../teacher/teacher.model';
import { TeacherDto } from '../teacher/teacher.dto';

@Table({ tableName: PG_TABLE_NAMES.CLIENT, underscored: true })
export class ClientModel extends PGBaseModel<ClientDto, ClientDto> {
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
  servicePrice: string;

  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  startedAt: string;

  @Column({ allowNull: false })
  period: number;

  @Column
  imageName: string;

  @ForeignKey(() => TeacherModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  teacherId: string;

  @BelongsTo(() => TeacherModel)
  teacher?: TeacherDto;

  // @HasMany(() => ChatModel)
  // chat: ChatDto[];

  // @HasMany(() => OrderModel)
  // order: OrderDto[];
}
