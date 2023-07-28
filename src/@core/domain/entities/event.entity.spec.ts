import { EventSection } from './event-section.entity';
import { EventSpot } from './event-spot.entity';
import { Event, EventId } from './event.entity';
import { PartnerId } from './partner.entity';

describe('Event Aggregate root', () => {
  test('Should be able to create an Event', () => {
    const event = Event.create({
      date: new Date(),
      name: 'event name',
      description: 'event description',
      partner_id: new PartnerId(),
    });

    event.addSection({
      name: 'section name',
      price: 10.4,
      total_spots: 68,
      description: 'section description',
    });

    expect(event).toBeInstanceOf(Event);
    expect(event.id).toBeInstanceOf(EventId);
    expect(event.is_published).toBeFalsy();
    expect(event.sections.size).toBe(1);
    expect(event.total_spots).toBe(68);
  });

  test('Should be able to change event name', () => {
    const event = Event.create({
      date: new Date(),
      name: 'event name',
      description: 'event description',
      partner_id: new PartnerId(),
    });

    event.changeName('new event name');
    expect(event.name).toBe('new event name');
  });

  test('Should be able to change event description', () => {
    const event = Event.create({
      date: new Date(),
      name: 'event name',
      description: 'event description',
      partner_id: new PartnerId(),
    });
    event.changeDescription('new event description');
    expect(event.description).toBe('new event description');
    event.changeDescription();
    expect(event.description).toBeUndefined();
  });

  test('Should be able to change date', () => {
    const event = Event.create({
      date: new Date(),
      name: 'event name',
      description: 'event description',
      partner_id: new PartnerId(),
    });
    const newEventDate = new Date();
    event.changeDate(newEventDate);
    expect(event.date).toBe(newEventDate);
  });

  test('should be able to publish a event', () => {
    const event = Event.create({
      date: new Date(),
      name: 'event name',
      description: 'event description',
      partner_id: new PartnerId(),
    });
    event.publish();
    expect(event.is_published).toBeTruthy();
  });

  test('should be able to unpublish a event', () => {
    const event = Event.create({
      date: new Date(),
      name: 'event name',
      description: 'event description',
      partner_id: new PartnerId(),
    });
    event.is_published = true;
    event.unPublish();
    expect(event.is_published).toBeFalsy();
  });
});

test('event can create a event section', () => {
  const event = Event.create({
    date: new Date(),
    name: 'event name',
    description: 'event description',
    partner_id: new PartnerId(),
  });

  event.addSection({
    name: 'section name',
    price: 10.1,
    total_spots: 2,
    description: 'section description',
  });
  expect(event.sections.size).toBe(1);
  expect(event.total_spots).toBe(2);
  event.addSection({
    name: 'section name',
    price: 10.1,
    total_spots: 2,
    description: 'section description',
  });
  expect(event.sections.size).toBe(2);
  event.sections.forEach((section) => {
    expect(section).toBeInstanceOf(EventSection);
    expect(section.spots.size).toBe(2);
    expect(section.is_published).toBeFalsy();
  });
  expect(event.total_spots).toBe(4);
});

test('event can publish all related', () => {
  const event = Event.create({
    date: new Date(),
    name: 'event name',
    description: 'event description',
    partner_id: new PartnerId(),
  });
  event.addSection({
    name: 'section name',
    price: 10.1,
    total_spots: 2,
    description: 'section description',
  });
  event.addSection({
    name: 'section name',
    price: 10.1,
    total_spots: 2,
    description: 'section description',
  });
  event.sections.forEach((section) => {
    section.spots.forEach((spot) => {
      expect(spot.is_published).toBeFalsy();
    });
    expect(section.is_published).toBeFalsy();
  });
  event.publishAll();
  event.sections.forEach((section) => {
    section.spots.forEach((spot) => {
      expect(spot.is_published).toBeTruthy();
    });
    expect(section.is_published).toBeTruthy();
  });
});

test('event can unpublish all related', () => {
  const event = Event.create({
    date: new Date(),
    name: 'event name',
    description: 'event description',
    partner_id: new PartnerId(),
  });
  event.is_published = true;
  event.addSection({
    name: 'section name',
    price: 10.1,
    total_spots: 2,
    description: 'section description',
  });
  event.addSection({
    name: 'section name',
    price: 10.1,
    total_spots: 2,
    description: 'section description',
  });
  event.sections.forEach((section) => {
    section.is_published = true;
    section.spots.forEach((spot) => {
      spot.is_published = true;
    });
  });
  event.unPublishAll();
  event.sections.forEach((section) => {
    section.spots.forEach((spot) => {
      expect(spot.is_published).toBeFalsy();
    });
    expect(section.is_published).toBeFalsy();
  });
});
