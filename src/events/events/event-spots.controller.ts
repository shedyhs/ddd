import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { EventService } from '../../../src/@core/events/application/event.service';
import { ChangeSpotLocationDto } from './dtos/change-spot-location.dto';

@Controller('/events/:event_id/sections/:section_id/spots')
export class EventSpotsController {
  constructor(private eventService: EventService) {}

  @Get()
  async list(
    @Param('event_id') event_id: string,
    @Param('section_id') section_id: string,
  ) {
    return this.eventService.findSpots({ event_id, section_id });
  }

  @Put('/:spot_id')
  async changeLocation(
    @Param('event_id') event_id: string,
    @Param('section_id') section_id: string,
    @Param('spot_id') spot_id: string,
    @Body() body: ChangeSpotLocationDto,
  ) {
    return this.eventService.changeLocation({
      event_id,
      section_id,
      spot_id,
      ...body,
    });
  }
}
