import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessageModel } from './message.model';
import { AdminModule } from '../admin/admin.module';
import { ClientModule } from '../client/client.module';
import { ChatModule } from '../chat/chat.module';
import { FileModel } from './file/file.model';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    SequelizeModule.forFeature([MessageModel, FileModel]),
    AdminModule,
    ClientModule,
    ChatModule,
    ImageModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
