import { EntityManager, MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { Customer } from '../../../../events/domain/entities/customer.entity';
import { ICustomerRepository } from '../../../../events/domain/repositories/customer-repository.interface';
import { IEventRepository } from '../../../../events/domain/repositories/event-repository.interface';
import { CustomerMySqlRepository } from './customer-mysql.repository';
import { EventMySqlRepository } from './event-mysql.repository';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  PartnerSchema,
  SpotReservationSchema,
} from '../schemas';
import { PartnerMySqlRepository } from './partner-mysql.repository';
import { IPartnerRepository } from '../../../../events/domain/repositories/partner-repository.interface';
import { Partner } from '../../../domain/entities/partner.entity';
import { Event } from '../../../domain/entities/event.entity';
import { ISpotReservationRepository } from '../../../../events/domain/repositories/spot-reservation-repository.interface';
import { SpotReservation } from '../../../../events/domain/entities/spot-reservation.entity';
import { SpotReservationMySqlRepository } from './spot-reservation-mysql.repository';

describe('Spot Reservation MySql Repository', () => {
  let orm: MikroORM;
  let entityManager: EntityManager;
  let eventRepository: IEventRepository;
  let customerRepository: ICustomerRepository;
  let partnerRepository: IPartnerRepository;
  let spotReservationRepository: ISpotReservationRepository;
  let event: Event;
  let partner: Partner;
  let customer: Customer;
  let spotReservation: SpotReservation;
  beforeAll(async () => {
    orm = await MikroORM.init<MySqlDriver>({
      entities: [
        CustomerSchema,
        EventSchema,
        EventSectionSchema,
        EventSpotSchema,
        PartnerSchema,
        SpotReservationSchema,
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
    spotReservationRepository = new SpotReservationMySqlRepository(
      entityManager,
    );
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

    spotReservation = SpotReservation.create({
      customer_id: customer.id,
      spot_id: event.sections.find(() => true).spots.find(() => true).id,
    });
    entityManager.clear();
  });
  afterEach(() => {
    entityManager.clear();
  });
  afterAll(async () => {
    await orm.close();
  });

  test('should create an reserve of spot', async () => {
    await spotReservationRepository.add(spotReservation);
    await entityManager.flush();
    entityManager.clear();
    const spotReservationInDb = await entityManager.findOne(SpotReservation, {
      spot_id: spotReservation.spot_id,
    });
    const spotId = event.sections.find(() => true).spots.find(() => true).id;
    expect(spotReservationInDb).toBeDefined();
    expect(spotReservation.spot_id.equals(spotId)).toBeTruthy();
  });

  test('should find a spot reservation', async () => {
    entityManager.persist(spotReservation);
    await entityManager.flush();
    entityManager.clear();
    const foundSpotReservation = await spotReservationRepository.findById(
      spotReservation.spot_id,
    );
    expect(spotReservation.equals(foundSpotReservation));
  });

  test('should list all spots reservations', async () => {
    entityManager.persist(spotReservation);
    await entityManager.flush();
    entityManager.clear();
    const foundSpotReservation = await spotReservationRepository.findAll();
    expect(foundSpotReservation).toHaveLength(1);
    expect(spotReservation.equals(foundSpotReservation.at(0)));
  });

  test('should delete a spot reservation', async () => {
    entityManager.persist(spotReservation);
    await entityManager.flush();
    entityManager.clear();
    const foundSpotReservation = await entityManager.find(SpotReservation, {});
    await spotReservationRepository.delete(foundSpotReservation.at(0));
    await entityManager.flush();
    entityManager.clear();
    const spotReservationInDb = await entityManager.count(SpotReservation, {});
    expect(spotReservationInDb).toBe(0);
  });
});
