import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { EmailsService } from './emails.service';

@Injectable()
export class ConsumerService {
  constructor(private emailService: EmailsService) {}
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'PartnerCreatedIntegrationEvent',
    queue: 'emails',
  })
  handle(message: {
    event_name: string;
    payload: { [key: string]: any };
    event_version: number;
    occurred_on: Date;
  }) {
    console.log(message.event_name)
    switch (message.event_name) {
      case 'PartnerCreatedIntegrationEvent':
        this.emailService.sendWelcomeToPartner(message.payload);
    }
  }
}
