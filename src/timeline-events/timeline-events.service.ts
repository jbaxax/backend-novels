import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTimelineEventDto } from './dto/create-timeline-event.dto';
import { UpdateTimelineEventDto } from './dto/update-timeline-event.dto';
import { TimelineEvent } from './entities/timeline-event.entity';

@Injectable()
export class TimelineEventsService {
  constructor(
    @InjectRepository(TimelineEvent)
    private readonly timelineEventRepository: Repository<TimelineEvent>,
  ) {}

  async create(createTimelineEventDto: CreateTimelineEventDto): Promise<TimelineEvent> {
    const event = this.timelineEventRepository.create(createTimelineEventDto);
    return this.timelineEventRepository.save(event);
  }

  async findByNovel(novelId: string): Promise<TimelineEvent[]> {
    return this.timelineEventRepository.find({
      where: { novelId },
      // [MENTOR]: Cargamos chapter para que el cliente sepa en qué capítulo
      // ocurre cada evento — pero solo si tiene capítulo (recuerda: es nullable).
      // TypeORM maneja esto bien: si chapter_id es NULL, chapter vendrá como null
      // en el resultado, no lanzará un error.
      relations: { chapter: true },
      // [MENTOR]: Ordenamos por importancia descendente — los eventos críticos primero.
      // Así el autor ve de un vistazo los puntos de inflexión de su historia.
      order: { importance: 'DESC', story_date: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TimelineEvent> {
    const event = await this.timelineEventRepository.findOne({
      where: { id },
      relations: { chapter: true },
    });

    if (!event) {
      throw new NotFoundException(`TimelineEvent with id ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateTimelineEventDto: UpdateTimelineEventDto): Promise<TimelineEvent> {
    const event = await this.findOne(id);
    Object.assign(event, updateTimelineEventDto);
    return this.timelineEventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.timelineEventRepository.remove(event);
  }
}
