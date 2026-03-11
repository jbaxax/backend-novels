import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNovelDto } from './dto/create-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { Novel } from './entities/novel.entity';

// [MENTOR]: @Injectable() marca esta clase como un "proveedor" de NestJS.
// Eso significa que el sistema de inyección de dependencias puede crearla
// y pasarla automáticamente a quien la necesite (como el controller).
// Nunca hacemos "new NovelsService()" a mano — NestJS lo maneja por nosotros.
@Injectable()
export class NovelsService {
  constructor(
    // [MENTOR]: @InjectRepository(Novel) inyecta el repositorio de TypeORM para Novel.
    // Repository<Novel> nos da métodos como .find(), .findOneBy(), .save(), .delete()
    // sin escribir SQL. TypeORM traduce esas llamadas a queries de PostgreSQL.
    @InjectRepository(Novel)
    private readonly novelRepository: Repository<Novel>,
  ) {}

  async create(createNovelDto: CreateNovelDto): Promise<Novel> {
    // [MENTOR]: .create() construye la instancia en memoria pero NO la guarda en BD.
    // .save() la persiste. Separar estos pasos permite manipular el objeto antes de guardarlo.
    const novel = this.novelRepository.create(createNovelDto);
    return this.novelRepository.save(novel);
  }

  async findAll(): Promise<Novel[]> {
    // [MENTOR]: .find() sin opciones trae todos los registros de la tabla.
    // En apps reales con miles de registros agregarías paginación aquí.
    // Por ahora está bien así para empezar.
    return this.novelRepository.find();
  }

  async findOne(id: string): Promise<Novel> {
    // [MENTOR]: findOneBy busca por un campo específico. Si no encuentra nada retorna null.
    const novel = await this.novelRepository.findOneBy({ id });

    // [MENTOR]: Esta verificación es una buena práctica clave.
    // Si el cliente pide una novela que no existe, lanzamos NotFoundException.
    // NestJS la captura automáticamente y responde con 404 Not Found.
    // Sin este check, retornarías null y el controller devolvería un 200 con body vacío — confuso.
    if (!novel) {
      throw new NotFoundException(`Novel with id ${id} not found`);
    }

    return novel;
  }

  async update(id: string, updateNovelDto: UpdateNovelDto): Promise<Novel> {
    // [MENTOR]: Reutilizamos findOne para que también lance 404 si no existe.
    // Este patrón evita duplicar la lógica de "verificar si existe".
    const novel = await this.findOne(id);

    // [MENTOR]: Object.assign() copia las propiedades del DTO sobre la entidad existente.
    // Solo sobreescribe los campos que vienen en el DTO (los demás quedan igual).
    // Esto es lo que hace que el PATCH funcione correctamente — actualiza solo lo que mandas.
    Object.assign(novel, updateNovelDto);

    return this.novelRepository.save(novel);
  }

  async remove(id: string): Promise<void> {
    // [MENTOR]: Igual, verificamos primero que exista para dar un 404 claro.
    const novel = await this.findOne(id);

    // [MENTOR]: .remove() borra el registro y retorna la entidad eliminada.
    // Usamos void como tipo de retorno porque al controller no le interesa
    // devolver nada al cliente cuando elimina (responderá con 204 No Content).
    await this.novelRepository.remove(novel);
  }
}
