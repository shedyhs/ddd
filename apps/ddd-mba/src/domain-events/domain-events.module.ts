import { Global, Module, OnModuleInit } from '@nestjs/common';
import { DomainEventMediator } from '../@core/common/domain/domain-event-mediator';
import { IntegrationEventsPublisher } from './integration-events.publisher';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { StoredEventSchema } from '../@core/stored-events/infra/schemas';
import { EntityManager } from '@mikro-orm/mysql';
import { StoredEventMySqlRepository } from '../@core/stored-events/infra/db/repositories/stored-event-mysql.repository';
import { IDomainEvent } from '../@core/common/domain/domain-event';
import { ModuleRef } from '@nestjs/core';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([StoredEventSchema])],
  providers: [
    DomainEventMediator,
    IntegrationEventsPublisher,
    {
      provide: 'IStoredEventRepository',
      useFactory: (entityManager: EntityManager) =>
        new StoredEventMySqlRepository(entityManager),
      inject: [EntityManager],
    },
  ],
  exports: [DomainEventMediator],
})
export class DomainEventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventMediator: DomainEventMediator,
    private moduleRef: ModuleRef,
  ) {}
  async onModuleInit() {
    this.domainEventMediator.register('*', async (event: IDomainEvent) => {
      const repository = await this.moduleRef.resolve('IStoredEventRepository');
      await repository.add(event);
    });
  }
}
