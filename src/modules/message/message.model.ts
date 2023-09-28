import {
  Table,
  Column,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PGBaseModel } from '../../base/base.model';
import { PG_TABLE_NAMES } from '../../common/constant/tables';
import { MessageDto } from './message.dto';
import { DataTypes } from 'sequelize';
import { ChatModel } from '../chat/chat.model';
import { ChatDto } from '../chat/chat.dto';
import { FileModel } from './file/file.model';
import { FileDto } from './file/file.dto';

@Table({ tableName: PG_TABLE_NAMES.MESSAGE, underscored: true })
export class MessageModel extends PGBaseModel<MessageDto, MessageDto> {
  @Column({ type: DataTypes.TEXT, allowNull: false })
  body: string;

  @Column({ allowNull: false })
  isClient: boolean;

  @Column({ type: DataTypes.DATE })
  seenAt: string;

  @ForeignKey(() => ChatModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  chatId: string;

  @BelongsTo(() => ChatModel)
  chat?: ChatDto;

  @HasMany(() => FileModel)
  file: FileDto[];
}
