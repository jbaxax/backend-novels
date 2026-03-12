import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chaptersService.create(createChapterDto);
  }

  // [MENTOR]: Mismo patrón que en volumes — un endpoint dedicado para
  // traer los capítulos de un volumen específico.
  // GET /chapters/volumes/:volumeId → capítulos de ese volumen, ordenados por number ASC.
  @Get('/volumes/:volumeId')
  findByVolume(@Param('volumeId', ParseUUIDPipe) volumeId: string) {
    return this.chaptersService.findByVolume(volumeId);
  }

  // [MENTOR]: GET /chapters/:id devuelve el capítulo con su volumen incluido (JOIN).
  // El cliente que llama a este endpoint generalmente quiere el contexto completo.
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.chaptersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chaptersService.update(id, updateChapterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.chaptersService.remove(id);
  }

  // [MENTOR]: PUT (no POST) porque estamos reemplazando la lista completa de personajes.
  // POST agregaría uno. PUT dice: "esta ES la lista de personajes de este capítulo ahora".
  // Si mandas un array vacío [], eliminas todos los personajes del capítulo.
  @Put(':id/characters')
  setCharacters(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('characterIds', new ParseArrayPipe({ items: String })) characterIds: string[],
  ) {
    return this.chaptersService.setCharacters(id, characterIds);
  }
}
