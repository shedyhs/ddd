import { Entity } from '../../../../src/@core/common/domain/entity';
import { Uuid } from '../../../../src/@core/common/domain/value-objects/uuid.vo';
import { EventSpot } from './event-spot.entity';

export class EventSectionId extends Uuid {}

export type CreateCommandEventSection = {
  name: string;
  description?: string;
  total_spots: number;
  price: number;
};

export type EventSectionConstructorProps = {
  id?: EventSectionId | string;
  name: string;
  description?: string;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  price: number;
  spots?: Set<EventSpot>;
};

export class EventSection extends Entity {
  id: EventSectionId;
  name: string;
  description?: string;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  price: number;
  spots: Set<EventSpot>;

  constructor(props: EventSectionConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new EventSectionId(props.id)
        : props.id ?? new EventSectionId();
    this.name = props.name;
    this.description = props.description ?? undefined;
    this.is_published = props.is_published;
    this.total_spots = props.total_spots;
    this.total_spots_reserved = props.total_spots_reserved;
    this.price = props.price;
    this.spots = props.spots ?? new Set<EventSpot>();
  }

  static create(command: CreateCommandEventSection): EventSection {
    const section = new EventSection({
      name: command.name,
      total_spots: command.total_spots,
      price: command.price,
      description: command.description,
      is_published: false,
      total_spots_reserved: 0,
    });
    section.initSpots();
    return section;
  }

  private initSpots() {
    for (let i = 0; i < this.total_spots; i++) {
      this.spots.add(EventSpot.create());
    }
  }

  publishAll() {
    this.publish();
    this.spots.forEach((spot) => spot.publish());
  }

  publish() {
    this.is_published = true;
  }

  unPublishAll() {
    this.unPublish();
    this.spots.forEach((spot) => spot.unPublish());
  }

  unPublish() {
    this.is_published = false;
  }

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description?: string) {
    this.description = description;
  }

  changePrice(price: number) {
    this.price = price;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      is_published: this.is_published,
      total_spots: this.total_spots,
      total_spots_reserved: this.total_spots_reserved,
      price: this.price,
      spots: [...this.spots].map((spot) => spot.toJSON()),
    };
  }
}
