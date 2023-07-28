import { Event } from './event.entity';
import { Partner } from './partner.entity';

describe('Partner Aggregate Root', () => {
  test('Should be able to create an Partner', () => {
    const partner = Partner.create({
      name: 'Jon Harris',
    });
    expect(partner.id).toBeDefined();
    expect(partner.name).toBe('Jon Harris');
  });

  test('Partner can initiate an event', () => {
    const partner = Partner.create({
      name: 'James Strickland',
    });

    const event = partner.initEvent({
      date: new Date(),
      name: 'border fine',
      description: 'fairly represent',
    });

    expect(event).toBeInstanceOf(Event);
    expect(event.partner_id).toBe(partner.id);
  });
});
