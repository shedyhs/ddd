import { IRepository } from '../../../common/domain/repository-interface';
import { SpotReservation } from '../entities/spot-reservation.entity';
import { EventSpotId } from '../entities/event-spot.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISpotReservationRepository
  extends IRepository<SpotReservation> {
  findById(id: string | EventSpotId): Promise<SpotReservation | null>;
}
