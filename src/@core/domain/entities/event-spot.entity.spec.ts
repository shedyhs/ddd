import { EventSpot } from './event-spot.entity';

describe('Event Spot Entity', () => {
  test('Should create a Event Spot', () => {
    const spot = EventSpot.create();
    expect(spot).toBeInstanceOf(EventSpot);
    expect(spot.id).toBeDefined();
    expect(spot.location).toBeUndefined();
    expect(spot.is_published).toBeFalsy();
    expect(spot.is_reserved).toBeFalsy();
  });

  test('Should be able to change location of spot', () => {
    const spot = EventSpot.create();
    expect(spot.location).toBeUndefined();
    spot.changeLocation('A1');
    expect(spot.location).toBe('A1');
  });

  test('Should be able to publish a spot', () => {
    const spot = EventSpot.create();
    expect(spot.is_published).toBeFalsy();
    spot.publish();
    expect(spot.is_published).toBeTruthy();
  });

  test('Should be able to unpublish a spot', () => {
    const spot = EventSpot.create();
    spot.is_published = true;
    spot.unPublish();
    expect(spot.is_published).toBeFalsy();
  });

  test('Should be able to reserve a spot', () => {
    const spot = EventSpot.create();
    expect(spot.is_reserved).toBeFalsy();
    spot.markAsReserved();
    expect(spot.markAsReserved).toBeTruthy();
  });
});
