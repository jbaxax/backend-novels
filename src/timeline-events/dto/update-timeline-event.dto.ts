import { PartialType } from '@nestjs/mapped-types';
import { CreateTimelineEventDto } from './create-timeline-event.dto';

// [MENTOR]: Ya conocido. Útil para vincular un evento a un capítulo después de escribirlo:
// PATCH /timeline-events/:id con { chapterId: "uuid-del-capítulo" }.
export class UpdateTimelineEventDto extends PartialType(CreateTimelineEventDto) {}
