import { IsUUID } from 'class-validator';

// [MENTOR]: El DTO más simple del proyecto — solo necesita saber a qué capítulo
// pertenece la sesión. El id y el created_at los genera la BD automáticamente.
// Menos campos en el DTO = menos superficie de error para el cliente.
export class CreateChatSessionDto {
  @IsUUID()
  chapterId: string;
}
