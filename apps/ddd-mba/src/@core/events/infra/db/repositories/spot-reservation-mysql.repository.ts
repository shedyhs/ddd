import { EntityManager } from '@mikro-orm/mysql';
import { SpotReservation } from '../../../domain/entities/spot-reservation.entity';
import { ISpotReservationRepository } from '../../../domain/repositories/spot-reservation-repository.interface';
import { EventSpotId } from '../../../../events/domain/entities/event-spot.entity';

export class SpotReservationMySqlRepository implements ISpotReservationRepository {
  constructor(private readonly entityManager: EntityManager) {}
  async add(entity: SpotReservation): Promise<void> {
    this.entityManager.persist(entity);
  }
  async findById(id: string | EventSpotId): Promise<SpotReservation | null> {
    return this.entityManager.findOne(SpotReservation, {
      spot_id: typeof id === 'string' ? new EventSpotId(id) : id,
    });
  }
  async findAll(): Promise<SpotReservation[]> {
    return this.entityManager.find(SpotReservation, {});
  }
  async delete(entity: SpotReservation): Promise<void> {
    this.entityManager.remove(entity);
  }
}
