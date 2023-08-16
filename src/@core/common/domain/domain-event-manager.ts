// During the class the teacher says to use as "Menager" but the name of the pattern is Mediator
import EventEmitter2, { ListenerFn } from 'eventemitter2';
import { AggregateRoot } from './aggregate-root';

// just to assimilate with the market standard I will use it as a mediator
export class DomainEventMediator {
  eventEmmitter: EventEmitter2;
  constructor() {
    this.eventEmmitter = new EventEmitter2({
      wildcard: true,
    });
  }
  register(event: string, handler: ListenerFn) {
    this.eventEmmitter.on(event, handler);
  }
  async publish(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.events) {
      const eventClassName = event.constructor.name;
      await this.eventEmmitter.emitAsync(eventClassName, event);
    }
  }
}
