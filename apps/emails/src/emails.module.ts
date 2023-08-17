import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://admin:admin@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [EmailsService, ConsumerService],
})
export class EmailsModule {}
