import { IUnitOfWork } from '../../common/application/unit-of-work.interface';
import { EventSectionId } from '../domain/entities/event-section.entity';
import { EventSpotId } from '../domain/entities/event-spot.entity';
import { Order } from '../domain/entities/order.entity';
import { SpotReservation } from '../domain/entities/spot-reservation.entity';
import { IEventRepository } from '../domain/repositories/event-repository.interface';
import { IOrderRepository } from '../domain/repositories/order-repository.interface';
import { ISpotReservationRepository } from '../domain/repositories/spot-reservation-repository.interface';

export class OrderService {
  constructor(
    private spotReservationRepository: ISpotReservationRepository,
    private customerRepository: IEventRepository,
    private eventRepository: IEventRepository,
    private orderRepository: IOrderRepository,
    private uow: IUnitOfWork,
  ) {}

  async list() {
    return this.orderRepository.findAll();
  }

  async reserve(input: {
    event_id: string;
    event_section_id: string;
    event_spot_id: string;
    customer_id: string;
  }) {
    const customer = await this.customerRepository.findById(input.customer_id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    const event = await this.eventRepository.findById(input.event_id);
    if (!event) {
      throw new Error('Event not found');
    }
    const sectionId = new EventSectionId(input.event_section_id);
    const spotId = new EventSpotId(input.event_spot_id);
    if (
      !event.allowReserveSpot({
        section_id: sectionId,
        spot_id: spotId,
      })
    ) {
      throw new Error('Spot not availiable for reserve');
    }
    const spotReservation = this.spotReservationRepository.findById(spotId);
    if (spotReservation) {
      throw new Error('Spot already reserved');
    }
    const reservation = SpotReservation.create({
      customer_id: customer.id,
      spot_id: spotId,
    });
    await this.spotReservationRepository.add(reservation);

    const section = event.sections.find((section) =>
      section.id.equals(sectionId),
    );

    const order = Order.create({
      amount: section.price,
      customer_id: customer.id,
      event_spot_id: spotId,
    });
    await this.orderRepository.add(order);
    await this.uow.commit();
    return order;
  }
}
