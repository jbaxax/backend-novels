import { PartialType } from '@nestjs/mapped-types';
import { CreateNovelDto } from './create-novel.dto';

// [MENTOR]: PartialType(CreateNovelDto) genera automáticamente una clase
// donde TODOS los campos de CreateNovelDto se vuelven opcionales (?).
// Sin esta utilidad tendrías que duplicar el DTO entero con todos los campos como opcionales.
// Así si mañana agregas un campo a CreateNovelDto, UpdateNovelDto lo hereda solo.
// Esto es el principio DRY (Don't Repeat Yourself) aplicado a DTOs.
export class UpdateNovelDto extends PartialType(CreateNovelDto) {}
