import { MikroORM, EntityManager } from '@mikro-orm/mysql';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Event } from '../../../domain/entities/event.entity';
import { IEventRepository } from '../../../domain/repositories/event-repository.interface';
import {
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  PartnerSchema,
} from '../schemas';
import { EventMySqlRepository } from './event-mysql.repository';
import { Partner } from '../../../domain/entities/partner.entity';
import { PartnerMySqlRepository } from './partner-mysql.repository';
import { IPartnerRepository } from '../../../domain/repositories/partner-repository.interface';

describe('Event MySql repository', () => {
  let orm: MikroORM;
  let entityManager: EntityManager;
  let eventRepository: IEventRepository;
  let partnerRepository: IPartnerRepository;
  let partner: Partner;
  let event: Event;

  beforeAll(async () => {
    orm = await MikroORM.init<MySqlDriver>({
      entities: [
        EventSchema,
        EventSectionSchema,
        EventSpotSchema,
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
    partnerRepository = new PartnerMySqlRepository(entityManager);
    eventRepository = new EventMySqlRepository(entityManager);

    partner = Partner.create({ name: 'partner name' });
    await partnerRepository.add(partner);
    await entityManager.flush();
    event = partner.initEvent({
      date: new Date(),
      name: 'event name',
      description: 'event description',
    });
  });
  afterEach(async () => {
    entityManager.clear();
  });

  test('Should add a event in database', async () => {
    await eventRepository.add(event);
    await entityManager.flush();
    entityManager.clear();
    const [eventsInDb, numberOfEventsInDb] = await entityManager.findAndCount(
      Event,
      {
        id: event.id,
      },
    );
    expect(numberOfEventsInDb).toBe(1);
    expect(eventsInDb[0].equals(event)).toBeTruthy();
  });

  test('Should add a event in database', async () => {
    await eventRepository.add(event);
    await entityManager.flush();
    entityManager.clear();
    const [eventsInDb, numberOfEventsInDb] = await entityManager.findAndCount(
      Event,
      {
        id: event.id,
      },
    );
    expect(numberOfEventsInDb).toBe(1);
    expect(eventsInDb[0].equals(event)).toBeTruthy();
  });

  test('find by id should return event in db', async () => {
    await eventRepository.add(event);
    await entityManager.flush();
    entityManager.clear();
    const foundEvent = await eventRepository.findById(event.id);
    expect(event.equals(foundEvent)).toBeTruthy();
  });

  test('find by nonenxistent id in database should return nullish', async () => {
    const nonenxistentEventId = 'dcc564b5-9737-5882-9f20-1616350ee8ea';
    const foundEvent = await eventRepository.findById(nonenxistentEventId);
    expect(foundEvent).toBeNull();
  });

  test('Should update a event in database', async () => {
    await eventRepository.add(event);
    await entityManager.flush();
    entityManager.clear();
    event.changeName('another event name');
    await eventRepository.add(event);
    await entityManager.flush();
    entityManager.clear();
    const foundEvent = await eventRepository.findById(event.id);
    expect(event.equals(foundEvent)).toBeTruthy();
    expect(foundEvent.name).toBe('another event name');
  });

  test('find all should return all events in db', async () => {
    await eventRepository.add(event);
    await entityManager.flush();
    entityManager.clear();
    const foundEvents = await eventRepository.findAll();
    expect(foundEvents).toHaveLength(1);
    foundEvents.map((event) => {
      expect(event).toBeInstanceOf(Event);
    });
  });

  test('delete should remove event from db', async () => {
    await eventRepository.add(event);
    await entityManager.flush();
    entityManager.clear();
    let eventsInDb = await entityManager.count(Event);
    expect(eventsInDb).toBe(1);
    await eventRepository.delete(event);
    await entityManager.flush();
    eventsInDb = await entityManager.count(Event);
    expect(eventsInDb).toBe(0);
  });
});
