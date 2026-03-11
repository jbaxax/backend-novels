import { PartialType } from '@nestjs/mapped-types';
import { CreateCharacterDto } from './create-character.dto';

// [MENTOR]: Ya lo conocemos — todos los campos opcionales, validaciones heredadas.
// Útil para actualizaciones parciales: PATCH con solo { status: 'dead' }
// marca al personaje como muerto sin tocar ningún otro campo.
export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {}
