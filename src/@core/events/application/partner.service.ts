import { IUnitOfWork } from '../../../../src/@core/common/application/unit-of-work.interface';
import { IPartnerRepository } from '../domain/repositories/partner-repository.interface';
import { Partner } from '../domain/entities/partner.entity';

export class PartnerService {
  constructor(
    private partnerRepository: IPartnerRepository,
    private uow: IUnitOfWork,
  ) {}

  async list() {
    return this.partnerRepository.findAll();
  }

  async register(input: { name: string }) {
    const partner = Partner.create(input);
    await this.partnerRepository.add(partner);
    await this.uow.commit();
    return partner;
  }

  async update(id: string, input: { name?: string }) {
    const partner = await this.partnerRepository.findById(id);
    if (!partner) {
      throw new Error(`Partner not found with id: ${id}`);
    }

    input.name && partner.changeName(input.name);

    await this.partnerRepository.add(partner);
    await this.uow.commit();
    return partner;
  }
}
