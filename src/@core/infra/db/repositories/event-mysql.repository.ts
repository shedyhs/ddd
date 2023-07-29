import { EntityManager } from '@mikro-orm/mysql';
import { Event, EventId } from '../../../domain/entities/event.entity';
import { IEventRepository } from '../../../../../src/@core/domain/repositories/event-repository.interface';

export class EventMySqlRepository implements IEventRepository {
  constructor(private readonly entityManager: EntityManager) {}
  async add(entity: Event): Promise<void> {
    this.entityManager.persist(entity);
  }
  async findById(id: string | EventId): Promise<Event | null> {
    return this.entityManager.findOne(Event, {
      id: typeof id === 'string' ? new EventId(id) : id,
    });
  }
  async findAll(): Promise<Event[]> {
    return this.entityManager.find(Event, {});
  }
  async delete(entity: Event): Promise<void> {
    this.entityManager.remove(entity);
  }
}
