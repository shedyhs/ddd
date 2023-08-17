import { IUnitOfWork } from '../../common/application/unit-of-work.interface';
import { EventSectionId } from '../domain/entities/event-section.entity';
import { EventSpotId } from '../domain/entities/event-spot.entity';
import { Order } from '../domain/entities/order.entity';
import { SpotReservation } from '../domain/entities/spot-reservation.entity';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
import { IEventRepository } from '../domain/repositories/event-repository.interface';
import { IOrderRepository } from '../domain/repositories/order-repository.interface';
import { ISpotReservationRepository } from '../domain/repositories/spot-reservation-repository.interface';
import { PaymentGateway } from './payment.gateway';

export class OrderService {
  constructor(
    private spotReservationRepository: ISpotReservationRepository,
    private customerRepository: ICustomerRepository,
    private eventRepository: IEventRepository,
    private orderRepository: IOrderRepository,
    private paymentGateway: PaymentGateway,
    private uow: IUnitOfWork,
  ) {}

  async list() {
    return this.orderRepository.findAll();
  }

  async create(input: {
    event_id: string;
    section_id: string;
    spot_id: string;
    customer_id: string;
    card_token: string;
  }) {
    const customer = await this.customerRepository.findById(input.customer_id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    const event = await this.eventRepository.findById(input.event_id);
    if (!event) {
      throw new Error('Event not found');
    }
    const sectionId = new EventSectionId(input.section_id);
    const spotId = new EventSpotId(input.spot_id);
    if (
      !event.allowReserveSpot({
        section_id: sectionId,
        spot_id: spotId,
      })
    ) {
      throw new Error('Spot not availiable for reserve');
    }
    const spotReservation = await this.spotReservationRepository.findById(
      spotId,
    );
    if (spotReservation) {
      throw new Error('Spot already reserved');
    }
    event.markSpotAsReserved({
      section_id: sectionId,
      spot_id: spotId,
    });
    await this.eventRepository.add(event);
    return await this.uow.runTransaction(async () => {
      try {
        await this.uow.commit();
        const section = event.findSection({ section_id: sectionId });
        await this.paymentGateway.payment({
          token: input.card_token,
          amount: section.price,
        });
        const order = Order.create({
          amount: section.price,
          customer_id: customer.id,
          event_spot_id: spotId,
        });
        order.pay();
        await this.orderRepository.add(order);
        const reservation = SpotReservation.create({
          customer_id: customer.id,
          spot_id: spotId,
        });
        await this.spotReservationRepository.add(reservation);
        await this.uow.commit();
        return order;
      } catch (e) {
        const section = event.findSection({ section_id: sectionId });
        const order = Order.create({
          amount: section.price,
          customer_id: customer.id,
          event_spot_id: spotId,
        });
        order.cancel();
        await this.orderRepository.add(order);
        await this.uow.commit();
        throw new Error('Error when reserving spot');
      }
    });
  }
}
