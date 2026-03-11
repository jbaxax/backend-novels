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
import { ChapterStatus } from '../enums/chapter-status.enum';

export class CreateChapterDto {
  @IsUUID()
  volumeId: string;

  @IsInt()
  @Min(1)
  number: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string;

  // [MENTOR]: @IsEnum(ChapterStatus) valida que el valor recibido sea exactamente
  // uno de los valores del enum: 'draft' o 'complete'.
  // Si el cliente manda status: 'published', class-validator rechaza con 400.
  // Es opcional porque la entidad ya tiene default: ChapterStatus.DRAFT.
  @IsOptional()
  @IsEnum(ChapterStatus)
  status?: ChapterStatus;
}
