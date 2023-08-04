import { IRepository } from '../../common/domain/repository-interface';
import { Customer, CustomerId } from '../entities/customer.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomerRepository extends IRepository<Customer> {
  findById(id: string | CustomerId): Promise<Customer | null>;
}
