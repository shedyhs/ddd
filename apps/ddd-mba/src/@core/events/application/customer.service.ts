import { IUnitOfWork } from '../../common/application/unit-of-work.interface';
import { Customer } from '../domain/entities/customer.entity';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';

export class CustomerService {
  constructor(
    private customerRepository: ICustomerRepository,
    private uow: IUnitOfWork,
  ) {}

  async list() {
    return this.customerRepository.findAll();
  }

  async register(input: { name: string; cpf: string }) {
    const customer = Customer.create(input);
    this.customerRepository.add(customer);
    await this.uow.commit();
    return customer;
  }

  async update(id: string, input: { name?: string }) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    input.name && customer.changeName(input.name);
    this.customerRepository.add(customer);
    await this.uow.commit();
    return customer;
  }
}
