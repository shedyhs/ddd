import { initOrm } from '../init-orm';
import { Customer } from './customer.entity';
import { EventSpotId } from './event-spot.entity';
import { Event } from './event.entity';
import { Partner } from './partner.entity';
import { SpotReservation } from './spot-reservation.entity';

describe('Spot Reservation Entity Test', () => {
  initOrm();
  let customer: Customer;
  let partner: Partner;
  let event: Event;
  let spotId: EventSpotId;

  beforeEach(() => {
    partner = Partner.create({ name: 'partner name' });
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
    spotId = event.sections.find(() => true).spots.find(() => true).id;
    customer = Customer.create({
      name: 'customer name',
      cpf: '03520985110',
    });
  });

  test('should be able to create a spot reservation', () => {
    const spotReservation = SpotReservation.create({
      customer_id: customer.id,
      spot_id: spotId,
    });
    expect(spotReservation).toBeInstanceOf(SpotReservation);
    expect(spotReservation.spot_id.equals(spotId));
    expect(spotReservation.customer_id.equals(customer.id));
  });

  test('should be able to change reservation between customers', () => {
    const spotReservation = SpotReservation.create({
      customer_id: customer.id,
      spot_id: spotId,
    });
    const anotherCustomer = Customer.create({
      name: 'another customer name',
      cpf: '142.193.620-88',
    });
    spotReservation.changeReservation(anotherCustomer.id);
    expect(spotReservation).toBeInstanceOf(SpotReservation);
    expect(spotReservation.spot_id.equals(spotId));
    expect(spotReservation.customer_id.equals(anotherCustomer.id));
  });
});
