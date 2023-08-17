import { Uuid } from '../../../../../src/@core/common/domain/value-objects/uuid.vo';
import { AggregateRoot } from '../../../../../src/@core/common/domain/aggregate-root';
import { Event } from './event.entity';
import { PartnerCreated } from '../domain-events/partner-created.event';
import { PartnerChangedName } from '../domain-events/partner-changed-name.event';

export class PartnerId extends Uuid {}

export type InitEventCommand = {
  name: string;
  description?: string;
  date: Date;
};

export type PartnerContructorProps = {
  id?: PartnerId | string;
  name: string;
};

export class Partner extends AggregateRoot {
  id: PartnerId;
  name: string;

  constructor(props: PartnerContructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new PartnerId(props.id)
        : props.id ?? new PartnerId();
    this.name = props.name;
  }

  static create(command: { name: string }): Partner {
    const partner = new Partner({
      name: command.name,
    });
    partner.addEvent(new PartnerCreated(partner.id, partner.name));
    return partner;
  }

  changeName(name: string) {
    this.name = name;
    this.addEvent(new PartnerChangedName(this.id, this.name));
  }

  initEvent(command: InitEventCommand): Event {
    const event = Event.create({
      ...command,
      partner_id: this.id,
    });
    return event;
  }

  toJSON() {
    return { id: this.id.value, name: this.name };
  }
}
