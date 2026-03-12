import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CharacterRelationshipsService } from './character-relationships.service';
import { CreateCharacterRelationshipDto } from './dto/create-character-relationship.dto';
import { UpdateCharacterRelationshipDto } from './dto/update-character-relationship.dto';

@Controller('character-relationships')
export class CharacterRelationshipsController {
  constructor(
    private readonly characterRelationshipsService: CharacterRelationshipsService,
  ) {}

  @Post()
  create(@Body() createCharacterRelationshipDto: CreateCharacterRelationshipDto) {
    return this.characterRelationshipsService.create(
      createCharacterRelationshipDto,
    );
  }

  // [MENTOR]: GET /character-relationships/characters/:characterId
  // Trae todas las relaciones donde ese personaje es el sujeto que siente.
  // Ejemplo: "dame todas las relaciones de protagonista-X" →
  // retorna que siente rival hacia P2, admira a P3, teme a P4, etc.
  @Get('/characters/:characterId')
  findByCharacter(@Param('characterId', ParseUUIDPipe) characterId: string) {
    return this.characterRelationshipsService.findByCharacter(characterId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.characterRelationshipsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCharacterRelationshipDto: UpdateCharacterRelationshipDto,
  ) {
    return this.characterRelationshipsService.update(
      id,
      updateCharacterRelationshipDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.characterRelationshipsService.remove(id);
  }
}
