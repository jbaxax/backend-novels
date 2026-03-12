import { PartialType } from '@nestjs/mapped-types';
import { CreateChatSessionDto } from './create-chat-session.dto';

// [MENTOR]: En la práctica una sesión de chat casi nunca se actualiza —
// los mensajes se agregan por separado. Pero lo mantenemos por consistencia
// y por si en el futuro necesitas reasignar una sesión a otro capítulo.
export class UpdateChatSessionDto extends PartialType(CreateChatSessionDto) {}
