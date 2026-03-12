import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { Novel } from '../../novels/entities/novel.entity';
import { CharacterRole } from '../enums/character-role.enum';
import { CharacterStatus } from '../enums/character-status.enum';

@Entity()
export class Character {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // [MENTOR]: Mismo patrón FK de siempre. Un personaje pertenece a una novela.
  @ManyToOne(() => Novel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  @Column({ name: 'novel_id' })
  novelId: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: CharacterRole })
  role: CharacterRole;

  @Column({ type: 'int', nullable: true })
  age: number | null;

  // [MENTOR]: Estos campos son todos text nullable porque son descriptivos y opcionales.
  // Al crear un personaje quizás solo sabes el nombre y el rol.
  // El resto se puede ir completando a medida que desarrollas la historia.
  @Column({ type: 'text', nullable: true })
  physical_description: string | null;

  @Column({ type: 'text', nullable: true })
  personality: string | null;

  @Column({ type: 'text', nullable: true })
  strengths: string | null;

  @Column({ type: 'text', nullable: true })
  weaknesses: string | null;

  @Column({ type: 'text', nullable: true })
  fears: string | null;

  @Column({ type: 'text', nullable: true })
  goals: string | null;

  @Column({ type: 'text', nullable: true })
  motivations: string | null;

  @Column({ type: 'text', nullable: true })
  backstory: string | null;

  @Column({
    type: 'enum',
    enum: CharacterStatus,
    default: CharacterStatus.ALIVE,
  })
  status: CharacterStatus;

  // [MENTOR]: @ManyToMany define el lado INVERSO de la relación.
  // El lado DUEÑO (con @JoinTable) vive en Chapter — ahí es donde TypeORM
  // creará y gestionará la tabla pivote 'chapter_characters'.
  //
  // ¿Por qué Chapter es el dueño y no Character?
  // Convención: el dueño suele ser la entidad que "contiene" a la otra.
  // Un capítulo contiene personajes, no al revés.
  //
  // El segundo argumento (chapter) => chapter.characters le dice a TypeORM
  // cómo navegar al otro lado de la relación si necesita hacer el JOIN inverso.
  @ManyToMany(() => Chapter, (chapter) => chapter.characters)
  chapters: Chapter[];

  @CreateDateColumn()
  created_at: Date;
}
