import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  // [MENTOR]: GET /messages/sessions/:sessionId → historial completo de la sesión.
  // Este es el endpoint más importante de este módulo — es el que usarás para
  // reconstruir la conversación antes de enviar un nuevo mensaje a la IA.
  // Obtienes el array de mensajes, lo pasas directamente a la API de Claude,
  // y adjuntas el nuevo mensaje del usuario al final.
  @Get('/sessions/:sessionId')
  findBySession(@Param('sessionId', ParseUUIDPipe) sessionId: string) {
    return this.messagesService.findBySession(sessionId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.messagesService.remove(id);
  }
}
