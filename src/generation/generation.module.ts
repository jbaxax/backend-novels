import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerationService } from './generation.service';
import { GenerationController } from './generation.controller';
import { ChatSession } from '../chat-sessions/entities/chat-session.entity';
import { Chapter } from '../chapters/entities/chapter.entity';
import { Message } from '../messages/entities/message.entity';
import { WorldRule } from '../world-rules/entities/world-rule.entity';
import { Novel } from '../novels/entities/novel.entity';

// [MENTOR]: Este módulo registra todos los repositorios que GenerationService necesita.
// Aunque estas entidades ya están registradas en sus propios módulos,
// cada módulo en NestJS tiene su propio scope — si quieres usar un Repository<X>
// en un módulo distinto, debes registrar la entidad X en ese módulo también
// usando forFeature(). No hay duplicado en la BD, solo en el contenedor de DI.
@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSession, Chapter, Message, WorldRule, Novel]),
  ],
  controllers: [GenerationController],
  providers: [GenerationService],
})
export class GenerationModule {}
