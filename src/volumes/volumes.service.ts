import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { Volume } from './entities/volume.entity';

@Injectable()
export class VolumesService {
  constructor(
    @InjectRepository(Volume)
    private readonly volumeRepository: Repository<Volume>,
  ) {}

  async create(createVolumeDto: CreateVolumeDto): Promise<Volume> {
    // [MENTOR]: .create() construye el objeto Volume en memoria usando los datos del DTO.
    // TypeORM es lo suficientemente inteligente: como le pasamos novelId (el UUID),
    // sabe que debe setear la FK 'novel_id' en la tabla sin que hagas nada extra.
    // Si novelId no existe en la tabla novels, PostgreSQL lanzará un FK constraint error.
    // ¿Deberíamos validar que la novela exista antes? Sí, pero requiere inyectar
    // NovelsService, lo que crea una dependencia entre módulos. Lo dejaremos simple por ahora.
    const volume = this.volumeRepository.create(createVolumeDto);
    return this.volumeRepository.save(volume);
  }

  async findAll(): Promise<Volume[]> {
    return this.volumeRepository.find();
  }

  async findByNovel(novelId: string): Promise<Volume[]> {
    // [MENTOR]: findBy es una forma concisa de buscar con condiciones simples de igualdad.
    // Genera: SELECT * FROM volume WHERE novel_id = $1 ORDER BY... (sin ORDER, trae todo).
    // Es equivalente a find({ where: { novelId } }) pero más corto.
    return this.volumeRepository.findBy({ novelId });
  }

  async findOne(id: string): Promise<Volume> {
    const volume = await this.volumeRepository.findOneBy({ id });

    if (!volume) {
      throw new NotFoundException(`Volume with id ${id} not found`);
    }

    return volume;
  }

  async update(id: string, updateVolumeDto: UpdateVolumeDto): Promise<Volume> {
    const volume = await this.findOne(id);
    Object.assign(volume, updateVolumeDto);
    return this.volumeRepository.save(volume);
  }

  async remove(id: string): Promise<void> {
    const volume = await this.findOne(id);
    await this.volumeRepository.remove(volume);
  }
}
