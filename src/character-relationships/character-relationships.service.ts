import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCharacterRelationshipDto } from './dto/create-character-relationship.dto';
import { UpdateCharacterRelationshipDto } from './dto/update-character-relationship.dto';
import { CharacterRelationship } from './entities/character-relationship.entity';

@Injectable()
export class CharacterRelationshipsService {
  constructor(
    @InjectRepository(CharacterRelationship)
    private readonly relationshipRepository: Repository<CharacterRelationship>,
  ) {}

  async create(
    createCharacterRelationshipDto: CreateCharacterRelationshipDto,
  ): Promise<CharacterRelationship> {
    const relationship = this.relationshipRepository.create(
      createCharacterRelationshipDto,
    );
    return this.relationshipRepository.save(relationship);
  }

  async findByCharacter(characterId: string): Promise<CharacterRelationship[]> {
    // [MENTOR]: Aquí aparece una consulta más interesante.
    // Queremos todas las relaciones donde el personaje sea el sujeto (characterId).
    // Usamos relations para cargar el objeto completo de relatedCharacter,
    // así el cliente sabe el nombre del personaje relacionado sin hacer otra request.
    return this.relationshipRepository.find({
      where: { characterId },
      relations: { relatedCharacter: true },
    });
  }

  async findOne(id: string): Promise<CharacterRelationship> {
    // [MENTOR]: Al traer una relación específica, cargamos AMBOS personajes.
    // El que siente (character) y hacia quién (relatedCharacter).
    // Esto hace dos JOINs con la tabla characters pero da un resultado completo.
    const relationship = await this.relationshipRepository.findOne({
      where: { id },
      relations: { character: true, relatedCharacter: true },
    });

    if (!relationship) {
      throw new NotFoundException(
        `CharacterRelationship with id ${id} not found`,
      );
    }

    return relationship;
  }

  async update(
    id: string,
    updateCharacterRelationshipDto: UpdateCharacterRelationshipDto,
  ): Promise<CharacterRelationship> {
    const relationship = await this.findOne(id);
    Object.assign(relationship, updateCharacterRelationshipDto);
    return this.relationshipRepository.save(relationship);
  }

  async remove(id: string): Promise<void> {
    const relationship = await this.findOne(id);
    await this.relationshipRepository.remove(relationship);
  }
}
