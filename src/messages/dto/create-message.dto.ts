import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { MessageRole } from '../enums/message-role.enum';

export class CreateMessageDto {
  @IsUUID()
  sessionId: string;

  // [MENTOR]: El rol es obligatorio y sin valor por defecto.
  // ¿Por qué no poner default 'user'? Porque los mensajes del asistente
  // también se guardan — cuando la IA responde, guardas su respuesta
  // con role: 'assistant'. Asumir un default sería una trampa para errores.
  // Es mejor que el cliente declare explícitamente quién habla.
  @IsEnum(MessageRole)
  role: MessageRole;

  // [MENTOR]: @IsNotEmpty() previene guardar mensajes vacíos en el historial,
  // lo que corrompería el contexto que se le envía a la IA.
  @IsString()
  @IsNotEmpty()
  content: string;
}
