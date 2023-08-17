import { IRepository } from '../../../common/domain/repository-interface';
import { Order, OrderId } from '../entities/order.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOrderRepository extends IRepository<Order> {
  findById(id: string | OrderId): Promise<Order | null>;
}
