import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { ChatSession } from '../chat-sessions/entities/chat-session.entity';
import { Chapter } from '../chapters/entities/chapter.entity';
import { Message } from '../messages/entities/message.entity';
import { WorldRule } from '../world-rules/entities/world-rule.entity';
import { Novel } from '../novels/entities/novel.entity';
import { MessageRole } from '../messages/enums/message-role.enum';

// [MENTOR]: Este servicio soporta dos proveedores de IA: Gemini y Ollama (local).
// El proveedor activo se controla con AI_PROVIDER en el .env:
//   AI_PROVIDER=gemini  → usa la API de Google
//   AI_PROVIDER=ollama  → usa el modelo local instalado con Ollama
//
// ¿Por qué esta arquitectura? Porque la lógica de negocio (cargar contexto,
// guardar mensajes) es idéntica para ambos. Solo cambia la llamada a la IA.
// Si mañana quieres agregar OpenAI, solo agregas un caso más en callAI().
@Injectable()
export class GenerationService {
  private readonly gemini: GoogleGenerativeAI;
  private readonly ollama: OpenAI;
  private readonly provider: string;

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
    this.provider = this.configService.get<string>('AI_PROVIDER') ?? 'gemini';

    if (this.provider === 'gemini') {
      this.gemini = new GoogleGenerativeAI(
        this.configService.getOrThrow<string>('GEMINI_API_KEY'),
      );
    }

    // [MENTOR]: Ollama expone una API compatible con OpenAI en localhost:11434.
    // Usamos el paquete 'openai' apuntando a esa URL local — no necesitamos
    // instalar ningún paquete extra específico de Ollama.
    if (this.provider === 'ollama') {
      this.ollama = new OpenAI({
        baseURL: this.configService.get<string>('OLLAMA_URL') ?? 'http://localhost:11434/v1',
        apiKey: 'ollama', // Ollama no requiere API key real, pero el cliente la exige
      });
    }
  }

  async generate(sessionId: string, prompt: string): Promise<string> {
    const session = await this.sessionRepository.findOneBy({ id: sessionId });
    if (!session) {
      throw new NotFoundException(`ChatSession with id ${sessionId} not found`);
    }

    const chapter = await this.chapterRepository.findOne({
      where: { id: session.chapterId },
      relations: { characters: true, volume: true },
    });
    if (!chapter) {
      throw new NotFoundException(`Chapter with id ${session.chapterId} not found`);
    }

    const novel = await this.novelRepository.findOneBy({
      id: chapter.volume.novelId,
    });
    if (!novel) {
      throw new NotFoundException(`Novel with id ${chapter.volume.novelId} not found`);
    }

    const worldRules = await this.worldRuleRepository.findBy({
      novelId: chapter.volume.novelId,
    });

    const previousMessages = await this.messageRepository.find({
      where: { sessionId },
      order: { created_at: 'ASC' },
    });

    const systemPrompt = this.buildSystemPrompt(novel, chapter, worldRules);

    // [MENTOR]: Delegamos la llamada al proveedor correcto según AI_PROVIDER.
    // El resto del método (guardar mensajes, retornar) es igual para ambos.
    const responseText = await this.callAI(systemPrompt, previousMessages, prompt);

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

  private async callAI(
    systemPrompt: string,
    previousMessages: Message[],
    prompt: string,
  ): Promise<string> {
    if (this.provider === 'ollama') {
      // [MENTOR]: Ollama (vía API compatible con OpenAI) espera el historial
      // como un array de mensajes con role 'user' | 'assistant'.
      // El system prompt va como primer mensaje con role 'system'.
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...previousMessages.map((msg) => ({
          role: msg.role === MessageRole.USER ? ('user' as const) : ('assistant' as const),
          content: msg.content,
        })),
        { role: 'user', content: prompt },
      ];

      const response = await this.ollama.chat.completions.create({
        model: this.configService.get<string>('OLLAMA_MODEL') ?? 'mistral',
        messages,
      });

      return response.choices[0].message.content ?? '';
    }

    // Gemini (default)
    // [MENTOR]: Gemini usa 'user' y 'model' como roles — diferente a OpenAI.
    // El system prompt se pasa por separado en systemInstruction, no en el historial.
    const history = previousMessages.map((msg) => ({
      role: msg.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const model = this.gemini.getGenerativeModel({
      model: this.configService.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash-lite',
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  }

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
