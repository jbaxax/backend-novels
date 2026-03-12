import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { RuleCategory } from '../enums/rule-category.enum';

export class CreateWorldRuleDto {
  @IsUUID()
  novelId: string;

  @IsEnum(RuleCategory)
  category: RuleCategory;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // [MENTOR]: Opcional porque la entidad ya tiene default: false.
  // Si no lo mandas, la regla se crea como no-rompible por defecto — lo más restrictivo.
  @IsOptional()
  @IsBoolean()
  is_breakable?: boolean;
}
