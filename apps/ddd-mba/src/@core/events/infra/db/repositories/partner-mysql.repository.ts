import { EntityManager } from '@mikro-orm/mysql';
import {
  Partner,
  PartnerId,
} from '../../../domain/entities/partner.entity';
import { IPartnerRepository } from '../../../../../../src/@core/events/domain/repositories/partner-repository.interface';

export class PartnerMySqlRepository implements IPartnerRepository {
  constructor(private readonly entityManager: EntityManager) {}
  async add(entity: Partner): Promise<void> {
    this.entityManager.persist(entity);
  }
  async findById(id: string | PartnerId): Promise<Partner | null> {
    return this.entityManager.findOne(Partner, {
      id: typeof id === 'string' ? new PartnerId(id) : id,
    });
  }
  async findAll(): Promise<Partner[]> {
    return this.entityManager.find(Partner, {});
  }
  async delete(entity: Partner): Promise<void> {
    this.entityManager.remove(entity);
  }
}
