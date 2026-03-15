// [MENTOR]: Este archivo es el "cerebro" de la aplicación.
// Todo lo que NestJS necesita saber sobre cómo está armada la app pasa por aquí.
// Cada módulo que creemos (novels, characters, etc.) se registra en este array de imports.

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NovelsModule } from './novels/novels.module';
import { VolumesModule } from './volumes/volumes.module';
import { ChaptersModule } from './chapters/chapters.module';
import { CharactersModule } from './characters/characters.module';
import { CharacterRelationshipsModule } from './character-relationships/character-relationships.module';
import { WorldRulesModule } from './world-rules/world-rules.module';
import { LocationsModule } from './locations/locations.module';
import { TimelineEventsModule } from './timeline-events/timeline-events.module';
import { ChatSessionsModule } from './chat-sessions/chat-sessions.module';
import { MessagesModule } from './messages/messages.module';
import { GenerationModule } from './generation/generation.module';

@Module({
  imports: [
    // [MENTOR]: ConfigModule lee el archivo .env y pone esas variables disponibles
    // en toda la app mediante el ConfigService. isGlobal:true significa que no hay
    // que importarlo en cada módulo — se registra una sola vez aquí y listo.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // [MENTOR]: TypeOrmModule.forRootAsync() es la forma "asíncrona" de configurar
    // la conexión a la BD. ¿Por qué async? Porque necesitamos inyectar ConfigService
    // para leer las variables de entorno ANTES de conectarnos.
    // Si usáramos forRoot() (sin Async) no podríamos usar el ConfigService porque
    // aún no estaría disponible en ese momento del ciclo de vida de la app.
    TypeOrmModule.forRootAsync({
      // [MENTOR]: inject le dice a NestJS: "necesito este servicio disponible
      // dentro de la función useFactory". Sin esto, configService sería undefined.
      inject: [ConfigService],

      // [MENTOR]: useFactory es una función que retorna el objeto de configuración.
      // NestJS la llama automáticamente cuando levanta la app y le pasa el ConfigService.
      useFactory: (configService: ConfigService) => ({
        // [MENTOR]: 'postgres' le dice a TypeORM qué driver de BD usar.
        // Internamente usa el paquete 'pg' que instalamos.
        type: 'postgres',

        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),

        // [MENTOR]: entities le dice a TypeORM qué clases mapean a tablas de BD.
        // __dirname + '/**/*.entity{.ts,.js}' es un glob pattern que encuentra
        // automáticamente todos los archivos .entity.ts del proyecto.
        // Así no tenemos que registrar cada entidad a mano cuando agreguemos nuevas.
        entities: [__dirname + '/**/*.entity{.ts,.js}'],

        // [MENTOR]: synchronize:true hace que TypeORM cree/modifique las tablas
        // automáticamente comparando tus entidades con el esquema real de la BD.
        // ⚠️  SOLO úsalo en desarrollo. En producción usa migraciones porque
        // synchronize puede borrar datos si cambias una entidad sin cuidado.
        synchronize: configService.get<string>('NODE_ENV') !== 'production',

        // [MENTOR]: logging:true imprime cada query SQL en la consola.
        // Útil para ver exactamente qué está ejecutando TypeORM.
        // En producción esto se desactiva para no llenar los logs.
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),

    NovelsModule,

    VolumesModule,

    ChaptersModule,

    CharactersModule,

    CharacterRelationshipsModule,

    WorldRulesModule,

    LocationsModule,

    TimelineEventsModule,

    ChatSessionsModule,

    MessagesModule,

    GenerationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
