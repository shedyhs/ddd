import { IDomainEvent } from '../../../common/domain/domain-event';
import { PartnerId } from '../entities/partner.entity';

export class PartnerCreated implements IDomainEvent {
  public readonly occurred_on: Date;
  public readonly event_version: number = 1;
  constructor(readonly aggregate_id: PartnerId, readonly name: string) {
    this.occurred_on = new Date();
  }
}
