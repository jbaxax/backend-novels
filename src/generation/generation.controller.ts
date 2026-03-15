import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { GenerateDto } from './dto/generate.dto';

// [MENTOR]: El endpoint vive bajo /chat-sessions/:sessionId/generate
// porque la generación siempre ocurre dentro del contexto de una sesión.
// Una sesión tiene un capítulo, y un capítulo tiene personajes, resumen y reglas —
// todo el contexto que la IA necesita para generar bien.
@Controller('chat-sessions')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post(':sessionId/generate')
  generate(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() generateDto: GenerateDto,
  ) {
    return this.generationService.generate(sessionId, generateDto.prompt);
  }
}
