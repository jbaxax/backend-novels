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
import { CreateNovelDto } from './dto/create-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { NovelsService } from './novels.service';

// [MENTOR]: @Controller('novels') define el prefijo de ruta para todos los endpoints aquí.
// Todos los métodos de esta clase responderán bajo /novels/*.
// El controller es "tonto" — no tiene lógica de negocio. Solo recibe el request,
// llama al servicio, y devuelve la respuesta. Nada más.
@Controller('novels')
export class NovelsController {
  // [MENTOR]: La inyección de dependencias en el constructor es el patrón estándar de NestJS.
  // No instanciamos NovelsService con "new" — NestJS lo hace y lo inyecta automáticamente.
  // El "readonly" previene que alguien reasigne accidentalmente this.novelsService.
  constructor(private readonly novelsService: NovelsService) {}

  // [MENTOR]: @Post() responde a HTTP POST /novels
  // @Body() extrae el cuerpo del request y lo convierte a una instancia de CreateNovelDto.
  // El ValidationPipe (que configuraremos en main.ts) valida automáticamente ese objeto.
  @Post()
  create(@Body() createNovelDto: CreateNovelDto) {
    return this.novelsService.create(createNovelDto);
  }

  // [MENTOR]: @Get() responde a HTTP GET /novels — lista todos.
  // Por convención REST, GET a la colección retorna un array.
  @Get()
  findAll() {
    return this.novelsService.findAll();
  }

  // [MENTOR]: @Get(':id') captura el segmento dinámico de la URL.
  // Ej: GET /novels/550e8400-e29b-... → id = "550e8400-e29b-..."
  //
  // ParseUUIDPipe valida que el :id sea un UUID válido ANTES de llegar al servicio.
  // Si mandas GET /novels/abc123, responde 400 automáticamente sin tocar la BD.
  // El CLI generó +id (convertir a número) — lo cambiamos porque usamos UUID (string).
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.novelsService.findOne(id);
  }

  // [MENTOR]: @Patch() es para actualizaciones parciales (solo los campos que mandas).
  // La alternativa es @Put() que reemplaza el objeto completo — en APIs REST modernas
  // se prefiere PATCH porque es más flexible para el cliente.
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNovelDto: UpdateNovelDto,
  ) {
    return this.novelsService.update(id, updateNovelDto);
  }

  // [MENTOR]: @HttpCode(HttpStatus.NO_CONTENT) hace que DELETE retorne 204 en vez de 200.
  // 204 significa "operación exitosa, sin contenido que retornar".
  // Es el código HTTP correcto para eliminaciones — el estándar REST lo indica así.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.novelsService.remove(id);
  }
}
