import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  });

  // [MENTOR]: ValidationPipe es el que activa las validaciones de class-validator en los DTOs.
  // Sin esta línea, los decoradores @IsString(), @IsNotEmpty(), etc. no hacen nada —
  // están declarados pero nadie los ejecuta.
  //
  // whitelist: true → elimina automáticamente cualquier campo del body que NO esté
  // declarado en el DTO. Si el cliente manda { title: "...", hackerField: "..." },
  // el hackerField se descarta silenciosamente. Previene inyección de campos no esperados.
  //
  // forbidNonWhitelisted: true → en vez de silenciar, lanza un 400 si viene un campo extra.
  // Más estricto que whitelist solo. Útil para detectar errores del cliente más claramente.
  //
  // transform: true → convierte automáticamente los datos del request al tipo TypeScript.
  // Ej: un :id que llega como string se puede convertir a number si el tipo lo indica.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
