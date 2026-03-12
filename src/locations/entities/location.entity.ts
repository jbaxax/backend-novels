import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Novel } from '../../novels/entities/novel.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Novel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  @Column({ name: 'novel_id' })
  novelId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // [MENTOR]: Aquí está el self-join — una relación @ManyToOne donde la entidad
  // de destino es la MISMA clase (Location → Location).
  //
  // Es exactamente igual que FK a otra tabla, pero apunta a sí misma.
  // TypeORM lo maneja sin ningún truco especial.
  //
  // nullable: true en @ManyToOne significa que puede no tener padre —
  // los lugares raíz (continentes, planetas, etc.) no tienen padre.
  //
  // { nullable: true } en @JoinColumn configura la FK en la BD como opcional.
  @ManyToOne(() => Location, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'connected_to' })
  parent: Location | null;

  // [MENTOR]: { nullable: true } aquí en @Column permite que la columna sea NULL.
  // Un lugar raíz tendrá connected_to = NULL en la base de datos.
  // onDelete: 'SET NULL' en la relación significa: si el lugar padre se borra,
  // los hijos no se borran — simplemente quedan sin padre (connected_to = NULL).
  // Tiene más sentido que CASCADE aquí: si borras Argentina, Buenos Aires no desaparece.
  @Column({ name: 'connected_to', nullable: true })
  parentId: string | null;
}
