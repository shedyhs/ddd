import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import {
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  SpotReservationSchema,
  PartnerSchema,
  CustomerSchema,
} from '../../src/@core/events/infra/db/schemas';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      EventSchema,
      EventSectionSchema,
      EventSpotSchema,
      OrderSchema,
      SpotReservationSchema,
      PartnerSchema,
      CustomerSchema,
    ]),
  ],
})
export class EventsModule {}
