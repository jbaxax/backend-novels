import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { CharacterRole } from '../enums/character-role.enum';
import { CharacterStatus } from '../enums/character-status.enum';

export class CreateCharacterDto {
  @IsUUID()
  novelId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  // [MENTOR]: role es obligatorio — no tiene sentido crear un personaje sin saber
  // qué lugar ocupa en la historia. Es información estructural, no decorativa.
  @IsEnum(CharacterRole)
  role: CharacterRole;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;

  // [MENTOR]: Todos los campos descriptivos son opcionales.
  // Un buen diseño de API permite creación incremental:
  // primero creas el personaje con lo mínimo, luego lo enriqueces con PATCHes.
  @IsOptional()
  @IsString()
  physical_description?: string;

  @IsOptional()
  @IsString()
  personality?: string;

  @IsOptional()
  @IsString()
  strengths?: string;

  @IsOptional()
  @IsString()
  weaknesses?: string;

  @IsOptional()
  @IsString()
  fears?: string;

  @IsOptional()
  @IsString()
  goals?: string;

  @IsOptional()
  @IsString()
  motivations?: string;

  @IsOptional()
  @IsString()
  backstory?: string;

  @IsOptional()
  @IsEnum(CharacterStatus)
  status?: CharacterStatus;
}
