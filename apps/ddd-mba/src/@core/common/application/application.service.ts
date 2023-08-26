import { DomainEventMediator } from '../domain/domain-event-mediator';
import { IUnitOfWork } from './unit-of-work.interface';

export class ApplicationService {
  constructor(
    private uow: IUnitOfWork,
    private domainEventMediator: DomainEventMediator,
  ) {}

  async start() {}
  async finish() {
    const aggregateRoots = this.uow.getAggregateRoots();
    for (const aggregateRoot of aggregateRoots) {
      await this.domainEventMediator.publish(aggregateRoot);
    }
    await this.uow.commit();
    for (const aggregateRoot of aggregateRoots) {
      await this.domainEventMediator.publishForIntegration(aggregateRoot);
    }
  }
  async fail() {}

  async run<T>(callback: () => Promise<T>): Promise<T> {
    await this.start();
    try {
      const result = await callback();
      await this.finish();
      return result;
    } catch (e) {
      await this.fail();
      throw e;
    }
  }
}
