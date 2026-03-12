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
import { ChatSessionsService } from './chat-sessions.service';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { UpdateChatSessionDto } from './dto/update-chat-session.dto';

// [MENTOR]: Ya conoces este patrón completamente.
// Mismo controlador de siempre: ParseUUIDPipe en params, 204 en DELETE,
// un endpoint extra para filtrar por entidad padre (chapter).
@Controller('chat-sessions')
export class ChatSessionsController {
  constructor(private readonly chatSessionsService: ChatSessionsService) {}

  @Post()
  create(@Body() createChatSessionDto: CreateChatSessionDto) {
    return this.chatSessionsService.create(createChatSessionDto);
  }

  // [MENTOR]: GET /chat-sessions/chapters/:chapterId
  // El frontend lo usa para mostrar el historial de sesiones de un capítulo.
  // Viene ordenado de más reciente a más antigua (lo definimos en el servicio).
  @Get('/chapters/:chapterId')
  findByChapter(@Param('chapterId', ParseUUIDPipe) chapterId: string) {
    return this.chatSessionsService.findByChapter(chapterId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatSessionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateChatSessionDto: UpdateChatSessionDto,
  ) {
    return this.chatSessionsService.update(id, updateChatSessionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatSessionsService.remove(id);
  }
}
