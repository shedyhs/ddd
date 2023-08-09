import { EntityManager, MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { Customer } from '../../../../../@core/events/domain/entities/customer.entity';
import { ICustomerRepository } from '../../../../../@core/events/domain/repositories/customer-repository.interface';
import { IEventRepository } from '../../../../../@core/events/domain/repositories/event-repository.interface';
import { IOrderRepository } from '../../../../../@core/events/domain/repositories/order-repository.interface';
import { CustomerMySqlRepository } from './customer-mysql.repository';
import { EventMySqlRepository } from './event-mysql.repository';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
} from '../schemas';
import { OrderMySqlRepository } from './order-mysql.repository';
import { PartnerMySqlRepository } from './partner-mysql.repository';
import { IPartnerRepository } from '../../../../../../src/@core/events/domain/repositories/partner-repository.interface';
import { Partner } from '../../../../../@core/events/domain/entities/partner.entity';
import { Order } from '../../../../../@core/events/domain/entities/order.entity';
import { Event } from '../../../../../@core/events/domain/entities/event.entity';

describe('Order Mysql Repository Test', () => {
  let orm: MikroORM;
  let entityManager: EntityManager;
  let eventRepository: IEventRepository;
  let customerRepository: ICustomerRepository;
  let orderRepository: IOrderRepository;
  let partnerRepository: IPartnerRepository;
  let event: Event;
  let partner: Partner;
  let customer: Customer;
  let order: Order;
  beforeAll(async () => {
    orm = await MikroORM.init<MySqlDriver>({
      entities: [
        CustomerSchema,
        EventSchema,
        EventSectionSchema,
        EventSpotSchema,
        OrderSchema,
        PartnerSchema,
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
    eventRepository = new EventMySqlRepository(entityManager);
    customerRepository = new CustomerMySqlRepository(entityManager);
    partnerRepository = new PartnerMySqlRepository(entityManager);
    orderRepository = new OrderMySqlRepository(entityManager);
    partner = Partner.create({ name: 'partner name' });
    event = partner.initEvent({
      date: new Date(),
      name: 'event name',
      description: 'event description',
    });
    event.addSection({
      name: 'event section name',
      price: 100,
      total_spots: 1,
      description: 'event section description',
    });
    customer = Customer.create({
      cpf: '03520985110',
      name: 'customer name',
    });
    await partnerRepository.add(partner);
    await eventRepository.add(event);
    await customerRepository.add(customer);
    await entityManager.flush();
    order = Order.create({
      amount: 100,
      customer_id: customer.id,
      event_spot_id: event.sections.find(() => true).spots.find(() => true).id,
    });
    entityManager.clear();
  });
  afterEach(() => {
    entityManager.clear();
  });
  afterAll(async () => {
    await orm.close();
  });

  test('Should add a order in database', async () => {
    await orderRepository.add(order);
    await entityManager.flush();
    entityManager.clear();
    const foundOrdersInDb = await entityManager.findOne(Order, {
      id: order.id,
    });
    expect(order.equals(foundOrdersInDb)).toBeTruthy();
  });

  test('should find an order by id', async () => {
    await orderRepository.add(order);
    await entityManager.flush();
    entityManager.clear();
    const foundOrderInDb = await orderRepository.findById(order.id);
    expect(order.equals(foundOrderInDb)).toBeTruthy();
  });

  test('should list all orders', async () => {
    await orderRepository.add(order);
    await entityManager.flush();
    entityManager.clear();
    const foundOrdersInDb = await orderRepository.findAll();
    expect(foundOrdersInDb).toHaveLength(1);
    expect(order.equals(foundOrdersInDb.at(0)));
  });

  test('should delete an existent order', async () => {
    await orderRepository.add(order);
    await entityManager.flush();
    entityManager.clear();
    let ordersInDb = await entityManager.count(Order);
    expect(ordersInDb).toBe(1);
    await orderRepository.delete(order);
    await entityManager.flush();
    const afterDelete = await entityManager.count(Order);
    expect(afterDelete).toBe(0);
  });
});
