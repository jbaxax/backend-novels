import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EmotionalDynamic } from '../enums/emotional-dynamic.enum';
import { RelationshipType } from '../enums/relationship-type.enum';

export class CreateCharacterRelationshipDto {
  // [MENTOR]: Los dos UUIDs son obligatorios — una relación sin sus dos extremos
  // no tiene sentido. No puedes tener "alguien siente algo" sin definir quién
  // y hacia quién. Son el núcleo de esta entidad.
  @IsUUID()
  characterId: string;

  @IsUUID()
  relatedCharacterId: string;

  @IsEnum(RelationshipType)
  relationship_type: RelationshipType;

  @IsEnum(EmotionalDynamic)
  emotional_dynamic: EmotionalDynamic;

  @IsOptional()
  @IsString()
  description?: string;

  // [MENTOR]: @IsBoolean() valida que el valor sea true o false exactamente.
  // Es opcional porque la entidad ya tiene default: false.
  // Si no lo mandas al crear, la relación se crea como no-mutua por defecto.
  @IsOptional()
  @IsBoolean()
  is_mutual?: boolean;
}
