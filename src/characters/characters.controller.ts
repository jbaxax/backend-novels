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
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.charactersService.create(createCharacterDto);
  }

  // [MENTOR]: GET /characters/novels/:novelId → todos los personajes de una novela.
  // Mismo patrón que usamos en volumes y chapters. Ya te resulta familiar.
  @Get('/novels/:novelId')
  findByNovel(@Param('novelId', ParseUUIDPipe) novelId: string) {
    return this.charactersService.findByNovel(novelId);
  }

  // [MENTOR]: GET /characters/:id → personaje con sus capítulos incluidos (JOIN).
  // El cliente que pide un personaje específico probablemente quiere ver
  // en qué capítulos aparece, así que lo traemos junto.
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.charactersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.charactersService.update(id, updateCharacterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.charactersService.remove(id);
  }
}
