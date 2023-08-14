import { EntityManager } from '@mikro-orm/mysql';
import { IUnitOfWork } from '../application/unit-of-work.interface';

export class UnitOfWorkMikroOrm implements IUnitOfWork {
  constructor(private entityManager: EntityManager) {}

  async beginTransaction(): Promise<void> {
    return this.entityManager.begin();
  }

  async completeTransaction(): Promise<void> {
    return this.entityManager.commit();
  }

  async rollbackTransaction(): Promise<void> {
    this.entityManager.rollback();
  }
  async runTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.entityManager.transactional(callback)
  }

  async commit(): Promise<void> {
    return this.entityManager.flush();
  }

  async rollback(): Promise<void> {
    this.entityManager.clear();
  }
}
