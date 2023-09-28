import {
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { PGBaseModel } from '../../base/base.model';
import { ChatDto } from './chat.dto';
import { PG_TABLE_NAMES } from '../../common/constant/tables';
import { DataTypes } from 'sequelize';
import { AdminModel } from '../admin/admin.model';
import { AdminDto } from '../admin/admin.dto';
import { ClientModel } from '../client/client.model';
import { ClientDto } from '../client/client.dto';
import { MessageModel } from '../message/message.model';
import { MessageDto } from '../message/message.dto';

@Table({ tableName: PG_TABLE_NAMES.CHAT, underscored: true })
export class ChatModel extends PGBaseModel<ChatDto, ChatDto> {
  @ForeignKey(() => AdminModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  adminId: string;

  @ForeignKey(() => ClientModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  clientId: string;

  @BelongsTo(() => AdminModel)
  admin?: AdminDto;

  @BelongsTo(() => ClientModel)
  client?: ClientDto;

  @HasMany(() => MessageModel)
  message: MessageDto[];
}
