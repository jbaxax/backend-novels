import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Novel } from '../../novels/entities/novel.entity';

@Entity()
export class Volume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // [MENTOR]: @ManyToOne define la relación "muchos volúmenes pertenecen a una novela".
  // Leído al revés: una novela tiene muchos volúmenes.
  // TypeORM usa esto para saber cómo hacer los JOINs cuando consultes datos relacionados.
  //
  // { onDelete: 'CASCADE' } significa: si borras la novela padre,
  // todos sus volúmenes se borran automáticamente en la BD.
  // Sin esto, intentar borrar una novela con volúmenes daría un error de FK constraint.
  @ManyToOne(() => Novel, { onDelete: 'CASCADE' })
  // [MENTOR]: @JoinColumn({ name: 'novel_id' }) le dice a TypeORM cómo llamar
  // a la columna FK en la tabla. Sin esto la llamaría 'novelId' (camelCase) por defecto.
  // Usamos snake_case para seguir la convención de nombres en PostgreSQL.
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  // [MENTOR]: Esta columna almacena solo el UUID de la novela (la FK en sí).
  // Tener tanto "novel" (el objeto completo) como "novelId" (el UUID solo)
  // parece redundante pero es muy útil: cuando solo necesitas el ID no tienes
  // que hacer un JOIN costoso a la tabla novels.
  @Column({ name: 'novel_id' })
  novelId: string;

  @Column()
  number: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  synopsis: string | null;

  // [MENTOR]: 'focus' describe en qué conflicto se centra el volumen.
  // También es nullable porque al crear el volumen quizás aún no lo sabes.
  @Column({ type: 'text', nullable: true })
  focus: string | null;

  @CreateDateColumn()
  created_at: Date;
}
