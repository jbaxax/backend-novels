import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter } from './entities/chapter.entity';
import { Character } from '../characters/entities/character.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
    const chapter = this.chapterRepository.create(createChapterDto);
    return this.chapterRepository.save(chapter);
  }

  async findByVolume(volumeId: string): Promise<Chapter[]> {
    // [MENTOR]: find() con { where } es la forma larga de findBy().
    // Aquí la usamos porque agregamos { order }, que te permite definir
    // el orden de los resultados. Los capítulos deben aparecer en orden numérico,
    // no en el orden en que se insertaron en la BD.
    // Siempre que una lista tenga un orden natural (número, fecha, etc.), ordénala.
    return this.chapterRepository.find({
      where: { volumeId },
      order: { number: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Chapter> {
    // [MENTOR]: Aquí usamos findOne (no findOneBy) porque necesitamos
    // pasar opciones adicionales: { relations }.
    //
    // relations: { volume: true } le dice a TypeORM que haga un JOIN
    // con la tabla volumes y adjunte el objeto volume completo al resultado.
    // Sin esto, chapter.volume sería undefined aunque la FK esté bien seteada.
    //
    // ¿Siempre deberías cargar relaciones? No. Solo cuando el que llama las necesita.
    // En findByVolume no las cargamos porque solo necesitamos los capítulos, no el volumen
    // (ya lo conocemos — es el que filtramos). Cargar datos de más es ineficiente.
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      relations: { volume: true },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with id ${id} not found`);
    }

    return chapter;
  }

  async update(id: string, updateChapterDto: UpdateChapterDto): Promise<Chapter> {
    const chapter = await this.findOne(id);
    Object.assign(chapter, updateChapterDto);
    return this.chapterRepository.save(chapter);
  }

  async remove(id: string): Promise<void> {
    const chapter = await this.findOne(id);
    await this.chapterRepository.remove(chapter);
  }

  // [MENTOR]: Este método gestiona la relación many-to-many entre capítulo y personajes.
  // Recibe un array de characterIds, busca esas entidades en la BD y las asigna
  // al campo chapter.characters. TypeORM se encarga de insertar/borrar filas
  // en la tabla pivote chapter_characters automáticamente al hacer save().
  //
  // Usamos In() de TypeORM para traer múltiples personajes en una sola query
  // en vez de hacer N queries en un loop — mucho más eficiente.
  async setCharacters(id: string, characterIds: string[]): Promise<Chapter> {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      relations: { characters: true },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with id ${id} not found`);
    }

    const characters = await this.characterRepository.findBy({
      id: In(characterIds),
    });

    chapter.characters = characters;
    return this.chapterRepository.save(chapter);
  }
}
