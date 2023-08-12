import { EntityManager, MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { IEventRepository } from '../domain/repositories/event-repository.interface';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from '../infra/db/schemas';
import { EventMySqlRepository } from '../infra/db/repositories/event-mysql.repository';
import { IUnitOfWork } from '../../common/application/unit-of-work.interface';
import { UnitOfWorkMikroOrm } from '../../common/infra/unit-of-work-mikro-orm';
import { IOrderRepository } from '../domain/repositories/order-repository.interface';
import { OrderMySqlRepository } from '../infra/db/repositories/order-mysql.repository';
import { OrderService } from './order.service';
import { SpotReservationMySqlRepository } from '../infra/db/repositories/spot-reservation-mysql.repository';
import { ISpotReservationRepository } from '../domain/repositories/spot-reservation-repository.interface';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
import { CustomerMySqlRepository } from '../infra/db/repositories/customer-mysql.repository';
import { Event } from '../domain/entities/event.entity';
import { Customer } from '../domain/entities/customer.entity';
import { Partner } from '../domain/entities/partner.entity';
import { Order } from '../domain/entities/order.entity';

describe('Order Service Test', () => {
  let unitOfWork: IUnitOfWork;
  let orderRepository: IOrderRepository;
  let spotReservationRepository: ISpotReservationRepository;
  let customerRepository: ICustomerRepository;
  let eventRepository: IEventRepository;
  let orderService: OrderService;
  let entityManager: EntityManager;
  let orm: MikroORM;
  let partner: Partner;
  let event: Event;
  let customer: Customer;

  beforeAll(async () => {
    orm = await MikroORM.init<MySqlDriver>({
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
    });
  });

  beforeEach(async () => {
    await orm.schema.refreshDatabase();
    entityManager = orm.em.fork();
    unitOfWork = new UnitOfWorkMikroOrm(entityManager);
    orderRepository = new OrderMySqlRepository(entityManager);
    spotReservationRepository = new SpotReservationMySqlRepository(
      entityManager,
    );
    customerRepository = new CustomerMySqlRepository(entityManager);
    eventRepository = new EventMySqlRepository(entityManager);
    orderService = new OrderService(
      spotReservationRepository,
      customerRepository,
      eventRepository,
      orderRepository,
      unitOfWork,
    );
    partner = Partner.create({ name: 'partner name' });
    entityManager.persist(partner);
    event = partner.initEvent({
      name: 'event name',
      description: 'event description',
      date: new Date(),
    });
    event.addSection({
      name: 'event section name',
      description: 'event section description',
      price: 100,
      total_spots: 1,
    });
    event.publishAll();
    entityManager.persist(event);
    customer = Customer.create({
      name: 'customer name',
      cpf: '03520985110',
    });
    entityManager.persist(customer);
    await entityManager.flush();
  });

  afterAll(async () => {
    await orm.close();
  });

  test('Should create an order', async () => {
    const sectionId = event.sections.find((section) => true).id.value;
    const spotId = event.sections
      .find((section) => true)
      .spots.find((spot) => true).id.value;
    const order = await orderService.reserve({
      customer_id: customer.id.value,
      event_id: event.id.value,
      event_section_id: sectionId,
      event_spot_id: spotId,
    });
    const orderInDb = await orderRepository.findById(order.id);
    expect(order.equals(orderInDb));
    const spotReservationsInDb = await spotReservationRepository.findById(
      spotId,
    );
    expect(spotReservationsInDb).toBeDefined();
  });

  test('Should list all created orders', async () => {
    const orders = await orderService.list();
    expect(orders).toHaveLength(0);
    expect(orders).toBeInstanceOf(Array);
  });

  test('Should list all created orders', async () => {
    const order = Order.create({
      amount: 100,
      customer_id: customer.id,
      event_spot_id: event.sections.find(() => true).spots.find(() => true).id,
    });
    await orderRepository.add(order);
    await entityManager.flush();
    entityManager.clear();
    const orders = await orderService.list();
    expect(orders).toHaveLength(1);
    expect(orders).toBeInstanceOf(Array);
    expect(orders.at(0).equals(order)).toBeTruthy();
  });

  test('Should not be able to create an order with spot already reserved', async () => {
    event.sections.find(() => true).spots.find(() => true).is_reserved = true;
    entityManager.persist(event);
    await entityManager.flush();
    const sectionId = event.sections.find((section) => true).id.value;
    const spotId = event.sections
      .find((section) => true)
      .spots.find((spot) => true).id.value;
    expect(() =>
      orderService.reserve({
        customer_id: customer.id.value,
        event_id: event.id.value,
        event_section_id: sectionId,
        event_spot_id: spotId,
      }),
    ).rejects.toThrow(Error);
    const spotReservationsInDb = await spotReservationRepository.findById(
      spotId,
    );
    expect(spotReservationsInDb).toBeNull();
  });

  test('Should not be able to create an order on a unpublished event', async () => {
    event.unPublish();
    entityManager.persist(event);
    await entityManager.flush();
    const sectionId = event.sections.find((section) => true).id.value;
    const spotId = event.sections
      .find((section) => true)
      .spots.find((spot) => true).id.value;
    expect(() =>
      orderService.reserve({
        customer_id: customer.id.value,
        event_id: event.id.value,
        event_section_id: sectionId,
        event_spot_id: spotId,
      }),
    ).rejects.toThrow(Error);
    const spotReservationsInDb = await spotReservationRepository.findById(
      spotId,
    );
    expect(spotReservationsInDb).toBeNull();
  });

  test('Should not be able to create an order on a unpublished event section', async () => {
    event.sections.find(() => true).unPublish();
    entityManager.persist(event);
    await entityManager.flush();
    const sectionId = event.sections.find((section) => true).id.value;
    const spotId = event.sections
      .find((section) => true)
      .spots.find((spot) => true).id.value;
    expect(() =>
      orderService.reserve({
        customer_id: customer.id.value,
        event_id: event.id.value,
        event_section_id: sectionId,
        event_spot_id: spotId,
      }),
    ).rejects.toThrow(Error);
    const spotReservationsInDb = await spotReservationRepository.findById(
      spotId,
    );
    expect(spotReservationsInDb).toBeNull();
  });

  test('Should not be able to create an order on a unpublished spot', async () => {
    event.sections
      .find(() => true)
      .spots.find(() => true)
      .unPublish();
    entityManager.persist(event);
    await entityManager.flush();
    const sectionId = event.sections.find((section) => true).id.value;
    const spotId = event.sections
      .find((section) => true)
      .spots.find((spot) => true).id.value;
    expect(() =>
      orderService.reserve({
        customer_id: customer.id.value,
        event_id: event.id.value,
        event_section_id: sectionId,
        event_spot_id: spotId,
      }),
    ).rejects.toThrow(Error);
    const spotReservationsInDb = await spotReservationRepository.findById(
      spotId,
    );
    expect(spotReservationsInDb).toBeNull();
  });
});
