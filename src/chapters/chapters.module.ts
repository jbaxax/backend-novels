import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';

// [MENTOR]: Mismo patrón de siempre. forFeature([Chapter]) registra
// el Repository<Chapter> para que ChaptersService pueda inyectarlo.
@Module({
  imports: [TypeOrmModule.forFeature([Chapter])],
  controllers: [ChaptersController],
  providers: [ChaptersService],
})
export class ChaptersModule {}
