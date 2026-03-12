import { PartialType } from '@nestjs/mapped-types';
import { CreateCharacterRelationshipDto } from './create-character-relationship.dto';

// [MENTOR]: Ya conocido. Permite actualizar solo emotional_dynamic o solo is_mutual
// sin tocar el resto. Útil cuando la dinámica emocional evoluciona durante la historia.
export class UpdateCharacterRelationshipDto extends PartialType(CreateCharacterRelationshipDto) {}
