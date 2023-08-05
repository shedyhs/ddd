import { IUnitOfWork } from '../../common/application/unit-of-work.interface';
import { EventSectionId } from '../domain/entities/event-section.entity';
import { EventSpotId } from '../domain/entities/event-spot.entity';
import { IEventRepository } from '../domain/repositories/event-repository.interface';
import { IPartnerRepository } from '../domain/repositories/partner-repository.interface';

export class EventService {
  constructor(
    private partnerRepository: IPartnerRepository,
    private eventRepository: IEventRepository,
    private uow: IUnitOfWork,
  ) {}

  async create(input: {
    name: string;
    date: Date;
    description?: string;
    partner_id: string;
  }) {
    const partner = await this.partnerRepository.findById(input.partner_id);
    if (!partner) {
      throw new Error('Partner not found');
    }
    const event = partner.initEvent({
      date: input.date,
      name: input.name,
      description: input.description,
    });
    this.eventRepository.add(event);
    await this.uow.commit();
    return event;
  }

  async update(
    id: string,
    input: { name?: string; description?: string; date: Date },
  ) {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    input.name && event.changeName(input.name);
    input.date && event.changeDate(input.date);
    input.description && event.changeDescription(input.description);
    this.eventRepository.add(event);
    await this.uow.commit();
    return event;
  }

  async addSection(input: {
    name: string;
    description?: string;
    total_spots: number;
    price: number;
    event_id: string;
  }) {
    const event = await this.eventRepository.findById(input.event_id);
    if (!event) {
      throw new Error('Event not found');
    }
    event.addSection({
      name: input.name,
      description: input.description,
      total_spots: input.total_spots,
      price: input.price,
    });
    await this.eventRepository.add(event);
    await this.uow.commit();
    return event;
  }

  async updateSection(input: {
    name?: string;
    description?: string;
    event_id: string;
    section_id: string;
  }) {
    const event = await this.eventRepository.findById(input.event_id);
    if (!event) {
      throw new Error('Event not found');
    }
    const sectionId = new EventSectionId(input.section_id);
    event.changeSectionInformation({
      name: input.name,
      description: input.description,
      section_id: sectionId,
    });
    await this.eventRepository.add(event);
    await this.uow.commit();
    return event.sections;
  }

  async publishAll(input: { event_id: string }) {
    const event = await this.eventRepository.findById(input.event_id);
    if (!event) {
      throw new Error('Event not found');
    }
    event.publishAll();
    await this.eventRepository.add(event);
    await this.uow.commit();
    return event;
  }

  async list() {
    return this.eventRepository.findAll();
  }

  async findSections(event_id: string) {
    const event = await this.eventRepository.findById(event_id);
    if (!event) {
      throw new Error('Event not found');
    }
    return event.sections;
  }

  async findSpots(input: { event_id: string; section_id: string }) {
    const event = await this.eventRepository.findById(input.event_id);
    if (!event) {
      throw new Error('Event not found');
    }
    const section = event.sections.find((section) =>
      section.id.equals(new EventSectionId(input.section_id)),
    );
    if (!section) {
      throw new Error('Section not found');
    }
    return section.spots;
  }

  async changeLocation(input: {
    location: string;
    event_id: string;
    section_id: string;
    spot_id: string;
  }) {
    const event = await this.eventRepository.findById(input.event_id);
    if (!event) {
      throw new Error('Event not found');
    }
    const sectionId = new EventSectionId(input.section_id);
    const spotId = new EventSpotId(input.spot_id);
    event.changeLocation({
      section_id: sectionId,
      spot_id: spotId,
      location: input.location,
    });
    await this.eventRepository.add(event);
    const section = event.sections.find((section) =>
      section.id.equals(sectionId),
    );
    await this.uow.commit();
    return section.spots.find((spot) => spot.id.equals(spotId));
  }
}
