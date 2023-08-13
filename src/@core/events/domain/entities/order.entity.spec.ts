import { Customer } from './customer.entity';
import { EventSpotId } from './event-spot.entity';
import { Event } from './event.entity';
import { Order, OrderStatus } from './order.entity';
import { Partner } from './partner.entity';

describe('Order Entity Test', () => {
  let event: Event;
  let customer: Customer;
  let partner: Partner;
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

  test('Should create order', () => {
    const order = Order.create({
      customer_id: customer.id,
      event_spot_id: spotId,
      amount: 100,
    });
    expect(order).toBeInstanceOf(Order);
    expect(order.customer_id.equals(customer.id)).toBeTruthy();
    expect(order.event_spot_id.equals(spotId)).toBeTruthy();
    expect(order.amount).toBe(100);
    expect(order.status).toBe(OrderStatus.PENDING);
  });

  test('Should pay order', () => {
    const order = Order.create({
      customer_id: customer.id,
      event_spot_id: spotId,
      amount: 100,
    });
    expect(order).toBeInstanceOf(Order);
    expect(order.status).toBe(OrderStatus.PENDING);
    order.pay();
    expect(order.status).toBe(OrderStatus.PAID);
  });

  test('Should cancel order', () => {
    const order = Order.create({
      customer_id: customer.id,
      event_spot_id: spotId,
      amount: 100,
    });
    expect(order).toBeInstanceOf(Order);
    expect(order.status).toBe(OrderStatus.PENDING);
    order.cancel();
    expect(order.status).toBe(OrderStatus.CANCELLED);
  });
});
