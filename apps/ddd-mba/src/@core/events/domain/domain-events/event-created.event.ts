import { IDomainEvent } from '../../../common/domain/domain-event';
import { EventId } from '../entities/event.entity';
import { PartnerId } from '../entities/partner.entity';

export class EventCreated implements IDomainEvent {
  public readonly occurred_on: Date;
  public readonly event_version: number = 1;
  constructor(
    readonly aggregate_id: EventId,
    readonly name: string,
    readonly description: string,
    readonly date: Date,
    readonly partner_id: PartnerId,
    readonly is_published: boolean,
    readonly total_spots: number,
    readonly total_spots_reserved: number,
  ) {
    this.occurred_on = new Date();
  }
}
