import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimelineEvent } from './entities/timeline-event.entity';
import { TimelineEventsController } from './timeline-events.controller';
import { TimelineEventsService } from './timeline-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimelineEvent])],
  controllers: [TimelineEventsController],
  providers: [TimelineEventsService],
})
export class TimelineEventsModule {}
