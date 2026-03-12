import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Novel } from '../../novels/entities/novel.entity';
import { RuleCategory } from '../enums/rule-category.enum';

// [MENTOR]: Ya conoces todo esto. FK a novels, enum para categoría, boolean para is_breakable.
// Sin @CreateDateColumn porque el DER no lo especifica para esta tabla.
// Regla: no agregues columnas que no están en el diseño original sin una razón clara.
@Entity()
export class WorldRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Novel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  @Column({ name: 'novel_id' })
  novelId: string;

  @Column({ type: 'enum', enum: RuleCategory })
  category: RuleCategory;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  // [MENTOR]: is_breakable indica si esta regla del mundo puede romperse en la trama.
  // Una regla no rompible es una constante del universo (ej: "nadie puede revivir muertos").
  // Una rompible es una tensión narrativa (ej: "solo los elegidos pueden usar magia" — ¿y si aparece alguien que no debería poder?).
  @Column({ default: false })
  is_breakable: boolean;
}
