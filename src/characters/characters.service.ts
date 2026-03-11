import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const character = this.characterRepository.create(createCharacterDto);
    return this.characterRepository.save(character);
  }

  async findByNovel(novelId: string): Promise<Character[]> {
    return this.characterRepository.find({
      where: { novelId },
      // [MENTOR]: Ordenamos por nombre para que la lista sea predecible y fácil de leer.
      // Sin order, el orden depende de cómo PostgreSQL almacena internamente los datos.
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Character> {
    const character = await this.characterRepository.findOne({
      where: { id },
      // [MENTOR]: Al traer un personaje específico, incluimos los capítulos en los que aparece.
      // Esto hace un JOIN con chapter_characters y luego con chapters.
      // Es útil para mostrar "este personaje aparece en los capítulos X, Y, Z".
      // No lo cargamos en findByNovel() porque sería demasiado dato para una lista.
      relations: { chapters: true },
    });

    if (!character) {
      throw new NotFoundException(`Character with id ${id} not found`);
    }

    return character;
  }

  async update(id: string, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const character = await this.findOne(id);
    Object.assign(character, updateCharacterDto);
    return this.characterRepository.save(character);
  }

  async remove(id: string): Promise<void> {
    const character = await this.findOne(id);
    await this.characterRepository.remove(character);
  }
}
