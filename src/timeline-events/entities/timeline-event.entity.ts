import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { Novel } from '../../novels/entities/novel.entity';
import { EventImportance } from '../enums/event-importance.enum';

@Entity()
export class TimelineEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // [MENTOR]: Esta FK es obligatoria — un evento siempre pertenece a una novela.
  // Sin novela no hay línea de tiempo. Mismo patrón de siempre.
  @ManyToOne(() => Novel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  @Column({ name: 'novel_id' })
  novelId: string;

  // [MENTOR]: Esta FK es NULLABLE — y aquí está el concepto nuevo.
  //
  // { nullable: true } en @ManyToOne le dice a TypeORM que esta relación es opcional.
  // Un evento puede existir sin estar vinculado a ningún capítulo (lore previo).
  //
  // onDelete: 'SET NULL' → si el capítulo se borra, el evento no desaparece.
  // Solo pierde su vínculo: chapter_id pasa a NULL. El evento sigue existiendo.
  // Tiene sentido: la historia pasó aunque el capítulo que la narraba se reescriba.
  //
  // Compara con CASCADE: si usaras CASCADE aquí, borrar un capítulo borraría
  // todos los eventos históricos vinculados a él — eso sería una pérdida de datos grave.
  @ManyToOne(() => Chapter, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'chapter_id' })
  chapter: Chapter | null;

  // [MENTOR]: La columna también necesita nullable: true para que PostgreSQL
  // permita guardar NULL en esa columna. Si no lo pones, la BD rechazará
  // cualquier INSERT sin chapter_id con un error de constraint.
  @Column({ name: 'chapter_id', nullable: true })
  chapterId: string | null;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  // [MENTOR]: story_date es un varchar libre, no un DATE de PostgreSQL.
  // La razón: en una novela de fantasía las fechas no siguen el calendario real.
  // "Año 3 del Imperio", "Luna de la Cosecha", "Antes de la Gran Caída"
  // son fechas válidas dentro del mundo ficticio. Un tipo DATE no las podría almacenar.
  // Cuando el dominio de negocio no encaja en un tipo estándar, usa el más flexible.
  @Column()
  story_date: string;

  @Column({ type: 'enum', enum: EventImportance, default: EventImportance.MEDIUM })
  importance: EventImportance;

  @CreateDateColumn()
  created_at: Date;
}
