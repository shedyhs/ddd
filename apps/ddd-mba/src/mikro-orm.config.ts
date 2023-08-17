import {
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  SpotReservationSchema,
  PartnerSchema,
  CustomerSchema,
} from './@core/events/infra/db/schemas';

export default {
  entities: [
    EventSchema,
    EventSectionSchema,
    EventSpotSchema,
    OrderSchema,
    SpotReservationSchema,
    PartnerSchema,
    CustomerSchema,
  ],
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  dbName: 'events',
  user: 'root',
  password: 'root',
  forceEntityConstructor: true,
};
