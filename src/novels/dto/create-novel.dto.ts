import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// [MENTOR]: Un DTO (Data Transfer Object) es un objeto que define exactamente
// qué datos acepta un endpoint. Su único trabajo es describir la "forma" del input.
// NO tiene lógica de negocio. NO toca la base de datos.
//
// ¿Por qué no usar la Entity directamente como tipo del @Body()?
// Porque la Entity tiene campos que el cliente NO debe poder mandar
// (como el id o created_at). El DTO es el contrato entre el cliente y la API.
export class CreateNovelDto {
  // [MENTOR]: @IsNotEmpty() y @IsString() son validaciones de class-validator.
  // Si el cliente manda un body sin 'title' o con title = 42 (número),
  // NestJS responde automáticamente con un 400 Bad Request antes de llegar al servicio.
  // Para que esto funcione necesitamos activar el ValidationPipe globalmente (lo haremos en main.ts).
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  // [MENTOR]: @IsOptional() le dice al validador que si el campo no viene en el body,
  // está bien — no lanza error. Pero si SÍ viene, las validaciones siguientes aplican.
  @IsOptional()
  @IsString()
  description?: string;
}
