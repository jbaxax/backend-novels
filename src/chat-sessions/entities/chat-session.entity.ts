import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chapter } from '../../chapters/entities/chapter.entity';

// [MENTOR]: Esta entidad es intencionalmente simple — solo tiene id, FK y fecha.
// Su propósito es agrupar mensajes bajo un contexto (el capítulo).
// Un capítulo puede tener múltiples sesiones de chat: una por cada vez
// que el autor le pide ayuda a la IA para ese capítulo.
// Así puedes ver el historial completo de cómo evolucionó la escritura.
@Entity()
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // [MENTOR]: FK obligatoria a chapters. Una sesión sin capítulo no tiene sentido
  // porque el contexto del chat (personajes, resumen, etc.) viene del capítulo.
  // CASCADE: si el capítulo se borra, sus sesiones de chat también.
  @ManyToOne(() => Chapter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chapter_id' })
  chapter: Chapter;

  @Column({ name: 'chapter_id' })
  chapterId: string;

  // [MENTOR]: Solo guardamos cuándo se creó la sesión.
  // No tiene título ni descripción — la sesión se identifica por su fecha
  // y por los mensajes que contiene.
  @CreateDateColumn()
  created_at: Date;
}
