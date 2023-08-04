import { IRepository } from '../../common/domain/repository-interface';
import { Partner, PartnerId } from '../entities/partner.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPartnerRepository extends IRepository<Partner> {
  findById(id: string | PartnerId): Promise<Partner | null>;
}
