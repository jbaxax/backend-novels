import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterRelationship } from './entities/character-relationship.entity';
import { CharacterRelationshipsController } from './character-relationships.controller';
import { CharacterRelationshipsService } from './character-relationships.service';

// [MENTOR]: Mismo patrón de siempre. forFeature registra el repositorio para el servicio.
@Module({
  imports: [TypeOrmModule.forFeature([CharacterRelationship])],
  controllers: [CharacterRelationshipsController],
  providers: [CharacterRelationshipsService],
})
export class CharacterRelationshipsModule {}
