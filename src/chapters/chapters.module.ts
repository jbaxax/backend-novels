import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { Character } from '../characters/entities/character.entity';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, Character])],
  controllers: [ChaptersController],
  providers: [ChaptersService],
})
export class ChaptersModule {}
