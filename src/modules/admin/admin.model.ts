import { Table, Column, HasMany } from 'sequelize-typescript';
import { PGBaseModel } from '../../base/base.model';
import { PG_TABLE_NAMES } from '../../common/constant/tables';
import { AdminDto } from './admin.dto';
import { ChatModel } from '../chat/chat.model';
import { ChatDto } from '../chat/chat.dto';

@Table({ tableName: PG_TABLE_NAMES.ADMIN, underscored: true })
export class AdminModel extends PGBaseModel<AdminDto, AdminDto> {
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

  @Column
  imageName: string;

  @HasMany(() => ChatModel)
  chat: ChatDto[];
}
