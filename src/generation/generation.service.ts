import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatSession } from '../chat-sessions/entities/chat-session.entity';
import { Chapter } from '../chapters/entities/chapter.entity';
import { Message } from '../messages/entities/message.entity';
import { WorldRule } from '../world-rules/entities/world-rule.entity';
import { Novel } from '../novels/entities/novel.entity';
import { MessageRole } from '../messages/enums/message-role.enum';

// [MENTOR]: Este servicio es el corazón de la aplicación.
// Orquesta 4 cosas:
//   1. Traer el contexto relevante de la BD (capítulo, personajes, reglas, historial)
//   2. Construir el prompt del sistema para darle personalidad a la IA
//   3. Llamar a la API de Gemini con ese contexto
//   4. Guardar la conversación en la BD para que sea persistente
//
// Separar esto en su propio módulo es importante porque esta lógica
// no pertenece ni a chat-sessions ni a messages — es una operación
// que cruza múltiples dominios.
@Injectable()
export class GenerationService {
  private readonly gemini: GoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ChatSession)
    private readonly sessionRepository: Repository<ChatSession>,
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(WorldRule)
    private readonly worldRuleRepository: Repository<WorldRule>,
    @InjectRepository(Novel)
    private readonly novelRepository: Repository<Novel>,
  ) {
    // [MENTOR]: Inicializamos el cliente de Gemini una sola vez en el constructor.
    // Al inyectarlo como servicio singleton, NestJS garantiza que esto
    // solo se ejecuta una vez durante toda la vida de la aplicación.
    this.gemini = new GoogleGenerativeAI(
      this.configService.getOrThrow<string>('GEMINI_API_KEY'),
    );
  }

  async generate(sessionId: string, prompt: string): Promise<string> {
    // PASO 1: Cargar la sesión y verificar que existe
    const session = await this.sessionRepository.findOneBy({ id: sessionId });
    if (!session) {
      throw new NotFoundException(`ChatSession with id ${sessionId} not found`);
    }

    // PASO 2: Cargar el capítulo con sus personajes y volumen
    // [MENTOR]: Cargamos las relaciones que necesitamos de una sola query.
    // characters nos da los personajes del capítulo.
    // volume nos da el volumeId para luego obtener la novelId.
    const chapter = await this.chapterRepository.findOne({
      where: { id: session.chapterId },
      relations: { characters: true, volume: true },
    });
    if (!chapter) {
      throw new NotFoundException(`Chapter with id ${session.chapterId} not found`);
    }

    // PASO 3: Cargar la novela para tener título y descripción
    const novel = await this.novelRepository.findOneBy({
      id: chapter.volume.novelId,
    });
    if (!novel) {
      throw new NotFoundException(`Novel with id ${chapter.volume.novelId} not found`);
    }

    // PASO 4: Cargar las reglas del mundo de esta novela
    const worldRules = await this.worldRuleRepository.findBy({
      novelId: chapter.volume.novelId,
    });

    // PASO 5: Cargar el historial de mensajes de esta sesión en orden cronológico
    // [MENTOR]: ASC es crítico — Gemini necesita el historial en orden
    // [user, model, user, model, ...] para entender el contexto de la conversación.
    const previousMessages = await this.messageRepository.find({
      where: { sessionId },
      order: { created_at: 'ASC' },
    });

    // PASO 6: Construir el prompt del sistema
    // [MENTOR]: El system prompt es la "personalidad" y el contexto base de la IA.
    // Todo lo que ponemos aquí estará disponible en TODOS los mensajes de la sesión.
    // Es la diferencia entre un asistente genérico y uno que conoce tu novela.
    const systemPrompt = this.buildSystemPrompt(novel, chapter, worldRules);

    // PASO 7: Convertir el historial al formato que espera Gemini
    // [MENTOR]: Gemini usa 'user' y 'model' como roles (no 'assistant' como Claude/OpenAI).
    // Por eso mapeamos MessageRole.ASSISTANT → 'model'.
    const history = previousMessages.map((msg) => ({
      role: msg.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // PASO 8: Llamar a la API de Gemini
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    // PASO 9: Guardar ambos mensajes en la BD
    // [MENTOR]: Guardamos SIEMPRE los dos mensajes juntos — el del usuario y el de la IA.
    // Si solo guardáramos el de la IA, perderíamos el historial de lo que pidió el usuario,
    // y la próxima vez que el autor abra el chat no entendería por qué la IA respondió eso.
    await this.messageRepository.save([
      this.messageRepository.create({
        sessionId,
        role: MessageRole.USER,
        content: prompt,
      }),
      this.messageRepository.create({
        sessionId,
        role: MessageRole.ASSISTANT,
        content: responseText,
      }),
    ]);

    return responseText;
  }

  // [MENTOR]: Separamos la construcción del prompt en su propio método privado
  // para que generate() sea fácil de leer. Cada método hace UNA sola cosa.
  private buildSystemPrompt(novel: Novel, chapter: Chapter, worldRules: WorldRule[]): string {
    const charactersText = chapter.characters
      .map(
        (c) =>
          `- ${c.name} (${c.role}): ${c.personality ?? 'Sin descripción'}. Objetivos: ${c.goals ?? 'No definidos'}. Estado: ${c.status}.`,
      )
      .join('\n');

    const rulesText = worldRules
      .map(
        (r) =>
          `- [${r.category}] ${r.name}: ${r.description}${r.is_breakable ? ' (puede romperse en la trama)' : ' (regla inamovible)'}`,
      )
      .join('\n');

    return `Eres un asistente especializado en escritura creativa de novelas históricas de fantasía.
Tu rol es ayudar al autor a escribir, desarrollar y mejorar su novela.
Responde siempre en español. Sé creativo, coherente con el contexto y respetuoso del tono de la historia.

=== NOVELA ===
Título: ${novel.title}
Descripción: ${novel.description ?? 'Sin descripción'}

=== CAPÍTULO ACTUAL ===
Número: ${chapter.number}
Título: ${chapter.title}
Resumen: ${chapter.summary ?? 'Sin resumen'}
Estado: ${chapter.status}

=== PERSONAJES EN ESTE CAPÍTULO ===
${charactersText || 'No hay personajes asignados a este capítulo.'}

=== REGLAS DEL MUNDO ===
${rulesText || 'No hay reglas definidas.'}

Cuando el autor te pida escribir texto para la novela, escríbelo en un estilo literario de calidad.
Cuando te haga preguntas sobre la historia o personajes, responde de forma concisa y útil.`;
  }
}
