import { AggregateRoot } from '../../../common/domain/aggregate-root';
import { CustomerId } from './customer.entity';
import { EventSpotId } from './event-spot.entity';

export type CreateCommandSpotReservation = {
  spot_id: EventSpotId | string;
  customer_id: CustomerId | string;
};

export type SpotReservationConstructorProps = {
  reservation_date: Date;
  spot_id: EventSpotId | string;
  customer_id: CustomerId | string;
};

export class SpotReservation extends AggregateRoot {
  spot_id: EventSpotId;
  reservation_date: Date;
  customer_id: CustomerId;

  constructor(props: SpotReservationConstructorProps) {
    super();
    this.reservation_date = props.reservation_date;
    this.spot_id =
      props.spot_id instanceof EventSpotId
        ? props.spot_id
        : new EventSpotId(props.spot_id);
    this.customer_id =
      props.customer_id instanceof CustomerId
        ? props.customer_id
        : new CustomerId(props.customer_id);
  }

  static create(command: CreateCommandSpotReservation) {
    return new SpotReservation({
      spot_id: command.spot_id,
      customer_id: command.customer_id,
      reservation_date: new Date(),
    });
  }

  changeReservation(customer_id: CustomerId) {
    this.customer_id = customer_id;
    this.reservation_date = new Date();
  }

  toJSON() {
    return {
      spot_id: this.spot_id,
      reservation_date: this.reservation_date,
      customer_id: this.customer_id,
    };
  }
}
