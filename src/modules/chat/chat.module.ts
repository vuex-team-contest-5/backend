import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from '../admin/admin.module';
import { ClientModule } from '../client/client.module';
import { ChatModel } from './chat.model';

@Module({
  imports: [SequelizeModule.forFeature([ChatModel]), AdminModule, ClientModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
