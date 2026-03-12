import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { ChatSessionsController } from './chat-sessions.controller';
import { ChatSessionsService } from './chat-sessions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession])],
  controllers: [ChatSessionsController],
  providers: [ChatSessionsService],
})
export class ChatSessionsModule {}
