import { Entity } from '../../../common/domain/entity';
import { Uuid } from '../../../common/domain/value-objects/uuid.vo';

export class EventSpotId extends Uuid {}

export type EventSpotConstructorProps = {
  id?: EventSpotId | string;
  location?: string;
  is_reserved: boolean;
  is_published: boolean;
};

export class EventSpot extends Entity {
  id: EventSpotId;
  location?: string;
  is_reserved: boolean;
  is_published: boolean;

  constructor(props: EventSpotConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new EventSpotId(props.id)
        : props.id ?? new EventSpotId();
    this.location = props.location ?? undefined;
    this.is_reserved = props.is_reserved;
    this.is_published = props.is_published;
  }

  static create() {
    return new EventSpot({
      location: undefined,
      is_published: false,
      is_reserved: false,
    });
  }

  changeLocation(location: string) {
    this.location = location;
  }

  markAsReserved() {
    this.is_reserved = true;
  }

  publish() {
    this.is_published = true;
  }

  unPublish() {
    this.is_published = false;
  }

  toJSON() {
    return {
      id: this.id.value,
      location: this.location,
      is_reserved: this.is_reserved,
      is_published: this.is_published,
    };
  }
}
