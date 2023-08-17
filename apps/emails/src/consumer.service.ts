import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ConsumerService {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'PartnerCreatedIntegrationEvent',
    queue: 'emails',
  })
  handle(msg: unknown) {
    console.log('ConsumerService.handle', msg);
  }
}
