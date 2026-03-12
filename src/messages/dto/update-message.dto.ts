import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';

// [MENTOR]: En la práctica los mensajes son inmutables — una conversación no se edita.
// Pero mantener el endpoint de update es útil durante el desarrollo para corregir
// datos mal guardados sin tener que borrar y recrear todo el historial.
export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
