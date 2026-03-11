import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Character } from '../../characters/entities/character.entity';
import { Volume } from '../../volumes/entities/volume.entity';
import { ChapterStatus } from '../enums/chapter-status.enum';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // [MENTOR]: Mismo patrón FK que vimos en Volume → Novel.
  // Un capítulo pertenece a un volumen. Si el volumen se borra, sus capítulos también.
  @ManyToOne(() => Volume, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'volume_id' })
  volume: Volume;

  @Column({ name: 'volume_id' })
  volumeId: string;

  @Column()
  number: number;

  @Column()
  title: string;

  // [MENTOR]: summary es el resumen breve del capítulo.
  // Se usará más adelante para inyectarlo como contexto al chat con IA,
  // así el modelo sabe de qué va el capítulo sin leer el contenido completo.
  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  // [MENTOR]: type: 'enum' le dice a PostgreSQL que cree una columna de tipo ENUM.
  // PostgreSQL valida a nivel de BD que solo entren los valores permitidos.
  // Tenemos doble validación: class-validator en el DTO (antes de llegar a la BD)
  // y el tipo ENUM en PostgreSQL (como red de seguridad final).
  // default: ChapterStatus.DRAFT tiene sentido — todo capítulo empieza como borrador.
  @Column({
    type: 'enum',
    enum: ChapterStatus,
    default: ChapterStatus.DRAFT,
  })
  status: ChapterStatus;

  // [MENTOR]: Este es el lado DUEÑO de la relación many-to-many.
  // @JoinTable() le dice a TypeORM: "tú eres responsable de crear la tabla pivote".
  // Solo UN lado de la relación debe tener @JoinTable — si lo pones en los dos, TypeORM
  // crea dos tablas pivote distintas y todo se rompe.
  //
  // name: 'chapter_characters' → nombre exacto de la tabla pivote en PostgreSQL
  // joinColumn → la columna que apunta a ESTA entidad (Chapter)
  // inverseJoinColumn → la columna que apunta a la otra entidad (Character)
  @ManyToMany(() => Character, (character) => character.chapters)
  @JoinTable({
    name: 'chapter_characters',
    joinColumn: { name: 'chapter_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'character_id', referencedColumnName: 'id' },
  })
  characters: Character[];

  @CreateDateColumn()
  created_at: Date;
}
