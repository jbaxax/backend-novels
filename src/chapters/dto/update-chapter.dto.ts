import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto';

// [MENTOR]: Ya lo conocemos. Todos los campos opcionales, validaciones heredadas.
// Útil en capítulos: puedes mandar solo { status: 'complete' } para marcar un capítulo
// sin tocar el título ni el contenido.
export class UpdateChapterDto extends PartialType(CreateChapterDto) {}
