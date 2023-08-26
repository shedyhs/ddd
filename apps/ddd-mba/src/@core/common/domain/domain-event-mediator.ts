// During the class the teacher says to use as "Menager" but the name of the pattern is Mediator
import EventEmitter2, { ListenerFn } from 'eventemitter2';
import { AggregateRoot } from './aggregate-root';

// just to assimilate with the market standard I will use it as a mediator
export class DomainEventMediator {
  domainEventEmmitter: EventEmitter2;
  integrationEventEmmitter: EventEmitter2;
  constructor() {
    this.domainEventEmmitter = new EventEmitter2({
      wildcard: true,
    });
    this.integrationEventEmmitter = new EventEmitter2({
      wildcard: true,
    });
  }
  register(event: string, handler: ListenerFn) {
    this.domainEventEmmitter.on(event, handler);
  }

  registerForIntegration(event: string, handler: ListenerFn) {
    this.integrationEventEmmitter.on(event, handler);
  }

  async publish(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.events) {
      const eventClassName = event.constructor.name;
      await this.domainEventEmmitter.emitAsync(eventClassName, event);
    }
  }

  async publishForIntegration(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.events) {
      const eventClassName = event.constructor.name;
      await this.integrationEventEmmitter.emitAsync(eventClassName, event);
    }
    aggregateRoot.clearEvents();
  }
}
