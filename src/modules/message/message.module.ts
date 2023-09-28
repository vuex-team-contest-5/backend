import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessageModel } from './message.model';
import { AdminModule } from '../admin/admin.module';
import { ClientModule } from '../client/client.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    SequelizeModule.forFeature([MessageModel]),
    AdminModule,
    ClientModule,
    ChatModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
