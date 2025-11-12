import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { DatabaseService } from '../database/database.service';

@Module({
  providers: [ChatGateway, ChatService, DatabaseService],
})
export class ChatModule {}
