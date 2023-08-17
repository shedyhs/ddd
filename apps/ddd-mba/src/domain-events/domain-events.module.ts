import { Global, Module } from '@nestjs/common';
import { DomainEventMediator } from '../../src/@core/common/domain/domain-event-manager';
import { IntegrationEventsPublisher } from './integration-events.publisher';

@Global()
@Module({
  providers: [DomainEventMediator, IntegrationEventsPublisher],
  exports: [DomainEventMediator],
})
export class DomainEventsModule {}
