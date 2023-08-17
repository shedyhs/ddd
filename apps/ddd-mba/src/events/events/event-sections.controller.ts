import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { EventService } from '../../../src/@core/events/application/event.service';
import { CreateSectionDto } from './dtos/create-section.dto';
import { UpdateSectionDto } from './dtos/update-section.dto';

@Controller('/events/:event_id/sections')
export class EventSectionsController {
  constructor(private eventService: EventService) {}

  @Get()
  async list(@Param('event_id') event_id: string) {
    return this.eventService.findSections(event_id);
  }

  @Post()
  async create(
    @Param('event_id') event_id: string,
    @Body() body: CreateSectionDto,
  ) {
    return this.eventService.addSection({ ...body, event_id });
  }

  @Put('/:section_id')
  async update(
    @Param('event_id') event_id: string,
    @Param('section_id') section_id: string,
    @Body() body: UpdateSectionDto,
  ) {
    return this.eventService.updateSection({
      ...body,
      event_id,
      section_id,
    });
  }
}
