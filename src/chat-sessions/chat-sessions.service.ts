import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { UpdateChatSessionDto } from './dto/update-chat-session.dto';
import { ChatSession } from './entities/chat-session.entity';

@Injectable()
export class ChatSessionsService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly chatSessionRepository: Repository<ChatSession>,
  ) {}

  async create(createChatSessionDto: CreateChatSessionDto): Promise<ChatSession> {
    const session = this.chatSessionRepository.create(createChatSessionDto);
    return this.chatSessionRepository.save(session);
  }

  async findByChapter(chapterId: string): Promise<ChatSession[]> {
    // [MENTOR]: Las sesiones se ordenan de más reciente a más antigua.
    // Cuando el autor abre un capítulo, quiere ver primero la última conversación,
    // no la primera que tuvo hace semanas. El orden importa para la UX.
    return this.chatSessionRepository.find({
      where: { chapterId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ChatSession> {
    const session = await this.chatSessionRepository.findOneBy({ id });

    if (!session) {
      throw new NotFoundException(`ChatSession with id ${id} not found`);
    }

    return session;
  }

  async update(id: string, updateChatSessionDto: UpdateChatSessionDto): Promise<ChatSession> {
    const session = await this.findOne(id);
    Object.assign(session, updateChatSessionDto);
    return this.chatSessionRepository.save(session);
  }

  async remove(id: string): Promise<void> {
    const session = await this.findOne(id);
    await this.chatSessionRepository.remove(session);
  }
}
