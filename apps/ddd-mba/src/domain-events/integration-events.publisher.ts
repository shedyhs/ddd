import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { IIntegrationEvent } from '../@core/common/domain/integration-event';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';

@Processor('integration-events')
export class IntegrationEventsPublisher {
  constructor(private amqpConnection: AmqpConnection) {}
  @Process()
  async handle(job: Job<IIntegrationEvent>) {
    await this.amqpConnection.publish(
      'amq.direct',
      job.data.event_name,
      job.data,
    );
    return {};
  }
}
