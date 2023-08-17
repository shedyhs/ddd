import { MikroORM } from '@mikro-orm/mysql';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  PartnerSchema,
  EventSpotSchema,
  OrderSchema,
  SpotReservationSchema,
} from '../infra/db/schemas';

export function initOrm() {
  beforeAll(async () => {
    await MikroORM.init(
      {
        allowGlobalContext: true,
        entities: [
          CustomerSchema,
          EventSchema,
          EventSectionSchema,
          PartnerSchema,
          EventSpotSchema,
          OrderSchema,
          SpotReservationSchema,
        ],
        type: 'mysql',
        dbName: 'fake',
      },
      false,
    );
  });
}
