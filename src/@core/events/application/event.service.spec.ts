import { EntityManager, MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { IEventRepository } from '../domain/repositories/event-repository.interface';
import {
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  PartnerSchema,
} from '../infra/db/schemas';
import { EventMySqlRepository } from '../infra/db/repositories/event-mysql.repository';
import { Event } from '../domain/entities/event.entity';
import { EventService } from './event.service';
import { IUnitOfWork } from '../../common/application/unit-of-work.interface';
import { UnitOfWorkMikroOrm } from '../../common/infra/unit-of-work-mikro-orm';
import { PartnerMySqlRepository } from '../infra/db/repositories/partner-mysql.repository';
import { IPartnerRepository } from '../domain/repositories/partner-repository.interface';
import { Partner } from '../domain/entities/partner.entity';
import {
  EventSection,
  EventSectionId,
} from '../domain/entities/event-section.entity';
import { EventSpot, EventSpotId } from '../domain/entities/event-spot.entity';
describe('Event Service Test', () => {
  let orm: MikroORM;
  let entityManager: EntityManager;
  let eventRepository: IEventRepository;
  let partnerRepository: IPartnerRepository;
  let unitOfWork: IUnitOfWork;
  let eventService: EventService;
  let partner: Partner;
  beforeEach(async () => {
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
    entityManager = orm.em.fork();
    unitOfWork = new UnitOfWorkMikroOrm(entityManager);
    eventRepository = new EventMySqlRepository(entityManager);
    partnerRepository = new PartnerMySqlRepository(entityManager);
    entityManager.clear();
    await orm.schema.refreshDatabase();
    eventService = new EventService(
      partnerRepository,
      eventRepository,
      unitOfWork,
    );
    partner = Partner.create({ name: 'Partner name' });
    await partnerRepository.add(partner);
    await unitOfWork.commit();
  });
  afterEach(async () => {
    await orm.close();
  });

  test('should create a event', async () => {
    const event = await eventService.create({
      date: new Date(),
      name: 'Event name',
      description: 'Event description',
      partner_id: partner.id.value,
    });
    const eventInDb = await eventRepository.findById(event.id);
    expect(event.equals(eventInDb)).toBeTruthy();
  });

  test('should update a event', async () => {
    const event = partner.initEvent({
      date: new Date(),
      name: 'event name',
      description: 'event description name',
    });
    await eventRepository.add(event);
    await unitOfWork.commit();
    const updatedEvent = await eventService.update(event.id.value, {
      date: new Date(),
      name: 'new event name',
      description: 'new event description',
    });
    await unitOfWork.rollback();
    const eventInDb = await eventRepository.findById(event.id);
    expect(event.equals(eventInDb)).toBeTruthy();
    expect(eventInDb.name).toBe('new event name');
    expect(eventInDb.description).toBe('new event description');
    expect(eventInDb.date).toBeInstanceOf(Date);
  });

  test('should add a section', async () => {
    const event = await eventService.create({
      date: new Date(),
      name: 'Event name',
      description: 'Event description',
      partner_id: partner.id.value,
    });
    expect(event.sections.count()).toBe(0);
    await eventService.addSection({
      event_id: event.id.value,
      name: 'event section name',
      description: 'event section description',
      price: 100.0,
      total_spots: 1,
    });
    await unitOfWork.rollback();
    const eventInDb = await eventRepository.findById(event.id);
    expect(eventInDb.sections.count()).toBe(1);
  });

  test('should update an section', async () => {
    const event = partner.initEvent({
      date: new Date(),
      name: 'event name',
      description: 'event description name',
    });
    event.addSection({
      name: 'event section name',
      description: 'event section description',
      price: 100.0,
      total_spots: 1,
    });
    const eventSectionId = [...event.sections][0].id.value;
    await eventRepository.add(event);
    await unitOfWork.commit();
    await unitOfWork.rollback();
    const sections = await eventService.updateSection({
      event_id: event.id.value,
      section_id: eventSectionId,
      name: 'new event section name',
      description: 'new event section description',
    });
    expect(sections.count()).toBe(1);
    const section = [...sections][0];
    expect(section.id.equals(new EventSectionId(eventSectionId)));
    expect(section.name).toBe('new event section name');
    expect(section.description).toBe('new event section description');
  });

  test('should publish all of this event', async () => {
    const event = partner.initEvent({
      date: new Date(),
      name: 'event name',
      description: 'event description name',
    });
    event.addSection({
      name: 'event section name',
      description: 'event section description',
      price: 100.0,
      total_spots: 1,
    });
    await eventRepository.add(event);
    await unitOfWork.commit();
    const publishedEvent = await eventService.publishAll({
      event_id: event.id.value,
    });
    expect(publishedEvent.is_published).toBeTruthy();
    publishedEvent.sections.forEach((section) => {
      expect(section.is_published).toBeTruthy();
      section.spots.forEach((spot) => {
        expect(spot.is_published).toBeTruthy();
      });
    });
  });

  test('should return all sections of event', async () => {
    const event = partner.initEvent({
      date: new Date(),
      name: 'event name',
      description: 'event description name',
    });
    event.addSection({
      name: 'event section name',
      description: 'event section description',
      price: 100.0,
      total_spots: 1,
    });
    await eventRepository.add(event);
    await unitOfWork.commit();
    await unitOfWork.rollback();
    const sections = await eventService.findSections(event.id.value);
    sections.forEach((section) => {
      expect(section).toBeInstanceOf(EventSection);
    });
    expect(sections.count()).toBe(1);
  });

  test('should return all spots of section of event', async () => {
    const event = partner.initEvent({
      date: new Date(),
      name: 'event name',
      description: 'event description name',
    });
    event.addSection({
      name: 'event section name',
      description: 'event section description',
      price: 100.0,
      total_spots: 1,
    });
    await eventRepository.add(event);
    await unitOfWork.commit();
    await unitOfWork.rollback();
    const eventSectionId = [...event.sections][0].id.value;
    const spots = await eventService.findSpots({
      event_id: event.id.value,
      section_id: eventSectionId,
    });
    spots.forEach((spots) => {
      expect(spots).toBeInstanceOf(EventSpot);
    });
    expect(spots.count()).toBe(1);
  });

  test('should list all events', async () => {
    let events = await eventService.list();
    expect(events).toHaveLength(0);
    const createdEvent = partner.initEvent({
      date: new Date(),
      name: 'event name',
      description: 'event description name',
    });
    await eventRepository.add(createdEvent);
    await unitOfWork.commit();
    await unitOfWork.rollback();
    events = await eventService.list();
    expect(events).toHaveLength(1);
    events.forEach((event) => {
      expect(event).toBeInstanceOf(Event);
    });
  });

  test('should update an location spot of section', async () => {
    const event = partner.initEvent({
      date: new Date(),
      name: 'event name',
      description: 'event description name',
    });
    event.addSection({
      name: 'event section name',
      description: 'event section description',
      price: 100.0,
      total_spots: 1,
    });
    const eventSectionId = [...event.sections][0].id.value;
    const eventSpotId = [...[...event.sections][0].spots][0].id.value;
    await eventRepository.add(event);
    await unitOfWork.commit();
    await unitOfWork.rollback();
    const spot = await eventService.changeLocation({
      event_id: event.id.value,
      section_id: eventSectionId,
      spot_id: eventSpotId,
      location: 'location name',
    });

    expect(spot.id.equals(new EventSpotId(eventSpotId))).toBeTruthy();
    expect(spot.location).toBe('location name');
  });
});
