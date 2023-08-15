import { Test, TestingModule } from '@nestjs/testing';
import { PartnersController } from './partners.controller';
import { PartnerService } from '../../../src/@core/events/application/partner.service';
import { PartnerMySqlRepository } from '../../../src/@core/events/infra/db/repositories/partner-mysql.repository';

describe('PartnersController', () => {
  let controller: PartnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerService],
      controllers: [PartnersController],
    }).compile();
    controller = module.get<PartnersController>(PartnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a partner', async () => {
    const partner = await controller.create({ name: 'partner name' });
    expect(partner.id).toBeDefined();
  });
});
