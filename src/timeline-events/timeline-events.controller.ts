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
import { CreateTimelineEventDto } from './dto/create-timeline-event.dto';
import { UpdateTimelineEventDto } from './dto/update-timeline-event.dto';
import { TimelineEventsService } from './timeline-events.service';

@Controller('timeline-events')
export class TimelineEventsController {
  constructor(private readonly timelineEventsService: TimelineEventsService) {}

  @Post()
  create(@Body() createTimelineEventDto: CreateTimelineEventDto) {
    return this.timelineEventsService.create(createTimelineEventDto);
  }

  // [MENTOR]: Mismo patrón de siempre — filtramos por novela.
  // La línea de tiempo completa de una novela viene con los capítulos vinculados
  // ya incluidos (o null si el evento es lore previo).
  @Get('/novels/:novelId')
  findByNovel(@Param('novelId', ParseUUIDPipe) novelId: string) {
    return this.timelineEventsService.findByNovel(novelId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.timelineEventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTimelineEventDto: UpdateTimelineEventDto,
  ) {
    return this.timelineEventsService.update(id, updateTimelineEventDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.timelineEventsService.remove(id);
  }
}
