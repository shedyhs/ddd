import { Global, Module } from '@nestjs/common';
import { DomainEventMediator } from '../../src/@core/common/domain/domain-event-manager';

@Global()
@Module({
  providers: [DomainEventMediator],
  exports: [DomainEventMediator],
})
export class DomainEventsModule {}
