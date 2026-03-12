import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { EventImportance } from '../enums/event-importance.enum';

export class CreateTimelineEventDto {
  // [MENTOR]: novelId es obligatorio — un evento siempre pertenece a una novela.
  @IsUUID()
  novelId: string;

  // [MENTOR]: chapterId es opcional porque el evento puede ser lore previo.
  // @IsUUID() sigue validando el formato cuando viene — no aceptamos strings basura.
  // @IsOptional() hace que class-validator lo ignore si no está presente en el body.
  @IsOptional()
  @IsUUID()
  chapterId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // [MENTOR]: story_date es string libre — "Año 3 del Imperio", "Luna de la Cosecha".
  // @IsString() + @IsNotEmpty() es suficiente. No usamos @IsDateString()
  // porque eso validaría formato ISO (2024-01-01) y aquí el formato es libre.
  @IsString()
  @IsNotEmpty()
  story_date: string;

  @IsOptional()
  @IsEnum(EventImportance)
  importance?: EventImportance;
}
