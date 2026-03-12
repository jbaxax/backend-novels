import { PartialType } from '@nestjs/mapped-types';
import { CreateWorldRuleDto } from './create-world-rule.dto';

// [MENTOR]: Ya conocido — todos los campos opcionales, validaciones heredadas.
export class UpdateWorldRuleDto extends PartialType(CreateWorldRuleDto) {}
