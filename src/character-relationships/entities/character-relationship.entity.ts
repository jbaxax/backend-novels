import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Character } from '../../characters/entities/character.entity';
import { EmotionalDynamic } from '../enums/emotional-dynamic.enum';
import { RelationshipType } from '../enums/relationship-type.enum';

@Entity()
export class CharacterRelationship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // [MENTOR]: Aquí está el concepto nuevo — dos @ManyToOne apuntando a la MISMA entidad.
  //
  // El problema: TypeORM necesita saber cuál columna FK corresponde a cuál propiedad.
  // Si solo escribieras @ManyToOne(() => Character) dos veces sin @JoinColumn,
  // TypeORM se confundiría y generaría nombres de columna incorrectos.
  //
  // La solución: @JoinColumn({ name: '...' }) en CADA relación para nombrar
  // explícitamente la columna FK. Sin esto, TypeORM intentaría adivinar y fallaría.
  //
  // 'character' = quién siente la relación (el sujeto)
  @ManyToOne(() => Character, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @Column({ name: 'character_id' })
  characterId: string;

  // [MENTOR]: 'relatedCharacter' = hacia quién va la relación (el objeto)
  // Mismo tipo (Character), diferente columna FK y diferente nombre de propiedad.
  // TypeORM las trata como dos relaciones completamente independientes
  // gracias a los @JoinColumn distintos.
  @ManyToOne(() => Character, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'related_character_id' })
  relatedCharacter: Character;

  @Column({ name: 'related_character_id' })
  relatedCharacterId: string;

  @Column({ type: 'enum', enum: RelationshipType })
  relationship_type: RelationshipType;

  @Column({ type: 'enum', enum: EmotionalDynamic })
  emotional_dynamic: EmotionalDynamic;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // [MENTOR]: @Column() en un boolean TypeScript → columna BOOLEAN en PostgreSQL.
  // default: false porque la mayoría de las relaciones no son mutuas por defecto —
  // el autor las define explícitamente cuando lo son.
  @Column({ default: false })
  is_mutual: boolean;
}
