import { Module } from '@nestjs/common';
import { ApplicationService } from '../../src/@core/common/application/application.service';
import { DomainEventMediator } from '../@core/common/domain/domain-event-mediator';
import { IUnitOfWork } from '../../src/@core/common/application/unit-of-work.interface';

@Module({
  providers: [
    {
      provide: ApplicationService,
      useFactory: (
        uow: IUnitOfWork,
        domainEventMediator: DomainEventMediator,
      ) => new ApplicationService(uow, domainEventMediator),
      inject: ['IUnitOfWork', DomainEventMediator],
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
