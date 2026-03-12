import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatSession } from '../../chat-sessions/entities/chat-session.entity';
import { MessageRole } from '../enums/message-role.enum';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // [MENTOR]: FK a chat_sessions. Un mensaje siempre pertenece a una sesión.
  // CASCADE: si la sesión se borra, todos sus mensajes se borran también.
  // Tiene sentido — un mensaje sin sesión no tiene contexto ni utilidad.
  @ManyToOne(() => ChatSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: ChatSession;

  @Column({ name: 'session_id' })
  sessionId: string;

  // [MENTOR]: El rol determina quién escribió el mensaje.
  // 'user' = el autor de la novela haciendo una pregunta o dando instrucciones.
  // 'assistant' = la respuesta de la IA.
  // Este campo es lo que permite reconstruir la conversación en orden
  // y enviársela a la API de Claude con el formato correcto.
  @Column({ type: 'enum', enum: MessageRole })
  role: MessageRole;

  // [MENTOR]: El contenido es 'text' (no varchar) porque los mensajes
  // pueden ser muy largos — una respuesta de la IA con varias ideas para
  // una escena puede tener miles de caracteres. varchar tiene límite, text no.
  @Column({ type: 'text' })
  content: string;

  // [MENTOR]: created_at es crítico aquí — es lo que permite ordenar los mensajes
  // cronológicamente para reconstruir la conversación en el orden correcto.
  // Sin este campo no sabrías cuál mensaje vino primero.
  @CreateDateColumn()
  created_at: Date;
}
