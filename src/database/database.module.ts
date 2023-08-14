import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import {
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  SpotReservationSchema,
  PartnerSchema,
  CustomerSchema,
} from '../../src/@core/events/infra/db/schemas';
import { EntityManager } from '@mikro-orm/mysql';
import { UnitOfWorkMikroOrm } from 'src/@core/common/infra/unit-of-work-mikro-orm';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRoot({
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
    }),
  ],
  providers: [
    {
      provide: 'IUnitOfWork',
      useFactory(entityManager: EntityManager) {
        return new UnitOfWorkMikroOrm(entityManager);
      },
      inject: [EntityManager],
    },
  ],
  exports: ['IUnitOfWork'],
})
export class DatabaseModule {}
