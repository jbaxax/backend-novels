import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create(createLocationDto);
    return this.locationRepository.save(location);
  }

  async findByNovel(novelId: string): Promise<Location[]> {
    return this.locationRepository.find({
      where: { novelId },
      // [MENTOR]: Cargamos el padre para que el cliente sepa en qué lugar
      // del árbol está cada ubicación sin tener que hacer otra request.
      // Solo un nivel de padre — no cargamos el árbol completo,
      // porque eso requeriría consultas recursivas que complicarían demasiado el código.
      relations: { parent: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: { parent: true },
    });

    if (!location) {
      throw new NotFoundException(`Location with id ${id} not found`);
    }

    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const location = await this.findOne(id);
    Object.assign(location, updateLocationDto);
    return this.locationRepository.save(location);
  }

  async remove(id: string): Promise<void> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
  }
}
