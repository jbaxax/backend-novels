import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Novel } from './entities/novel.entity';
import { NovelsController } from './novels.controller';
import { NovelsService } from './novels.service';

// [MENTOR]: Cada módulo en NestJS es una "caja" autocontenida con todo lo que necesita.
// Este módulo declara: "yo me encargo de todo lo relacionado a novelas".
@Module({
  // [MENTOR]: TypeOrmModule.forFeature([Novel]) registra el Repository<Novel>
  // en el contexto de este módulo. Esto es lo que permite que NovelsService
  // pueda recibir el repositorio via @InjectRepository(Novel).
  // Sin esta línea, NestJS no sabría cómo inyectar el repositorio y lanzaría un error.
  imports: [TypeOrmModule.forFeature([Novel])],
  controllers: [NovelsController],
  providers: [NovelsService],
})
export class NovelsModule {}
