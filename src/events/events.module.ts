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
import { EntityManager } from '@mikro-orm/mysql';
import { PartnerMySqlRepository } from '../../src/@core/events/infra/db/repositories/partner-mysql.repository';
import { CustomerMySqlRepository } from '../../src/@core/events/infra/db/repositories/customer-mysql.repository';
import { EventMySqlRepository } from '../../src/@core/events/infra/db/repositories/event-mysql.repository';
import { OrderMySqlRepository } from '../../src/@core/events/infra/db/repositories/order-mysql.repository';
import { SpotReservationMySqlRepository } from '../../src/@core/events/infra/db/repositories/spot-reservation-mysql.repository';
import { CustomerService } from '../../src/@core/events/application/customer.service';
import { EventService } from '../../src/@core/events/application/event.service';
import { OrderService } from '../../src/@core/events/application/order.service';
import { PartnerService } from '../../src/@core/events/application/partner.service';
import { PaymentGateway } from '../../src/@core/events/application/payment.gateway';
import { IPartnerRepository } from '../../src/@core/events/domain/repositories/partner-repository.interface';
import { IEventRepository } from '../../src/@core/events/domain/repositories/event-repository.interface';
import { IUnitOfWork } from '../../src/@core/common/application/unit-of-work.interface';
import { ISpotReservationRepository } from '../../src/@core/events/domain/repositories/spot-reservation-repository.interface';
import { ICustomerRepository } from '../../src/@core/events/domain/repositories/customer-repository.interface';
import { IOrderRepository } from '../../src/@core/events/domain/repositories/order-repository.interface';
import { PartnersController } from './partners/partners.controller';
import { CustomersController } from './customers/customers.controller';
import { EventsController } from './events/events.controller';
import { EventSectionsController } from './events/event-sections.controller';
import { EventSpotsController } from './events/event-spots.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      EventSchema,
      EventSectionSchema,
      EventSpotSchema,
      OrderSchema,
      SpotReservationSchema,
      CustomerSchema,
      PartnerSchema,
    ]),
  ],
  providers: [
    {
      provide: 'IPartnerRepository',
      useFactory: (entityManager: EntityManager) =>
        new PartnerMySqlRepository(entityManager),
      inject: [EntityManager],
    },
    {
      provide: 'IEventRepository',
      useFactory: (entityManager: EntityManager) =>
        new EventMySqlRepository(entityManager),
      inject: [EntityManager],
    },
    {
      provide: 'IOrderRepository',
      useFactory: (entityManager: EntityManager) =>
        new OrderMySqlRepository(entityManager),
      inject: [EntityManager],
    },
    {
      provide: 'ISpotReservationRepository',
      useFactory: (entityManager: EntityManager) =>
        new SpotReservationMySqlRepository(entityManager),
      inject: [EntityManager],
    },
    {
      provide: 'ICustomerRepository',
      useFactory: (entityManager: EntityManager) =>
        new CustomerMySqlRepository(entityManager),
      inject: [EntityManager],
    },
    PaymentGateway,
    {
      provide: EventService,
      useFactory: (
        partnerRepository: IPartnerRepository,
        eventRepository: IEventRepository,
        uow: IUnitOfWork,
      ) => new EventService(partnerRepository, eventRepository, uow),
      inject: ['IPartnerRepository', 'IEventRepository', 'IUnitOfWork'],
    },
    {
      provide: OrderService,
      useFactory: (
        spotReservationRepository: ISpotReservationRepository,
        customerRepository: ICustomerRepository,
        eventRepository: IEventRepository,
        orderRepository: IOrderRepository,
        paymentGateway: PaymentGateway,
        uow: IUnitOfWork,
      ) =>
        new OrderService(
          spotReservationRepository,
          customerRepository,
          eventRepository,
          orderRepository,
          paymentGateway,
          uow,
        ),
      inject: [
        'ISpotReservationRepository',
        'ICustomerRepository',
        'IEventRepository',
        'IOrderRepository',
        PaymentGateway,
        'IUnitOfWork',
      ],
    },
    {
      provide: CustomerService,
      useFactory: (customerRepository: ICustomerRepository, uow: IUnitOfWork) =>
        new CustomerService(customerRepository, uow),
      inject: ['ICustomerRepository', 'IUnitOfWork'],
    },
    {
      provide: PartnerService,
      useFactory: (partnerRepository: IPartnerRepository, uow: IUnitOfWork) =>
        new PartnerService(partnerRepository, uow),
      inject: ['IPartnerRepository', 'IUnitOfWork'],
    },
  ],
  controllers: [PartnersController, CustomersController, EventsController, EventSectionsController, EventSpotsController],
})
export class EventsModule {}
