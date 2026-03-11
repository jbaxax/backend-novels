import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';

// [MENTOR]: Mismo patrón de siempre.
// forFeature([Character]) registra el Repository<Character> para el servicio.
@Module({
  imports: [TypeOrmModule.forFeature([Character])],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
