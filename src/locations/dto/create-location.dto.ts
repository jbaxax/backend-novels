import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateLocationDto {
  @IsUUID()
  novelId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  // [MENTOR]: parentId también es UUID pero completamente opcional.
  // Si no lo mandas, el lugar se crea como raíz (sin padre).
  // @IsUUID() sigue aplicando cuando viene — no puedes mandar "abc123" como parentId.
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
