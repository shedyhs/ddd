import { Uuid } from '../../../../../src/@core/common/domain/value-objects/uuid.vo';
import {
  CreateCommandEventSection,
  EventSection,
  EventSectionId,
} from './event-section.entity';
import { PartnerId } from './partner.entity';
import { AggregateRoot } from '../../../../../src/@core/common/domain/aggregate-root';
import {
  AnyCollection,
  CollectionFactory,
  ICollection,
} from '../../../../../src/@core/common/domain/collection';
import { EventSpotId } from './event-spot.entity';

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
  private _sections: ICollection<EventSection>;

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
    this._sections = CollectionFactory.create<EventSection>(this);
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
    this._sections.add(section);
    this.total_spots += section.total_spots;
  }

  changeSectionInformation(command: {
    section_id: EventSectionId;
    name?: string;
    description?: string;
  }) {
    const section = this.sections.find((section) =>
      section.id.equals(command.section_id),
    );
    if (!section) {
      throw new Error('Section not found');
    }
    'name' in command && section.changeName(command.name);
    'description' in command && section.changeDescription(command.description);
  }

  changeLocation(command: {
    section_id: EventSectionId;
    spot_id: EventSpotId;
    location: string;
  }) {
    const section = this.sections.find((section) =>
      section.id.equals(command.section_id),
    );
    if (!section) {
      throw new Error('Section not found');
    }
    section.changeSpotLocation({
      spot_id: command.spot_id,
      location: command.location,
    });
  }

  allowReserveSpot(command: {
    section_id: EventSectionId;
    spot_id: EventSpotId;
  }) {
    if (!this.is_published) {
      return false;
    }
    const section = this.sections.find((section) =>
      section.id.equals(command.section_id),
    );
    if (!section) {
      throw new Error('Section not found');
    }
    return section.allowReserveSpot(command.spot_id);
  }

  publishAll() {
    this.publish();
    this._sections.forEach((section) => section.publishAll());
  }

  publish() {
    this.is_published = true;
  }

  unPublishAll() {
    this.unPublish();
    this._sections.forEach((section) => section.unPublishAll());
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

  get sections(): ICollection<EventSection> {
    return this._sections as ICollection<EventSection>;
  }

  set sections(sections: AnyCollection<EventSection>) {
    this._sections = CollectionFactory.createFrom<EventSection>(sections);
  }
}
