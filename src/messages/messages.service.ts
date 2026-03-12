import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(message);
  }

  async findBySession(sessionId: string): Promise<Message[]> {
    // [MENTOR]: ASC aquí es crítico — los mensajes deben estar en orden cronológico
    // para que la conversación tenga sentido.
    // Cuando construyas el contexto para enviarle a la IA, necesitas:
    // [mensaje1_user, mensaje1_assistant, mensaje2_user, mensaje2_assistant, ...]
    // Si el orden fuera DESC o aleatorio, la IA respondería sin coherencia
    // porque el historial estaría desordenado.
    return this.messageRepository.find({
      where: { sessionId },
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepository.findOneBy({ id });

    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto): Promise<Message> {
    const message = await this.findOne(id);
    Object.assign(message, updateMessageDto);
    return this.messageRepository.save(message);
  }

  async remove(id: string): Promise<void> {
    const message = await this.findOne(id);
    await this.messageRepository.remove(message);
  }
}
