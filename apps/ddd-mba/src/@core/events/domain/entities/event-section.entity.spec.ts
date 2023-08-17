import { initOrm } from '../init-orm';
import { EventSection } from './event-section.entity';

describe('Event Section Aggregate Root', () => {
  initOrm();
  test('Should be able to create an Event Section', () => {
    const eventSection = EventSection.create({
      name: 'shoulder composed',
      price: 12.8,
      total_spots: 10,
      description: 'primitive',
    });
    expect(eventSection).toBeInstanceOf(EventSection);
    expect(eventSection.is_published).toBeFalsy();
    expect(eventSection.name).toBe('shoulder composed');
    expect(eventSection.price).toBe(12.8);
  });

  test('should be able to change name', () => {
    const eventSection = EventSection.create({
      name: 'section name',
      description: 'section description',
      price: 100.1,
      total_spots: 1,
    });
    eventSection.changeName('new section name');
    expect(eventSection.name).toBe('new section name');
  });

  test('should be able to change description', () => {
    const eventSection = EventSection.create({
      name: 'section name',
      description: 'section description',
      price: 100.1,
      total_spots: 1,
    });
    eventSection.changeDescription('new section description');
    expect(eventSection.description).toBe('new section description');
    eventSection.changeDescription();
    expect(eventSection.description).toBeUndefined();
  });

  test('should be able to change price', () => {
    const eventSection = EventSection.create({
      name: 'section name',
      description: 'section description',
      price: 100.1,
      total_spots: 1,
    });
    eventSection.changePrice(10);
    expect(eventSection.price).toBe(10);
  });

  test('Should initiate with total_spots_reserved as 0', () => {
    const eventSection = EventSection.create({
      name: 'shoulder composed',
      price: 12.8,
      total_spots: 10,
      description: 'primitive',
    });
    expect(eventSection).toBeInstanceOf(EventSection);
    expect(eventSection.total_spots).toBe(10);
    expect(eventSection.total_spots_reserved).toBe(0);
  });

  test('Should be able to publish a Event Section', () => {
    const eventSection = EventSection.create({
      name: 'section name',
      description: 'section description',
      price: 100.1,
      total_spots: 1,
    });
    expect(eventSection.is_published).toBeFalsy();
    eventSection.publish();
    expect(eventSection.is_published).toBeTruthy();
    eventSection.spots.forEach((spot) => {
      expect(spot.is_published).toBeFalsy();
    });
  });

  test('should be able to publish all related with this Event Section', () => {
    const eventSection = EventSection.create({
      name: 'section name',
      description: 'section description',
      price: 100.1,
      total_spots: 2,
    });
    expect(eventSection.is_published).toBeFalsy();
    eventSection.publishAll();
    expect(eventSection.is_published).toBeTruthy();
    eventSection.spots.forEach((spot) => {
      expect(spot.is_published).toBeTruthy();
    });
  });

  test('Should be able to unpublish a Event Section', () => {
    const eventSection = EventSection.create({
      name: 'section name',
      description: 'section description',
      price: 100.1,
      total_spots: 1,
    });
    eventSection.is_published = true;
    eventSection.spots.forEach((spot) => {
      spot.is_published = true;
    });
    eventSection.unPublish();
    expect(eventSection.is_published).toBeFalsy();
    eventSection.spots.forEach((spot) => {
      expect(spot.is_published).toBeTruthy();
    });
  });

  test('should be able to unpublish all related with this Event Section', () => {
    const eventSection = EventSection.create({
      name: 'section name',
      description: 'section description',
      price: 100.1,
      total_spots: 2,
    });
    eventSection.is_published = true;
    eventSection.spots.forEach((spot) => {
      spot.is_published = true;
    });
    eventSection.unPublishAll();
    expect(eventSection.is_published).toBeFalsy();
    eventSection.spots.forEach((spot) => {
      expect(spot.is_published).toBeFalsy();
    });
  });

  test('should find a spot', () => {
    const eventSection = EventSection.create({
      name: 'section name',
      description: 'section description',
      price: 100.1,
      total_spots: 1,
    });
    const spotInSection = eventSection.spots.find(() => true);
    const spot = eventSection.findSpot({ spot_id: spotInSection.id });
    expect(spot).toBeDefined();
    expect(spot.equals(spotInSection));
  });
});
