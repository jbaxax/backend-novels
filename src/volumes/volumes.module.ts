import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volume } from './entities/volume.entity';
import { VolumesController } from './volumes.controller';
import { VolumesService } from './volumes.service';

// [MENTOR]: Mismo patrón que NovelsModule.
// forFeature([Volume]) registra el Repository<Volume> para que el servicio pueda inyectarlo.
// Cada módulo solo registra sus propias entidades — no las ajenas.
@Module({
  imports: [TypeOrmModule.forFeature([Volume])],
  controllers: [VolumesController],
  providers: [VolumesService],
})
export class VolumesModule {}
