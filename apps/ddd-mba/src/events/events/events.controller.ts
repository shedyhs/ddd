import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { EventService } from '../../../src/@core/events/application/event.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

@Controller('/events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get()
  async list() {
    const events = await this.eventService.list();
    return events;
  }

  @Post()
  create(@Body() body: CreateEventDto) {
    return this.eventService.create(body);
  }

  @Patch('/:event_id/publish-all')
  publishAll(@Param('event_id') event_id: string) {
    return this.eventService.publishAll({ event_id });
  }

  @Patch('/:event_id/unpublish-all')
  unPublishAll(@Param('event_id') event_id: string) {
    return this.eventService.unPublishAll({ event_id });
  }

  @Put('/:event_id')
  update(@Param('event_id') event_id: string, @Body() body: UpdateEventDto) {
    return this.eventService.update(event_id, body)
  }
}
