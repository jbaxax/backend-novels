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
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { VolumesService } from './volumes.service';

@Controller('volumes')
export class VolumesController {
  constructor(private readonly volumesService: VolumesService) {}

  @Post()
  create(@Body() createVolumeDto: CreateVolumeDto) {
    return this.volumesService.create(createVolumeDto);
  }

  // [MENTOR]: Tenemos dos endpoints GET distintos:
  // GET /volumes          → todos los volúmenes (sin filtro)
  // GET /novels/:id/volumes → los volúmenes de una novela específica
  //
  // El segundo endpoint vive en este controller aunque mencione "novels" en la ruta.
  // ¿Por qué? Porque la lógica de volúmenes pertenece a VolumesService,
  // no a NovelsService. No mezclamos responsabilidades.
  @Get()
  findAll() {
    return this.volumesService.findAll();
  }

  // [MENTOR]: Esta ruta /novels/:novelId/volumes parece rara en un VolumesController,
  // pero es perfectamente válida. @Controller('volumes') define el prefijo base,
  // pero dentro podemos definir rutas con cualquier path usando el decorador @Get().
  // NestJS registra el path completo como: GET /novels/:novelId/volumes
  @Get('/novels/:novelId')
  findByNovel(@Param('novelId', ParseUUIDPipe) novelId: string) {
    return this.volumesService.findByNovel(novelId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.volumesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVolumeDto: UpdateVolumeDto,
  ) {
    return this.volumesService.update(id, updateVolumeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.volumesService.remove(id);
  }
}
