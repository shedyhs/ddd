import { IRepository } from '../../common/domain/repository-interface';
import { Event, EventId } from '../entities/event.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEventRepository extends IRepository<Event> {
  findById(id: string | EventId): Promise<Event | null>;
}
