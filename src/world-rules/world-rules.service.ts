import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorldRuleDto } from './dto/create-world-rule.dto';
import { UpdateWorldRuleDto } from './dto/update-world-rule.dto';
import { WorldRule } from './entities/world-rule.entity';

@Injectable()
export class WorldRulesService {
  constructor(
    @InjectRepository(WorldRule)
    private readonly worldRuleRepository: Repository<WorldRule>,
  ) {}

  async create(createWorldRuleDto: CreateWorldRuleDto): Promise<WorldRule> {
    const rule = this.worldRuleRepository.create(createWorldRuleDto);
    return this.worldRuleRepository.save(rule);
  }

  async findByNovel(novelId: string): Promise<WorldRule[]> {
    // [MENTOR]: Ordenamos por categoría primero y luego por nombre.
    // Así el cliente recibe las reglas agrupadas visualmente por tipo,
    // lo cual es más útil que un orden aleatorio.
    return this.worldRuleRepository.find({
      where: { novelId },
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<WorldRule> {
    const rule = await this.worldRuleRepository.findOneBy({ id });

    if (!rule) {
      throw new NotFoundException(`WorldRule with id ${id} not found`);
    }

    return rule;
  }

  async update(id: string, updateWorldRuleDto: UpdateWorldRuleDto): Promise<WorldRule> {
    const rule = await this.findOne(id);
    Object.assign(rule, updateWorldRuleDto);
    return this.worldRuleRepository.save(rule);
  }

  async remove(id: string): Promise<void> {
    const rule = await this.findOne(id);
    await this.worldRuleRepository.remove(rule);
  }
}
