import { AggregateRoot } from '../../../../src/@core/common/domain/aggregate-root';
import { Uuid } from '../../../../src/@core/common/domain/value-objects/uuid.vo';
import {
  CreateCommandEventSection,
  EventSection,
} from './event-section.entity';
import { PartnerId } from './partner.entity';

export class EventId extends Uuid {}

export type CreateEventCommand = {
  name: string;
  description?: string | null;
  date: Date;
  partner_id: PartnerId;
};

export type AddSectionCommand = CreateCommandEventSection;

export type EventContructorProps = {
  id?: EventId | string;
  name: string;
  description?: string | null;
  date: Date;
  is_published: boolean;

  total_spots: number;
  total_spots_reserved: number;
  partner_id: PartnerId;
  sections?: Set<EventSection>;
};

export class Event extends AggregateRoot {
  id: EventId;
  name: string;
  description?: string | null;
  date: Date;
  is_published: boolean;

  total_spots: number;
  total_spots_reserved: number;
  partner_id: PartnerId | string;
  sections: Set<EventSection>;

  constructor(props: EventContructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new EventId(props.id)
        : props.id ?? new EventId();
    this.name = props.name;
    this.description = props.description;
    this.date = props.date;
    this.is_published = props.is_published;
    this.total_spots = props.total_spots;
    this.total_spots_reserved = props.total_spots_reserved;
    this.partner_id =
      props.partner_id instanceof PartnerId
        ? props.partner_id
        : new PartnerId(props.partner_id);
    this.sections = props.sections ?? new Set<EventSection>();
  }

  static create(command: CreateEventCommand): Event {
    return new Event({
      name: command.name,
      description: command.description ?? undefined,
      date: command.date,
      partner_id: command.partner_id,
      is_published: false,
      total_spots: 0,
      total_spots_reserved: 0,
    });
  }

  addSection(command: AddSectionCommand) {
    const section = EventSection.create(command);
    this.sections.add(section);
    this.total_spots += section.total_spots;
  }

  publishAll() {
    this.publish();
    this.sections.forEach((section) => section.publishAll());
  }

  publish() {
    this.is_published = true;
  }

  unPublishAll() {
    this.unPublish();
    this.sections.forEach((section) => section.unPublishAll());
  }

  unPublish() {
    this.is_published = false;
  }

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description?: string) {
    this.description = description || undefined;
  }

  changeDate(date: Date) {
    this.date = date;
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      description: this.description,
      date: this.date,
      is_published: this.is_published,
      sections: [...this.sections].map((section) => section.toJSON()),
    };
  }
}
